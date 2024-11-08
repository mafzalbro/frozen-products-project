import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// Ensure that the JWT secret is securely loaded from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Define a type for the payload object (can be customized based on your project needs)
interface JwtPayloadCustom extends JwtPayload {
  email: string;
}

// Sign JWT function
export const signJwt = (
  payload: JwtPayloadCustom, // Payload now explicitly typed
  expiresIn: string = "1h"
): string => {
  const options: SignOptions = { expiresIn }; // JWT options
  return jwt.sign(payload, JWT_SECRET, options);
};

// Verify JWT function
export const verifyJwt = (token: string): JwtPayloadCustom | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadCustom; // Cast the return type to the custom payload type
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // Check if the token is expired
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("JWT has expired");
      return null;
    }

    return decoded; // Return the decoded payload if not expired
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};
