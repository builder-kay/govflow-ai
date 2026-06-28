export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const LEGAL_LAST_UPDATED = "28 June 2026";
export const LEGAL_OPERATOR = "Team Bytant";
export const LEGAL_PRODUCT = "GovFlow AI";
export const LEGAL_CONTACT_EMAIL = "support@bytant.com";

export const LEGAL_LINKS = [
  { href: "/legal", label: "Legal hub" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export const termsOfService: LegalDocument = {
  slug: "terms",
  title: "Terms of Service",
  summary: "Rules for using GovFlow AI, operated by Team Bytant.",
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      id: "acceptance",
      title: "1. Acceptance of these terms",
      paragraphs: [
        `By accessing or using ${LEGAL_PRODUCT} (“GovFlow”, “we”, “us”, “our”), you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the platform.`,
        "GovFlow is operated by Team Bytant. These terms apply to all visitors, registered users, and anyone who interacts with our website, applications, or related services.",
      ],
    },
    {
      id: "service",
      title: "2. What GovFlow provides",
      paragraphs: [
        "GovFlow is a guidance and preparation platform for government-related processes in Ghana. We help users understand steps, build checklists, locate offices, upload documents for AI-assisted explanation, and interact with an AI assistant.",
        "Some users may be offered a paid delegated-assistance pilot called GovFlow Agent. Under Agent, GovFlow coordinators and vetted field runners may assist with non-presence administrative follow-ups based on your explicit consent and submitted authorization details.",
        "GovFlow does not submit applications on your behalf, does not represent any government agency, and does not provide legal, tax, or immigration advice. Official applications must still be completed through the relevant government portals, offices, or authorised channels.",
      ],
    },
    {
      id: "eligibility",
      title: "3. Eligibility and accounts",
      paragraphs: [
        "You must be at least 18 years old, or have permission from a parent or guardian, to create an account and use GovFlow.",
        "You are responsible for keeping your login credentials secure and for all activity under your account. Notify us promptly if you suspect unauthorised access.",
      ],
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable use",
      paragraphs: ["You agree not to:"],
      bullets: [
        "Use GovFlow for unlawful, fraudulent, or harmful purposes.",
        "Upload content you do not have the right to share, including forged documents or others’ personal data without consent.",
        "Attempt to reverse engineer, scrape, overload, or disrupt the platform or its integrations.",
        "Misrepresent GovFlow outputs as official government decisions, approvals, or legal advice.",
        "Share sensitive credentials (PINs, passwords, full payment card numbers) in chat or document uploads when avoidable.",
      ],
    },
    {
      id: "ai-content",
      title: "5. AI-generated content",
      paragraphs: [
        "GovFlow may use artificial intelligence to generate roadmaps, explanations, chat responses, and document summaries. AI outputs can be incomplete, outdated, or incorrect.",
        "You must independently verify all requirements, fees, forms, deadlines, and office details with official government sources before acting. Team Bytant is not liable for decisions made solely on AI-generated content.",
      ],
    },
    {
      id: "ip",
      title: "6. Intellectual property",
      paragraphs: [
        "GovFlow’s branding, software, design, and original content are owned by Team Bytant or its licensors. You receive a limited, non-exclusive, revocable licence to use the platform for personal, non-commercial preparation purposes unless we agree otherwise in writing.",
        "You retain ownership of content you upload. You grant us a licence to process that content solely to provide GovFlow features (e.g. document analysis and chat context) as described in our Privacy Policy.",
      ],
    },
    {
      id: "availability",
      title: "7. Availability and changes",
      paragraphs: [
        "We may update, suspend, or discontinue features at any time. We aim for reliable service but do not guarantee uninterrupted access.",
        "We may revise these Terms from time to time. Material changes will be reflected on this page with an updated date. Continued use after changes means you accept the revised Terms.",
      ],
    },
    {
      id: "liability",
      title: "8. Limitation of liability",
      paragraphs: [
        "To the fullest extent permitted by law, Team Bytant and GovFlow are not liable for indirect, incidental, special, or consequential damages arising from your use of the platform, including missed deadlines, rejected applications, or reliance on guidance or AI outputs.",
        "Our total liability for any claim relating to GovFlow shall not exceed the amount you paid us for the service in the twelve (12) months before the claim, or GHS 100 if you use the free tier.",
      ],
    },
    {
      id: "relay",
      title: "9. GovFlow Agent (delegated assistance)",
      paragraphs: [
        "When available, GovFlow Agent is a paid concierge-style support layer for selected services. Agent covers preparation and follow-up support only within the scope you authorize.",
        "You remain responsible for all legally required in-person appearances (for example biometric capture), truthfulness of submitted information, and final review of official submissions before completion.",
        "Agent fees cover GovFlow coordination services only unless explicitly stated otherwise. Government processing fees, penalties, third-party charges, and courier costs are separate.",
        "If you cancel after work has started, refunds may be partial or unavailable depending on completed activities and incurred costs.",
      ],
    },
    {
      id: "termination",
      title: "10. Termination",
      paragraphs: [
        "You may stop using GovFlow at any time. We may suspend or terminate access if you violate these Terms or if required for security or legal reasons.",
        "Sections that by nature should survive termination (including disclaimers, liability limits, and governing law) will continue to apply.",
      ],
    },
    {
      id: "law",
      title: "11. Governing law",
      paragraphs: [
        "These Terms are governed by the laws of the Republic of Ghana, without regard to conflict-of-law principles. Disputes shall be subject to the exclusive jurisdiction of the courts of Ghana, unless mandatory consumer protection rules require otherwise.",
        `Questions about these Terms: ${LEGAL_CONTACT_EMAIL}.`,
      ],
    },
  ],
};

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  summary: "How GovFlow AI collects, uses, and protects your information.",
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      id: "intro",
      title: "1. Overview",
      paragraphs: [
        `${LEGAL_OPERATOR} (“we”, “us”) operates ${LEGAL_PRODUCT}. This Privacy Policy explains what information we collect, why we collect it, and the choices you have.`,
        "GovFlow is designed to help you prepare for government services. We aim to collect only what is needed to run the platform responsibly.",
      ],
    },
    {
      id: "collect",
      title: "2. Information we collect",
      paragraphs: ["Depending on how you use GovFlow, we may process:"],
      bullets: [
        "Account information — phone number or email used to sign in, and optional display name.",
        "Usage data — pages visited, service selections, checklist progress, and roadmap state stored on your device.",
        "Documents you upload — file name, type, extracted text, and AI-generated summaries stored locally in your browser for chat context.",
        "Agent request data (if you use GovFlow Agent) — contact details, service-specific intake details, authorization selections, operations timeline events, and support notes.",
        "Location data — only if you enable “Use my location” on the Office Locator; used to estimate distances, not stored on our servers by default.",
        "AI interactions — prompts and context sent to our AI providers when you use the assistant or document analysis features.",
        "Technical data — browser type, device information, and logs needed for security and debugging.",
      ],
    },
    {
      id: "use",
      title: "3. How we use information",
      paragraphs: ["We use information to:"],
      bullets: [
        "Create and manage your account (via Supabase authentication).",
        "Personalise roadmaps, checklists, and saved progress.",
        "Operate GovFlow Agent workflows, including coordinator assignments, user-presence alerts, and completion tracking where you opted into delegated support.",
        "Provide AI chat and document explanation features.",
        "Show nearby or area-based office listings.",
        "Improve reliability, prevent abuse, and comply with law.",
      ],
    },
    {
      id: "sharing",
      title: "4. When we share information",
      paragraphs: [
        "We do not sell your personal information. We share data only with service providers that help us operate GovFlow, such as:",
        "These providers process data under contractual safeguards and only for the purposes described. We may also disclose information if required by law or to protect rights, safety, and security.",
      ],
      bullets: [
        "Supabase — authentication and account management.",
        "OpenAI — AI assistant and document analysis (when configured).",
        "Arkesel — OTP and service notifications by SMS (including Agent presence alerts).",
        "Paystack — payment processing for paid services (if enabled).",
        "OpenStreetMap / Nominatim — geocoding office locations.",
        "Infrastructure providers — hosting and security services.",
      ],
    },
    {
      id: "storage",
      title: "5. Storage and retention",
      paragraphs: [
        "Much of your GovFlow progress (checklists, roadmaps, uploaded document summaries) is stored locally in your browser via local storage. Clearing browser data may remove this information.",
        "Account credentials are managed through Supabase. We retain account-related records as long as your account is active and as needed for legal, security, or operational purposes.",
        "Agent request records, payment references, and operations logs may be retained for support, fraud prevention, accounting, and dispute resolution for a reasonable period under applicable law.",
        "AI providers may retain API logs according to their own policies. Avoid uploading unnecessary sensitive information.",
      ],
    },
    {
      id: "rights",
      title: "6. Your choices and rights",
      paragraphs: ["You can:"],
      bullets: [
        "Update your display name in Profile settings.",
        "Delete saved documents from the Documents page.",
        "Sign out to end your session on the current device.",
        "Contact us to request access, correction, or deletion of account information where applicable under Ghana data protection principles.",
      ],
    },
    {
      id: "security",
      title: "7. Security",
      paragraphs: [
        "We use reasonable technical and organisational measures to protect information. No online service is completely secure; use strong passwords and protect your device.",
      ],
    },
    {
      id: "children",
      title: "8. Children",
      paragraphs: [
        "GovFlow is not directed at children under 13. We do not knowingly collect personal information from children without appropriate consent.",
      ],
    },
    {
      id: "changes",
      title: "9. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use after updates means you accept the revised policy.",
        `Privacy questions: ${LEGAL_CONTACT_EMAIL}.`,
      ],
    },
  ],
};

// Fix privacy section 4 - I used paragraphs_after which isn't in type. Let me fix in the component or merge into paragraphs.

export const cookiePolicy: LegalDocument = {
  slug: "cookies",
  title: "Cookie Policy",
  summary: "How GovFlow AI uses cookies and similar technologies.",
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      id: "what",
      title: "1. What are cookies?",
      paragraphs: [
        "Cookies are small text files stored on your device when you visit a website. Similar technologies include local storage and session storage, which GovFlow also uses to remember your preferences and progress.",
      ],
    },
    {
      id: "use",
      title: "2. How GovFlow uses cookies and local storage",
      paragraphs: ["We use these technologies to:"],
      bullets: [
        "Keep you signed in (session/authentication cookies via Supabase).",
        "Remember accessibility preferences (e.g. bigger text).",
        "Store checklist progress, roadmaps, and saved document summaries on your device.",
        "Maintain AI chat session identifiers where applicable.",
      ],
    },
    {
      id: "types",
      title: "3. Types we use",
      paragraphs: [],
      bullets: [
        "Strictly necessary — required for login and core features.",
        "Functional — remember settings and progress.",
        "Analytics — if enabled in future, to understand usage patterns in aggregate.",
      ],
    },
    {
      id: "control",
      title: "4. Your controls",
      paragraphs: [
        "You can block or delete cookies through your browser settings. Blocking strictly necessary cookies may prevent GovFlow from working correctly.",
        "Clearing site data will remove locally stored roadmaps, documents, and preferences on that device.",
      ],
    },
    {
      id: "third-party",
      title: "5. Third-party cookies",
      paragraphs: [
        "Authentication and AI features may set or rely on cookies from Supabase, OpenAI, or other integrated providers when you use those features. Refer to their policies for details.",
      ],
    },
    {
      id: "contact",
      title: "6. Contact",
      paragraphs: [`Questions about this Cookie Policy: ${LEGAL_CONTACT_EMAIL}.`],
    },
  ],
};

export const disclaimer: LegalDocument = {
  slug: "disclaimer",
  title: "Disclaimer",
  summary: "Important limitations on GovFlow AI guidance and content.",
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      id: "general",
      title: "General disclaimer",
      paragraphs: [
        `${LEGAL_PRODUCT} is an informational and preparation tool operated by ${LEGAL_OPERATOR}. It is not a government agency, law firm, accounting firm, or official application portal.`,
        "All content — including roadmaps, checklists, office listings, fee estimates, timelines, and AI responses — is provided for general guidance only and may be incomplete, outdated, or incorrect.",
        "Where GovFlow Agent is offered, delegated assistance remains a support service. It does not guarantee approvals, accelerated processing, or preferred treatment by any government office.",
      ],
    },
    {
      id: "official",
      title: "Official sources",
      paragraphs: [
        "Always confirm requirements, forms, fees, appointment rules, and processing times directly with the responsible agency or official portal before paying, travelling, or submitting documents.",
        "Even with Agent support, you are responsible for attending required in-person steps, confirming final submission details, and providing truthful documents.",
        "Links to third-party websites (government portals, OpenStreetMap, etc.) are provided for convenience. We do not control and are not responsible for their content or availability.",
      ],
    },
    {
      id: "ai",
      title: "AI disclaimer",
      paragraphs: [
        "AI-generated explanations and document analysis are not guaranteed to be accurate. Do not rely on them as the sole basis for legal, financial, or compliance decisions.",
        "Redact or avoid uploading highly sensitive information (full ID numbers, PINs, banking details) unless you accept the risk of processing by AI systems.",
      ],
    },
    {
      id: "offices",
      title: "Office locator disclaimer",
      paragraphs: [
        "Office addresses and distances are estimates based on third-party map data and your selected area or device location. Offices may move, close, or change hours without notice.",
      ],
    },
    {
      id: "no-warranty",
      title: "No warranty",
      paragraphs: [
        'GovFlow is provided "as is" and "as available" without warranties of any kind, whether express or implied, including fitness for a particular purpose or accuracy of information.',
      ],
    },
  ],
};

export const ALL_LEGAL_DOCUMENTS: LegalDocument[] = [
  termsOfService,
  privacyPolicy,
  cookiePolicy,
  disclaimer,
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return ALL_LEGAL_DOCUMENTS.find((doc) => doc.slug === slug);
}
