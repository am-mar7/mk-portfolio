type SessionPayload = {
  email: string;
  expiresAt: number;
};

const SECRET = process.env.ADMIN_SESSION_SECRET || "default_development_secret_session_key_32_chars";

/**
 * Returns clean web crypto key for HMAC signing and verification
 */
async function getCryptoKey(encoder: TextEncoder): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Sign session payload server-side using global web crypto.
 * Works perfectly in standard Node.js & Edge platforms (middleware).
 */
export async function signSession(email: string, expiresAt: number): Promise<string> {
  const payload: SessionPayload = { email, expiresAt };
  const payloadStr = JSON.stringify(payload);
  const encoder = new TextEncoder();

  const key = await getCryptoKey(encoder);

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadStr)
  );

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Base64Url encode payload
  // Buffer.from is node specific, but btoa is safe in both node 16+ and edge middleware!
  const b64Payload = btoa(payloadStr);
  return `${b64Payload}.${signatureHex}`;
}

/**
 * Verify signed session signature and return payload or null.
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [b64Payload, signatureHex] = parts;
  try {
    const payloadStr = atob(b64Payload);
    const payload: SessionPayload = JSON.parse(payloadStr);

    // Verify session has not expired
    if (Date.now() > payload.expiresAt) {
      return null;
    }

    // Verify signature matches
    const encoder = new TextEncoder();
    const key = await getCryptoKey(encoder);

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payloadStr)
    );

    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignatureHex = signatureArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signatureHex === expectedSignatureHex) {
      return payload;
    }
  } catch (err) {
    return null;
  }
  return null;
}

/**
 * Constant-time comparison for passwords and emails to safeguard against timing attacks.
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Compares incoming login credentials with server-side environment variables.
 */
export function verifyCredentials(email: string, password: string): boolean {
  const envEmail = process.env.ADMIN_EMAIL || "admin@portfolio.com";
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envPassword) {
    console.warn("⚠️ ADMIN_PASSWORD env variable is not set. Please set it in .env.local");
    return false;
  }

  const isEmailMatch = constantTimeCompare(email, envEmail);
  const isPasswordMatch = constantTimeCompare(password, envPassword);

  return isEmailMatch && isPasswordMatch;
}
