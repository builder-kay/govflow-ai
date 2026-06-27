import os
from typing import Any, Optional

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


KHAYA_BASE_URL = "https://translation-api.ghananlp.org/v2"

app = FastAPI(title="GovFlow Translation Service", version="0.1.0")


class TranslateRequest(BaseModel):
    text: str = Field(min_length=1)
    source: str = Field(min_length=3)
    target: str = Field(min_length=3)


def _normalize_key_name(language_code: str) -> str:
    mapping = {"eng": "English", "twi": "Twi", "ewe": "Ewe", "gaa": "Ga", "fat": "Fante"}
    return mapping.get(language_code, language_code)


def _extract_translation(payload: Any) -> Optional[str]:
    if isinstance(payload, str) and payload.strip():
        return payload.strip()
    if not isinstance(payload, dict):
        return None
    for key in ("translated_text", "translation", "translatedText", "output", "result", "text"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return None


def _maybe_translate_with_kasa(text: str, source: str, target: str) -> Optional[str]:
    """
    Best-effort adapter for GhanaNLP/kasa. Kasa APIs are not stable for app integration,
    so we attempt common call styles and gracefully fall back to REST if unavailable.
    """
    if os.getenv("GHANA_NLP_USE_KASA", "true").lower() not in {"1", "true", "yes"}:
        return None

    try:
        import kasa  # type: ignore
    except Exception:
        return None

    language_pair = f"{source}-{target}"

    candidates = []
    translate_fn = getattr(kasa, "translate", None)
    if callable(translate_fn):
        candidates.extend(
            [
                lambda: translate_fn(text, language_pair),
                lambda: translate_fn(text=text, language_pair=language_pair),
                lambda: translate_fn(text=text, lang=language_pair),
            ]
        )

    kasa_cls = getattr(kasa, "Kasa", None)
    if kasa_cls:
        try:
            instance = kasa_cls()
            instance_translate = getattr(instance, "translate", None)
            if callable(instance_translate):
                candidates.extend(
                    [
                        lambda: instance_translate(text, language_pair),
                        lambda: instance_translate(text=text, language_pair=language_pair),
                        lambda: instance_translate(text=text, lang=language_pair),
                    ]
                )
        except Exception:
            pass

    for call in candidates:
        try:
            result = call()
            if isinstance(result, str) and result.strip():
                return result.strip()
            if isinstance(result, dict):
                extracted = _extract_translation(result)
                if extracted:
                    return extracted
        except Exception:
            continue

    return None


async def _translate_with_ghana_nlp_rest(text: str, source: str, target: str) -> str:
    api_key = os.getenv("GHANA_NLP_API_KEY", "").strip() or os.getenv("KHAYA_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Missing GHANA_NLP_API_KEY (or KHAYA_API_KEY) in translation service environment.",
        )

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            f"{KHAYA_BASE_URL}/translate",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Ocp-Apim-Subscription-Key": api_key,
                "x-api-key": api_key,
            },
            json={"in": text, "lang": f"{source}-{target}"},
        )

    payload = response.json() if response.content else {}
    if response.status_code >= 400:
        detail = (
            payload.get("error", {}).get("details", [{}])[0].get("message")
            if isinstance(payload, dict)
            else None
        )
        message = (
            detail
            or (payload.get("error", {}).get("message") if isinstance(payload, dict) else None)
            or "Translation request failed."
        )
        raise HTTPException(status_code=response.status_code, detail=message)

    translated = _extract_translation(payload)
    if not translated:
        raise HTTPException(status_code=502, detail="Translation response did not include text.")

    return translated


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/languages")
async def languages() -> dict[str, dict[str, str]]:
    api_key = os.getenv("GHANA_NLP_API_KEY", "").strip() or os.getenv("KHAYA_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Missing GHANA_NLP_API_KEY (or KHAYA_API_KEY) in translation service environment.",
        )

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(
            f"{KHAYA_BASE_URL}/languages",
            headers={
                "Accept": "application/json",
                "Ocp-Apim-Subscription-Key": api_key,
                "x-api-key": api_key,
            },
        )

    payload = response.json() if response.content else {}
    if response.status_code >= 400:
        message = (
            payload.get("error", {}).get("message") if isinstance(payload, dict) else None
        ) or "Failed to fetch languages."
        raise HTTPException(status_code=response.status_code, detail=message)

    languages_payload = payload.get("languages") if isinstance(payload, dict) else None
    if isinstance(languages_payload, dict):
        cleaned = {
            code: str(name)
            for code, name in languages_payload.items()
            if isinstance(code, str) and code.strip()
        }
        if cleaned:
            return {"languages": cleaned}

    # Safe fallback to key codes if provider format changes
    fallback_codes = ["eng", "twi", "ewe", "gaa", "fat"]
    return {"languages": {code: _normalize_key_name(code) for code in fallback_codes}}


@app.post("/translate")
async def translate(body: TranslateRequest) -> dict[str, str]:
    text = body.text.strip()
    source = body.source.strip().lower()
    target = body.target.strip().lower()

    if source == target:
        return {"translatedText": text}

    translated = _maybe_translate_with_kasa(text=text, source=source, target=target)
    if translated:
        return {"translatedText": translated}

    translated = await _translate_with_ghana_nlp_rest(text=text, source=source, target=target)
    return {"translatedText": translated}


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("TRANSLATION_SERVICE_HOST", "127.0.0.1")
    port = int(os.getenv("TRANSLATION_SERVICE_PORT", "8001"))
    uvicorn.run(app, host=host, port=port)
