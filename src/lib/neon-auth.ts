
import { createAuthClient } from '@neondatabase/neon-js/auth';

// The user will add these env vars later.
// We use a fallback to prevent crashes during build/dev before they are set.
const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || 'https://placeholder-url.neon.tech';

export const authClient = createAuthClient(NEON_AUTH_URL);
