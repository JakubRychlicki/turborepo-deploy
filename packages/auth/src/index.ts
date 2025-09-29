import { expo } from "@better-auth/expo"
import { prisma } from "@repo/database"
import { betterAuth, type BetterAuthOptions } from "better-auth"
import { admin } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import urlJoin from "url-join"
import { sendEmail, generateVerificationEmail, generateForgotPasswordEmail } from "@repo/email"

export type BetterAuthReturn = ReturnType<typeof betterAuth>

export function initAuth(options: {
  serverUrl: string
  authSecret: string
  webUrl: string

  googleClientId: string
  googleClientSecret: string

  appleClientId: string
  appleClientSecret: string

  facebookClientId: string
  facebookClientSecret: string
}): BetterAuthReturn {
  const config = {
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    baseURL: urlJoin(options.serverUrl, "/api/auth"),
    secret: options.authSecret,
    trustedOrigins: [
      options.webUrl || "",
      "colibra://",
      "https://appleid.apple.com",
    ],
    user: {
      additionalFields: {
        firstname: { type: "string", required: true },
        lastname: { type: "string", required: true },
        gender: { type: "string", required: true },
        role: { type: "string", required: true },
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url, token }: { 
        user: User, 
        url: string, 
        token: string 
      }, request: Request | undefined) => {
        const htmlContent = await generateForgotPasswordEmail({ token, user })
  
        await sendEmail({
          to: user.email,
          subject: 'Reset your password',
          html: htmlContent
        })
      }
    },
    emailVerification: { 
      sendOnSignUp: false,
      sendVerificationEmail: async ({ user, url, token }: { 
        user: User, 
        url: string, 
        token: string 
      }, request: Request | undefined) => {
        const htmlContent = await generateVerificationEmail({ token, user })
  
        await sendEmail({
          to: user.email,
          subject: 'Confirm your email',
          html: htmlContent
        })
      }
    },
    socialProviders: {
      google: {
        prompt: "select_account",
        clientId: options.googleClientId || "",
        clientSecret: options.googleClientSecret || "",
      },
      apple: {
        clientId: options.appleClientId || "",
        clientSecret: options.appleClientSecret || "",
      },
      facebook: {
        clientId: options.facebookClientId || "",
        clientSecret: options.facebookClientSecret || "",
      },
    },
    plugins: [expo(), admin()],
  }

  return betterAuth(config as BetterAuthOptions)
}

export type Auth = BetterAuthReturn
type User =  Auth['$Infer']['Session']['user']
export type Session = Auth['$Infer']['Session']