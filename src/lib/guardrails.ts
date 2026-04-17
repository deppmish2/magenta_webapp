export interface GuardrailViolation {
  rule: string;
  category: string;
  explanation: string;
  fragment: string;
  severity: "high" | "medium";
}

interface GuardrailRule {
  id: string;
  rule: string;
  category: string;
  explanation: string;
  severity: "high" | "medium";
  patterns: RegExp[];
}

const RULES: GuardrailRule[] = [
  {
    id: "instruction-override",
    rule: "Instruction override attempt",
    category: "Prompt Injection",
    severity: "high",
    explanation:
      "The input contains language designed to override or replace the system's instructions. MagentaAI isolates user input from system context and rejects any attempt to rewrite its operating rules.",
    patterns: [
      /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|context|rules?)/i,
      /forget\s+(everything|all|your\s+instructions?|what\s+you('ve|\s+have)\s+been\s+told)/i,
      /disregard\s+(all\s+)?(previous|prior|your)\s+(instructions?|rules?|context)/i,
      /override\s+(your\s+)?(instructions?|rules?|constraints?|guidelines?)/i,
      /new\s+instructions?:/i,
      /from\s+now\s+on[,\s].{0,40}(you\s+are|act\s+as|behave\s+as)/i,
    ],
  },
  {
    id: "role-jailbreak",
    rule: "Role-play jailbreak",
    category: "Identity Manipulation",
    severity: "high",
    explanation:
      "The input attempts to reassign the assistant's identity or make it adopt an unrestricted persona. MagentaAI enforces a fixed T-Systems advisory role that cannot be overridden by user input.",
    patterns: [
      /you\s+are\s+now\s+(a\s+|an\s+)?(different|unrestricted|new|free)/i,
      /act\s+as\s+(if\s+you\s+(are|were)\s+)?(a\s+|an\s+)?(DAN|jailbroken|unrestricted|uncensored|evil)/i,
      /pretend\s+(you\s+are|to\s+be)\s+(a\s+|an\s+)?(different|unrestricted|rogue)/i,
      /developer\s+mode/i,
      /DAN\s+mode/i,
      /jailbreak/i,
    ],
  },
  {
    id: "system-prompt-extraction",
    rule: "System prompt extraction attempt",
    category: "Data Exfiltration",
    severity: "high",
    explanation:
      "The input is attempting to extract the system prompt or internal configuration. System instructions are confidential and are never exposed to user-facing output in MagentaAI.",
    patterns: [
      /repeat\s+(everything|all|your\s+(instructions?|prompt|system))\s+(above|before|prior)/i,
      /show\s+(me\s+)?(your\s+)?(system\s+prompt|instructions?|initial\s+prompt|training)/i,
      /what\s+(are|were)\s+your\s+(instructions?|system\s+prompt|original\s+prompt)/i,
      /print\s+(your\s+)?(system\s+prompt|instructions?|prompt)/i,
      /output\s+(your\s+)?(full\s+)?(system\s+)?prompt/i,
      /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions?)/i,
    ],
  },
  {
    id: "privilege-escalation",
    rule: "Privilege escalation attempt",
    category: "Access Control",
    severity: "high",
    explanation:
      "The input claims administrative or elevated access to bypass normal operating boundaries. MagentaAI does not recognise in-prompt privilege claims — access control is handled at the platform layer, not through conversation.",
    patterns: [
      /as\s+(an?\s+)?(admin|administrator|superuser|root|developer|operator)/i,
      /i\s+(have|am\s+granted)\s+(admin|root|superuser|elevated|special)\s+(access|privileges?|permissions?)/i,
      /sudo\s+/i,
      /bypass\s+(the\s+)?(safety|security|guardrails?|filters?|restrictions?|policies?)/i,
      /disable\s+(the\s+)?(safety|content|guardrails?|filters?|moderation)/i,
    ],
  },
  {
    id: "indirect-injection",
    rule: "Indirect prompt injection",
    category: "Prompt Injection",
    severity: "medium",
    explanation:
      "The input contains embedded secondary instructions that attempt to redirect the assistant mid-conversation. MagentaAI validates all input before processing and strips injected instruction fragments.",
    patterns: [
      /\[INST\]|\[\/INST\]/i,
      /<\|im_start\|>|<\|im_end\|>/i,
      /<<SYS>>|<\/SYS>/i,
      /\[system\]|\[assistant\]|\[user\]/i,
      /###\s*instruction|###\s*system/i,
      /human:\s.{0,20}assistant:/i,
    ],
  },
];

function findFirstMatchFragment(input: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[0]) {
      return match[0].length > 60 ? match[0].slice(0, 60) + "…" : match[0];
    }
  }
  return input.slice(0, 60) + (input.length > 60 ? "…" : "");
}

export function checkGuardrails(input: string): GuardrailViolation | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  for (const rule of RULES) {
    const matched = rule.patterns.some((pattern) => pattern.test(trimmed));
    if (matched) {
      return {
        rule: rule.rule,
        category: rule.category,
        explanation: rule.explanation,
        fragment: findFirstMatchFragment(trimmed, rule.patterns),
        severity: rule.severity,
      };
    }
  }

  return null;
}
