export type CallingCode = {
  code: string; // digits only, without leading '+'
  country: string;
};

// Minimal but practical set; extend as needed
export const CALLING_CODES: CallingCode[] = [
  { code: '1', country: 'United States / Canada' },
  { code: '20', country: 'Egypt' },
  { code: '27', country: 'South Africa' },
  { code: '30', country: 'Greece' },
  { code: '31', country: 'Netherlands' },
  { code: '32', country: 'Belgium' },
  { code: '33', country: 'France' },
  { code: '34', country: 'Spain' },
  { code: '36', country: 'Hungary' },
  { code: '39', country: 'Italy' },
  { code: '40', country: 'Romania' },
  { code: '41', country: 'Switzerland' },
  { code: '44', country: 'United Kingdom' },
  { code: '45', country: 'Denmark' },
  { code: '46', country: 'Sweden' },
  { code: '47', country: 'Norway' },
  { code: '48', country: 'Poland' },
  { code: '49', country: 'Germany' },
  { code: '52', country: 'Mexico' },
  { code: '54', country: 'Argentina' },
  { code: '55', country: 'Brazil' },
  { code: '60', country: 'Malaysia' },
  { code: '61', country: 'Australia' },
  { code: '62', country: 'Indonesia' },
  { code: '63', country: 'Philippines' },
  { code: '64', country: 'New Zealand' },
  { code: '65', country: 'Singapore' },
  { code: '66', country: 'Thailand' },
  { code: '81', country: 'Japan' },
  { code: '82', country: 'South Korea' },
  { code: '84', country: 'Vietnam' },
  { code: '86', country: 'China' },
  { code: '852', country: 'Hong Kong' },
  { code: '853', country: 'Macau' },
  { code: '855', country: 'Cambodia' },
  { code: '856', country: 'Laos' },
  { code: '880', country: 'Bangladesh' },
  { code: '886', country: 'Taiwan' },
  { code: '90', country: 'Turkey' },
  { code: '91', country: 'India' },
  { code: '92', country: 'Pakistan' },
  { code: '94', country: 'Sri Lanka' },
  { code: '95', country: 'Myanmar' },
  { code: '98', country: 'Iran' },
  { code: '971', country: 'United Arab Emirates' },
  { code: '972', country: 'Israel' },
  { code: '973', country: 'Bahrain' },
  { code: '974', country: 'Qatar' },
  { code: '975', country: 'Bhutan' },
  { code: '976', country: 'Mongolia' },
  { code: '977', country: 'Nepal' },
  { code: '961', country: 'Lebanon' },
  { code: '962', country: 'Jordan' },
  { code: '963', country: 'Syria' },
  { code: '964', country: 'Iraq' },
  { code: '966', country: 'Saudi Arabia' },
  { code: '968', country: 'Oman' },
];

export function filterCallingCodes(query: string, limit: number = 8): CallingCode[] {
  const q = query.replace(/\D/g, '');
  if (!q) return CALLING_CODES.slice(0, limit);
  const starts = CALLING_CODES.filter((c) => c.code.startsWith(q));
  const contains = CALLING_CODES.filter((c) => !c.code.startsWith(q) && c.code.includes(q));
  const result = [...starts, ...contains].slice(0, limit);
  return result;
}


