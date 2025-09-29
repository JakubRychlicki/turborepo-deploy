import { renderEmail } from "../renderer.js";

type User = {
  email: string;
  name?: string;
};

type GenerateVerificationEmailArgs = {
  token: string;
  user: User;
};

export async function generateVerificationEmail(
  args: GenerateVerificationEmailArgs
): Promise<string> {
  const { token, user } = args;

  return renderEmail({
    content: `<p>Hi${user.name ? " " + user.name : ""}! Validate your account by clicking the button below.</p>`,
    cta: {
      buttonLabel: "Verify",
      url: `${process.env.PUBLIC_APP_URL}/verify?token=${token}&email=${user.email}`,
    },
    headline: "Verify your account",
  });
}
