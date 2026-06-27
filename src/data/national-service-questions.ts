import type { SmartQuestion } from "@/types";

export const nationalServiceQuestions: SmartQuestion[] = [
  {
    id: "ns-completion-status",
    question: "What is your current school completion status?",
    whyWeAsk: "Your NSS readiness depends on whether your institution has fully cleared your records.",
    options: [
      { id: "final-year-completing", label: "Final year and completing this semester" },
      { id: "completed-awaiting-list", label: "Completed and waiting for school list submission" },
      { id: "completed-cleared", label: "Completed and officially cleared by school" },
      { id: "resit", label: "Pending resit/supplementary papers" },
    ],
  },
  {
    id: "ns-nss-number-status",
    question: "Have you created or checked your NSS portal account before?",
    whyWeAsk: "We need to know if you should start from account setup or move directly to posting checks.",
    options: [
      { id: "new", label: "No, I am new to the portal" },
      { id: "existing", label: "Yes, I already have a portal account" },
      { id: "forgot", label: "I forgot my login details" },
    ],
  },
  {
    id: "ns-region-preference",
    question: "Which posting location preference best matches your plan?",
    whyWeAsk: "Posting preference affects planning for accommodation, transport, and reporting timelines.",
    options: [
      { id: "same-region", label: "Same region as my school/home" },
      { id: "any-region", label: "I can accept any region" },
      { id: "specific-region", label: "I am targeting a specific region" },
      { id: "unsure", label: "I am not sure yet" },
    ],
  },
  {
    id: "ns-posting-status",
    question: "What is your current posting status?",
    whyWeAsk: "Different support is needed for students waiting for posting versus those requesting reposting.",
    options: [
      { id: "not-released", label: "Posting not released yet" },
      { id: "posted-not-accepted", label: "Posted but not accepted/reported yet" },
      { id: "accepted", label: "Accepted and ready to report" },
      { id: "needs-reposting", label: "I need reposting or correction" },
    ],
  },
];

export const nationalServiceAnswerKeys = [
  "nationalServiceCompletionStatus",
  "nationalServicePortalStatus",
  "nationalServiceRegionPreference",
  "nationalServicePostingStatus",
] as const;

export const nationalServiceQuestionKeyMap: Record<
  string,
  (typeof nationalServiceAnswerKeys)[number]
> = {
  "ns-completion-status": "nationalServiceCompletionStatus",
  "ns-nss-number-status": "nationalServicePortalStatus",
  "ns-region-preference": "nationalServiceRegionPreference",
  "ns-posting-status": "nationalServicePostingStatus",
};
