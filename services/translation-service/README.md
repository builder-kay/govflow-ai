# Translation Microservice (Phase 2)

This service runs separately from Next.js and is used by GovFlow for translation and local-language recognition.

## What it does

- Exposes `GET /health`
- Exposes `GET /languages`
- Exposes `POST /translate` with payload:

```json
{
  "text": "How are you?",
  "source": "eng",
  "target": "twi"
}
```

Returns:

```json
{
  "translatedText": "Wo ho te sen?"
}
```

## Setup

1. Create a Python virtual environment
2. Install dependencies
3. Set API key
4. Run service

```bash
cd services/translation-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set GHANA_NLP_API_KEY=your_key_here
python main.py
```

Service runs by default at `http://127.0.0.1:8001`.

## Wire to Next.js

In the app `.env`:

```env
GHANA_NLP_SERVICE_URL=http://127.0.0.1:8001
```

When this URL is set, Next.js translation routes call this microservice first. If not set, they fall back to direct Khaya API calls.
