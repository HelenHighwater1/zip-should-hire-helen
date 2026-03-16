// CARDS.ts
// Full card deck for Procurement Panic.
// Cards are grouped into tiers and shuffled within each tier at game start.
// Routing rules for each department are defined in DEPARTMENTS.ts.

import type { DepartmentId } from './DEPARTMENTS';

export type Urgency = 'normal' | 'urgent';

export interface Card {
  id: string;
  employee: string;
  department: string;
  description: string;
  amount: number;
  correctDepartment: DepartmentId;
  urgency: Urgency;
}

// ---------------------------------------------------------------------------
// TIER 1 - Easy & Obvious (12 cards)
// One card on the belt at a time. Categories are unambiguous. Amounts are small.
// Player should feel competent and confident.
// ---------------------------------------------------------------------------

const TIER_1: Card[] = [
  {
    id: 't1-01',
    employee: 'Sarah',
    department: 'HR',
    description: 'Office supplies reorder - paper, pens, printer cartridges. The usual.',
    amount: 180,
    correctDepartment: 'finance',
    urgency: 'normal',
  },
  {
    id: 't1-02',
    employee: 'Priya',
    department: 'Engineering',
    description: 'Udemy Business subscription - 15 seats for the engineering team, needs license provisioning.',
    amount: 240,
    correctDepartment: 'it',
    urgency: 'normal',
  },
  {
    id: 't1-03',
    employee: 'Dave',
    department: 'Sales',
    description: 'Client dinner reimbursement. Receipt attached. It went well, I think.',
    amount: 340,
    correctDepartment: 'finance',
    urgency: 'normal',
  },
  {
    id: 't1-04',
    employee: 'Karen',
    department: 'Marketing',
    description: 'One-off payment to a freelance copywriter. Project delivered, no ongoing engagement.',
    amount: 950,
    correctDepartment: 'finance',
    urgency: 'normal',
  },
  {
    id: 't1-05',
    employee: 'Todd',
    department: 'IT',
    description: 'Annual antivirus renewal for all company laptops. Same vendor as last year.',
    amount: 890,
    correctDepartment: 'it',
    urgency: 'normal',
  },
  {
    id: 't1-06',
    employee: 'Marcus',
    department: 'Sales',
    description: 'CRM license for a new sales rep starting Monday. Standard seat addition.',
    amount: 600,
    correctDepartment: 'it',
    urgency: 'urgent',
  },
  {
    id: 't1-07',
    employee: 'Linda',
    department: 'Ops',
    description: 'Setting up a courier account for shipping client materials. Flat monthly rate.',
    amount: 420,
    correctDepartment: 'finance',
    urgency: 'normal',
  },
  {
    id: 't1-08',
    employee: 'Sarah',
    department: 'HR',
    description: 'New contractor agreement - 3 month engagement, start date next week.',
    amount: 8500,
    correctDepartment: 'legal',
    urgency: 'urgent',
  },
  {
    id: 't1-09',
    employee: 'Priya',
    department: 'Engineering',
    description: 'Spinning up a new AWS environment for the staging infrastructure. New account setup.',
    amount: 1800,
    correctDepartment: 'it',
    urgency: 'normal',
  },
  {
    id: 't1-10',
    employee: 'Karen',
    department: 'Marketing',
    description: 'Q3 campaign print materials - brochures and banners. Vendor invoice attached.',
    amount: 2200,
    correctDepartment: 'finance',
    urgency: 'normal',
  },
  {
    id: 't1-11',
    employee: 'Marcus',
    department: 'Sales',
    description: 'New enterprise customer MSA - needs sign-off before we can close the deal.',
    amount: 42000,
    correctDepartment: 'legal',
    urgency: 'urgent',
  },
  {
    id: 't1-12',
    employee: 'Todd',
    department: 'IT',
    description: 'Annual penetration testing - same security firm we use every year.',
    amount: 11000,
    correctDepartment: 'security',
    urgency: 'normal',
  },
];

// ---------------------------------------------------------------------------
// TIER 2 - Medium Difficulty (16 cards)
// Two cards on the belt simultaneously. Some cards are genuinely ambiguous.
// Amounts get larger. A few Flag cards start appearing.
// ---------------------------------------------------------------------------

const TIER_2: Card[] = [
  {
    id: 't2-01',
    employee: 'Karen',
    department: 'Marketing',
    description: 'New analytics vendor - requires read access to our full customer database.',
    amount: 6000,
    correctDepartment: 'security',
    urgency: 'normal',
  },
  {
    id: 't2-02',
    employee: 'Dave',
    department: 'Sales',
    description: '"Client gift baskets" - no client names listed, no occasion mentioned.',
    amount: 760,
    correctDepartment: 'flag',
    urgency: 'normal',
  },
  {
    id: 't2-03',
    employee: 'Linda',
    department: 'Ops',
    description: 'Office lease renewal - 2 year term, new clauses added by the landlord.',
    amount: 64000,
    correctDepartment: 'legal',
    urgency: 'urgent',
  },
  {
    id: 't2-04',
    employee: 'Priya',
    department: 'Engineering',
    description: 'Third-party API integration - vendor requires access to user PII for processing.',
    amount: 3200,
    correctDepartment: 'security',
    urgency: 'normal',
  },
  {
    id: 't2-05',
    employee: 'Todd',
    department: 'IT',
    description: '14 laptop licenses for a team of 9. Todd says the extras are "just in case."',
    amount: 4900,
    correctDepartment: 'flag',
    urgency: 'normal',
  },
  {
    id: 't2-06',
    employee: 'Sarah',
    department: 'HR',
    description: 'External recruiter retainer - 6 month contract, exclusivity clause included.',
    amount: 18000,
    correctDepartment: 'legal',
    urgency: 'normal',
  },
  {
    id: 't2-07',
    employee: 'Marcus',
    department: 'Sales',
    description: 'Sales intelligence platform - pulls data directly from LinkedIn and our CRM.',
    amount: 7200,
    correctDepartment: 'security',
    urgency: 'normal',
  },
  {
    id: 't2-08',
    employee: 'Karen',
    department: 'Marketing',
    description: 'Influencer partnership deal - includes usage rights clause for brand assets.',
    amount: 12000,
    correctDepartment: 'legal',
    urgency: 'normal',
  },
  {
    id: 't2-09',
    employee: 'Dave',
    department: 'Sales',
    description: 'Zoom subscription. "Ours keeps crashing." We already have a company Zoom account.',
    amount: 1400,
    correctDepartment: 'flag',
    urgency: 'normal',
  },
  {
    id: 't2-10',
    employee: 'Linda',
    department: 'Ops',
    description: 'Catering for the quarterly all-hands lunch. 60 people, same caterer as last quarter.',
    amount: 3800,
    correctDepartment: 'finance',
    urgency: 'normal',
  },
  {
    id: 't2-11',
    employee: 'Priya',
    department: 'Engineering',
    description: 'Open source license compliance review - $0 cost but needs legal sign-off before we ship.',
    amount: 0,
    correctDepartment: 'legal',
    urgency: 'urgent',
  },
  {
    id: 't2-12',
    employee: 'Todd',
    department: 'IT',
    description: 'New SIEM tool - monitors all inbound and outbound network traffic in real time.',
    amount: 14000,
    correctDepartment: 'security',
    urgency: 'normal',
  },
  {
    id: 't2-13',
    employee: 'Marcus',
    department: 'Sales',
    description: 'Conference sponsorship payment - booth fee only, no contract, vendor already approved.',
    amount: 8500,
    correctDepartment: 'finance',
    urgency: 'normal',
  },
  {
    id: 't2-14',
    employee: 'Sarah',
    department: 'HR',
    description: 'Background check service for all new hires - vendor requires access to employee records.',
    amount: 2400,
    correctDepartment: 'security',
    urgency: 'normal',
  },
  {
    id: 't2-15',
    employee: 'Karen',
    department: 'Marketing',
    description: 'Rebranding agency proposal - full IP assignment agreement, they own nothing we create together.',
    amount: 38000,
    correctDepartment: 'legal',
    urgency: 'normal',
  },
  {
    id: 't2-16',
    employee: 'Dave',
    department: 'Sales',
    description: 'Standing desk, ergonomic chair, monitor arm, footrest, AND a mini fridge. For "focus."',
    amount: 4200,
    correctDepartment: 'flag',
    urgency: 'normal',
  },
];

// ---------------------------------------------------------------------------
// TIER 3 - Hard & Chaotic (12 cards)
// Three cards on the belt simultaneously. Fast pace, higher stakes.
// More Flag cards. A new face appears (Brad). Descriptions are funnier and darker.
// ---------------------------------------------------------------------------

const TIER_3: Card[] = [
  {
    id: 't3-01',
    employee: 'Todd',
    department: 'IT',
    description: '"Team building retreat" - Napa Valley, wine tasting, 2 nights. Attendees: Todd.',
    amount: 3800,
    correctDepartment: 'flag',
    urgency: 'normal',
  },
  {
    id: 't3-02',
    employee: 'Priya',
    department: 'Engineering',
    description: 'SOC 2 Type II compliance audit - third-party firm needs full infrastructure access.',
    amount: 22000,
    correctDepartment: 'security',
    urgency: 'urgent',
  },
  {
    id: 't3-03',
    employee: 'Brad',
    department: 'Sales',
    description: 'Chartered helicopter to a client meeting. The drive is 18 minutes. Brad is new.',
    amount: 4400,
    correctDepartment: 'flag',
    urgency: 'urgent',
  },
  {
    id: 't3-04',
    employee: 'Karen',
    department: 'Marketing',
    description: 'AI content platform - model will be trained on our proprietary brand assets and copy.',
    amount: 9600,
    correctDepartment: 'legal',
    urgency: 'normal',
  },
  {
    id: 't3-05',
    employee: 'Linda',
    department: 'Ops',
    description: 'Emergency HVAC repair - existing vendor, existing service contract already covers this.',
    amount: 6200,
    correctDepartment: 'finance',
    urgency: 'urgent',
  },
  {
    id: 't3-06',
    employee: 'Marcus',
    department: 'Sales',
    description: 'Six separate subscriptions to the same stock photo website. Six.',
    amount: 1400,
    correctDepartment: 'flag',
    urgency: 'normal',
  },
  {
    id: 't3-07',
    employee: 'Todd',
    department: 'IT',
    description: 'Firewall upgrade - replaces core network infrastructure for the entire office.',
    amount: 31000,
    correctDepartment: 'security',
    urgency: 'urgent',
  },
  {
    id: 't3-08',
    employee: 'Sarah',
    department: 'HR',
    description: 'Employment lawyer retainer - "just in case." Sarah won\'t say what for.',
    amount: 24000,
    correctDepartment: 'legal',
    urgency: 'normal',
  },
  {
    id: 't3-09',
    employee: 'Dave',
    department: 'Sales',
    description: 'Espresso machine for the office. "The last one was fine. I broke it. This one is better."',
    amount: 6200,
    correctDepartment: 'flag',
    urgency: 'normal',
  },
  {
    id: 't3-10',
    employee: 'Priya',
    department: 'Engineering',
    description: 'Zero-day vulnerability disclosure service - external researchers report bugs directly to us.',
    amount: 18000,
    correctDepartment: 'security',
    urgency: 'normal',
  },
  {
    id: 't3-11',
    employee: 'Brad',
    department: 'Sales',
    description: '"Client dinner" - $600, filed at 2:07am on a Saturday. No client name. Brad, again.',
    amount: 600,
    correctDepartment: 'flag',
    urgency: 'urgent',
  },
  {
    id: 't3-12',
    employee: 'Karen',
    department: 'Marketing',
    description: 'Full outdoor billboard campaign - $52k, no brief, no approval chain, launch is "tomorrow."',
    amount: 52000,
    correctDepartment: 'legal',
    urgency: 'urgent',
  },
];

// ---------------------------------------------------------------------------
// Shuffle utility - randomizes cards within each tier, preserves tier order
// ---------------------------------------------------------------------------

function shuffleTier(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Call this at game start to get a fresh, tiered-random deck
export function buildDeck(): Card[] {
  return [
    ...shuffleTier(TIER_1),
    ...shuffleTier(TIER_2),
    ...shuffleTier(TIER_3),
  ];
}

// Total rogue spend cap - game ends if this is exceeded
export const ROGUE_SPEND_CAP = 30000;

// Number of simultaneous cards per tier
export const CARDS_PER_TIER: Record<1 | 2 | 3, number> = {
  1: 1,
  2: 2,
  3: 3,
};
