import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { db } from "@/db";
import { 
  users, 
  sessions, 
  accounts, 
  verifications
} from "@/db/schema";
import type { Role } from "@/db/types";
import ForgotPasswordEmail from "@/components/emails/reset-password";


const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({user, url}, request) => {
            await resend.emails.send({
               from: "CabrelKL@resend.dev",
               to: user.email,
               subject: "Réinitialisation de mot de passe",
               react: ForgotPasswordEmail({ userName: user.name, userEmail: user.email, resetUrl: url }),
           });
         },
        requireEmailVerification: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications,
        },
    }),
    plugins: [
        nextCookies(),
    ],
    session: {
        updateAge: 24 * 60 * 60, // 24 hours
        expiresIn: 60 * 60 * 24 * 7, // 7 days
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "PERSONNEL",
            },
        },
    },
});