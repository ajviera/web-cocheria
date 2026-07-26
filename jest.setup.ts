import '@testing-library/jest-dom';

// Public site config is read from NEXT_PUBLIC_* env at import time. Provide
// deterministic values so contact links render consistently under test.
process.env.NEXT_PUBLIC_CONTACT_PHONE = '15-6151-2447';
process.env.NEXT_PUBLIC_CONTACT_TEL = '+5491161512447';
process.env.NEXT_PUBLIC_CONTACT_WHATSAPP = '5491161512447';
process.env.NEXT_PUBLIC_CONTACT_ADDRESS = 'Av. Gaspar Campos 4848, José C. Paz, Buenos Aires';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_CONTACT_LOCALITY = 'José C. Paz';
process.env.NEXT_PUBLIC_CONTACT_REGION = 'Buenos Aires';

// jsdom does not implement matchMedia. Default to "no preference" so components
// that gate on media queries (reduced motion) behave deterministically; tests
// override the return value where they need a specific preference.
window.matchMedia = jest.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => undefined),
    set: jest.fn(),
  })),
  headers: jest.fn(() => new Map()),
}));
