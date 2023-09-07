export interface AccessTokenResponse {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleOAuthToken {
  sub: string; // Subject
  iss: string; // Issuer
  aud: string; // Audience
  exp: number; // Expiration Time (Unix timestamp)
  iat: number; // Issued At (Unix timestamp)
  nonce: string; // Nonce
  email: string; // Email
  email_verified: boolean; // Email Verified
  name: string; // Full Name
  given_name: string; // Given Name
  family_name: string; // Family Name
  picture: string; // Profile Picture URL
  locale: string; // Locale
  // Add other specific claims as needed
}
