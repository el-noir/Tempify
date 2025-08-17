import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
  Body,
} from "@react-email/components"


interface VerificationEmailProps{
    username: string;
    otp: string;
}

export default function VerificationEmail({username, otp} : VerificationEmailProps){
    return (
            <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Roboto, Verdana, sans-serif" }}>
        <Container style={{ margin: "0 auto", padding: "20px 0 48px", maxWidth: "560px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px" }}>
            <Row>
              <Heading as="h2" style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
                Hello {username},
              </Heading>
            </Row>
            <Row>
              <Text style={{ fontSize: "16px", lineHeight: "24px", marginBottom: "16px" }}>
                Thank you for registering with Tempify! Please use the following verification code to complete
                your registration:
              </Text>
            </Row>
            <Row>
              <Section
                style={{
                  backgroundColor: "#f4f4f4",
                  borderRadius: "4px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                <Text
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    letterSpacing: "4px",
                    margin: "0",
                    color: "#333333",
                  }}
                >
                  {otp}
                </Text>
              </Section>
            </Row>
            <Row>
              <Text style={{ fontSize: "14px", lineHeight: "20px", color: "#666666" }}>
                This code will expire in 1 hour. If you did not request this code, please ignore this email.
              </Text>
            </Row>
            <Row style={{ marginTop: "32px" }}>
              <Button
                href={`http://localhost:3000/verify/${username}`}
                style={{
                  backgroundColor: "#007ee6",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                  padding: "12px 20px",
                }}
              >
                Verify Account
              </Button>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
    )
}

