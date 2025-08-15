import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from '@react-email/components';

interface VerifyEmailProps {
  userName: string;
  userEmail: string;
  createdAt: Date;
  verificationUrl: string;
}

const VerificationEmail = (props: VerifyEmailProps) => {
    const {userName, userEmail, createdAt, verificationUrl} = props;
    const link = `${process.env.NEXT_PUBLIC_APP_URL}${verificationUrl}`;

  return (
    <Html lang="fr" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Text className="text-[24px] font-bold text-gray-900 m-0">
                Vérifiez votre adresse email {userEmail}
              </Text>
            </Section>

            {/* Main content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                Bonjour {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
                Votre compte a été créé avec succès ! Voici vos informations de connexion :
              </Text>

              {/* Credentials Box */}
              <Section className="bg-gray-50 border border-gray-200 rounded-[8px] p-[20px] mb-[24px]">
                <Text className="text-[14px] font-bold text-gray-900 mb-[8px] m-0">
                  Vos identifiants de connexion :
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[4px] m-0">
                  <strong>Nom d'utilisateur :</strong> {userName}
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[4px] m-0">
                  <strong>Adresse email :</strong> {userEmail}
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[4px] m-0">
                  <strong>Date de création :</strong> {new Date(createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </Text>
                <Text className="text-[12px] text-orange-600 mt-[8px] m-0">
                  ⚠️ Nous vous recommandons de changer votre mot de passe après votre première connexion.
                </Text>
              </Section>

              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
                Pour finaliser votre inscription et sécuriser votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
              </Text>

              {/* Verification Button */}
              <Section className="text-center mb-[24px]">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border inline-block"
                >
                  Vérifier mon email
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
                Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
              </Text>
              <Text className="text-[14px] text-blue-600 break-all mb-[24px]">
                {verificationUrl}
              </Text>

              <Text className="text-[14px] text-gray-600 leading-[20px]">
                Ce lien expirera dans 24 heures pour des raisons de sécurité.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            {/* Security Notice */}
            <Section className="bg-red-50 border border-red-200 rounded-[8px] p-[16px] mb-[24px]">
              <Text className="text-[14px] text-red-800 leading-[20px] m-0">
                <strong>Important :</strong> Gardez ces informations confidentielles. Ne partagez jamais vos identifiants avec qui que ce soit. Notre équipe ne vous demandera jamais votre mot de passe par email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                Veuillez contacter votre administrateur pour plus d'informations.
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] mt-[16px] m-0">
                © {new Date().getFullYear()} Votre Entreprise.
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] mt-[8px] m-0">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
