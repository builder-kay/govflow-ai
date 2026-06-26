export function isAgentConfigured(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY && process.env.NEXT_PUBLIC_CHATKIT_AGENT_ID
  );
}

export function getWorkflowId(): string {
  return process.env.NEXT_PUBLIC_CHATKIT_AGENT_ID ?? "";
}

export const GOVFLOW_AGENT_DISCLAIMER =
  "GovFlow helps you prepare and understand government processes. Official applications are still completed through the relevant government portals and offices.";
