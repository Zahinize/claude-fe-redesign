/** Curated value pools combined deterministically into realistic mock records. */

export const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas',
  'Mia', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn',
  'Henry', 'Abigail', 'Alexander', 'Emily', 'Daniel', 'Ella', 'Jackson', 'Scarlett', 'Sebastian',
  'Grace', 'Jack', 'Chloe', 'Aiden', 'Victoria', 'Owen', 'Riley', 'Samuel', 'Aria', 'Matthew',
  'Lily', 'Joseph', 'Aurora', 'Carter', 'Zoe', 'Wyatt', 'Nora', 'Julian', 'Hannah', 'Leo',
]

export const LAST_NAMES = [
  'Thorpe', 'Hayden', 'Walsh', 'Bennett', 'Carter', 'Mercer', 'Donovan', 'Whitfield', 'Ramsey',
  'Sullivan', 'Harper', 'Lawson', 'Blackwood', 'Sinclair', 'Vance', 'Holloway', 'Ashford',
  'Pierce', 'Calloway', 'Reyes', 'Nguyen', 'Patel', 'Kowalski', 'Okafor', 'Rossi', 'Bauer',
  'Costa', 'Hansen', 'Larsen', 'Moreau', 'Schneider', 'Fischer', 'Romano', 'Novak', 'Andersen',
]

export const EMAIL_DOMAINS = [
  'example.com', 'mail.com', 'corpmail.io', 'acme.co', 'globex.net', 'initech.dev', 'umbrella.org',
]

export const PURPOSES = [
  { name: 'Email Marketing', description: 'Receive promotional emails', type: 'Marketing' },
  { name: 'Product Updates', description: 'Notifications about product changes', type: 'Marketing' },
  { name: 'Usage Analytics', description: 'Track product usage to improve features', type: 'Analytics' },
  { name: 'Personalized Ads', description: 'Tailored advertising across channels', type: 'Personalization' },
  { name: 'Service Notifications', description: 'Operational and transactional messages', type: 'Functional' },
  { name: 'Data Sharing', description: 'Share data with trusted partners', type: 'Third-Party' },
  { name: 'SMS Alerts', description: 'Receive text message alerts', type: 'Marketing' },
  { name: 'Newsletter', description: 'Monthly newsletter subscription', type: 'Marketing' },
] as const

export const LEGAL_BASES = ['Consent', 'Legitimate Interest', 'Contract', 'Legal Obligation']

export const LANGUAGES = ['EN', 'DE', 'FR', 'ES', 'IT', 'NL', 'PT']

export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0)',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5)',
  'Mozilla/5.0 (Linux; Android 14)',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64)',
]

export const AUDIT_TEMPLATES = [
  { severity: 'Normal', title: 'Consent captured', description: 'Consent was recorded via the web capture form with full policy acknowledgement and a timestamped signature.' },
  { severity: 'Low', title: 'Preference viewed', description: 'The data subject opened the preference center and reviewed their active consents without making changes.' },
  { severity: 'Medium', title: 'Purpose updated', description: 'A purpose toggle was changed by the data subject, updating the scope of processing for marketing communications.' },
  { severity: 'High', title: 'Policy version mismatch', description: 'The stored policy version differs from the latest published policy. A re-consent prompt may be required to remain compliant.' },
  { severity: 'Critical', title: 'Withdrawal requested', description: 'The data subject requested withdrawal of consent. All downstream processing must cease and linked activities must be notified within the regulatory window.' },
  { severity: 'Normal', title: 'Evidence archived', description: 'Capture evidence including IP address, user agent and timestamp was archived to immutable storage for audit purposes.' },
  { severity: 'Low', title: 'Reminder sent', description: 'An expiry reminder notification was dispatched to the data subject ahead of the consent expiry date.' },
] as const
