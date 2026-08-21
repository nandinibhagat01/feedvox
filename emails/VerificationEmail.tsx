import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Your FeedVox verification code is {otp}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Verify your FeedVox account</Heading>

          <Text style={text}>Hi {username},</Text>

          <Text style={text}>
            Thanks for signing up for FeedVox. Use the verification code below
            to verify your email address.
          </Text>

          <Section style={otpContainer}>
            <Text style={otpText}>{otp}</Text>
          </Section>

          <Text style={text}>
            This code will expire soon. If you didn't create a FeedVox account,
            you can safely ignore this email.
          </Text>

          <Button href="https://your-feedvox-domain.com" style={button}>
            Open FeedVox
          </Button>

          <Text style={footer}>
            © {new Date().getFullYear()} FeedVox. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "500px",
  borderRadius: "8px",
};

const heading = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "24px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
};

const otpContainer = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const otpText = {
  color: "#111827",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "8px",
  margin: "0",
};

const button = {
  backgroundColor: "#111827",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 20px",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  marginTop: "32px",
};
