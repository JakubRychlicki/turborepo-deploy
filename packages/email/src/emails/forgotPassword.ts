import { renderEmail } from "../renderer.js";

type ForgotPasswordEmailArgs = {
  token?: string;
  user?: { email?: string };
};

export async function generateForgotPasswordEmail(
  args: ForgotPasswordEmailArgs
): Promise<string> {
  return renderEmail({
    content: "<p>Let&apos;s get you back in.</p>",
    cta: {
      buttonLabel: "Reset your password",
      url: `${process.env.PUBLIC_APP_URL}/reset-password?token=${args?.token}`,
    },
    headline: "Locked out?",
  });
}
