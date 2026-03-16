// DEPARTMENTS.ts
// Single source of truth for all department data.
// Used by: game buckets, end screen tooltips, dashboard charts.

export type DepartmentId = 'finance' | 'legal' | 'it' | 'security' | 'flag';

export interface Department {
  id: DepartmentId;
  label: string;
  emoji: string;
  icon?: string;         // path to PNG icon in /public (falls back to emoji if absent)
  color: string;         // references theme tokens - override in theme.ts
  rule: string;          // one-liner routing logic shown on end screen hover
  zipCallout: string;    // how Zip handles this in real life
}

export const DEPARTMENTS: Record<DepartmentId, Department> = {
  finance: {
    id: 'finance',
    label: 'Finance',
    emoji: '💰',
    icon: '/finance.png',
    color: 'var(--color-dept-finance)',
    rule:
      'This involves paying money to a vendor or employee where the only review needed is: should we spend this, and does it fit the budget?',
    zipCallout:
      'Zip automatically captures budget owner, cost center, and spend category at intake - so Finance has everything they need before they ever open the request.',
  },

  legal: {
    id: 'legal',
    label: 'Legal',
    emoji: '⚖️',
    icon: '/scale.png',
    color: 'var(--color-dept-legal)',
    rule:
      'This involves a contract, agreement, IP ownership, liability, or any document someone could sue us over later. If a signature is required anywhere in the process, it goes to Legal.',
    zipCallout:
      'Zip routes contracts to Legal automatically based on vendor type, deal size, and contract flags - before anyone has a chance to sign anything they shouldn\'t.',
  },

  it: {
    id: 'it',
    label: 'IT',
    emoji: '💻',
    icon: '/it.png',
    color: 'var(--color-dept-it)',
    rule:
      'This involves software, hardware, or tech infrastructure where IT needs to vet compatibility, licensing, or asset tracking. The question IT is answering: does this work with what we already have, and can we manage it?',
    zipCallout:
      'Zip flags duplicate software subscriptions, checks against the existing tech stack, and ensures IT is looped in before a new tool is purchased - not after it\'s already in use.',
  },

  security: {
    id: 'security',
    label: 'Security',
    emoji: '🔒',
    icon: '/cyber-security.png',
    color: 'var(--color-dept-security)',
    rule:
      'This involves a third party getting access to our data, systems, or networks - anything that could be a breach vector. The question Security is answering: could this vendor or tool hurt us?',
    zipCallout:
      'Zip automatically triggers security review for any vendor requesting data access, with built-in questionnaires, SOC 2 tracking, and risk scoring - all before the contract is signed.',
  },

  flag: {
    id: 'flag',
    label: 'Flag for Review',
    emoji: '🚩',
    color: 'var(--color-dept-flag)',
    rule:
      'This request is obviously personal, duplicative, or has no legitimate business justification whatsoever. Not just eyebrow-raising - clearly indefensible on its face. When in doubt, route to the correct department instead.',
    zipCallout:
      'Zip\'s AI surfaces duplicate requests, flags out-of-policy spend, and catches suspicious submissions automatically - so your team spends time on real decisions, not playing detective.',
  },
};

// Ordered array for rendering buckets left-to-right in the game UI
export const DEPARTMENT_ORDER: DepartmentId[] = [
  'finance',
  'legal',
  'it',
  'security',
  'flag',
];
