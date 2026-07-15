import "server-only";

import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_google_client_id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "placeholder_google_client_secret",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        input: false,
      },
      accountStatus: {
        type: "string",
        defaultValue: "pending",
        required: false,
        input: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      avatarUrl: {
        type: "string",
        required: false,
      },
      websiteUrl: {
        type: "string",
        required: false,
      },
      location: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: (user as { role?: string }).role ?? "user",
          accountStatus:
            (user as { accountStatus?: string }).accountStatus ?? "pending",
        }),
        expirationTime: "1h",
      },
    }),
  ],
});
