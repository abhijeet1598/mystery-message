import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface ResponseEmailProps {
  response: string;
  username: string;
}

export default function ResponseEmail({
  response,
  username,
}: ResponseEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
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
      <Preview>Reply from {username} @ Mystery Message</Preview>
      <Section>
        <Row>
          <Text>Hello,</Text>
        </Row>
        <Row>
          <Text>{response}</Text>
        </Row>
      </Section>
      <Section>
        <Row>
          <Text>
            Best, <br /> {username} @ Mystery Message
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
