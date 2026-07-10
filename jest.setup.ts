import '@testing-library/jest-dom';

// Public site config is read from NEXT_PUBLIC_* env at import time. Provide
// deterministic values so contact links render consistently under test.
process.env.NEXT_PUBLIC_CONTACT_PHONE = '15-6151-2447';
process.env.NEXT_PUBLIC_CONTACT_TEL = '+5491161512447';
process.env.NEXT_PUBLIC_CONTACT_WHATSAPP = '5491161512447';
process.env.NEXT_PUBLIC_CONTACT_ADDRESS = 'Av. Gaspar Campos 4848, José C. Paz, Buenos Aires';

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
