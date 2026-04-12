import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          defaultValue: "CUSTOMER",
        },
        phone: {
          type: "string",
          required: false,
        },
        address: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});