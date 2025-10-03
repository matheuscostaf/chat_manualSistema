import { GetServerSideProps } from "next";
import Image from 'next/image';
import Link from 'next/link';
import HCaptchaComponent from "@/components/HCaptcha";
import Layout from "@/components/Layout";

interface HomePageProps {
  hcaptchaSiteKey: string | null; // Ensure this allows null
}

export default function HomePage({ hcaptchaSiteKey }: HomePageProps) {
  const handleVerifyCaptcha = (token: string) => {
    if (!token) return;
    window.location.href = `/captcha?token=${token}`;
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-white text-black p-6 justify-center items-center">
        <Image src="/logo_pgmfi.svg" alt="PGM Foz do Iguaçu" width={300} height={300} />
        <div className="p-6">
          <div className="bg-red-600 text-white p-4 rounded-md">
            <p className="font-medium text-justify">Essa é uma ferramenta que se encontra em fase experimental e por este motivo pode apresentar inconsistências e ter seu funcionamento interrompido sem aviso prévio.</p>
          </div>
          <div className="p-2">
            <h3>Ao realizar o desafio você concorda com nossos <Link href="/termoschatpgm.pdf" target="_blank" className="text-blue-600 hover:text-blue-800 underline">termos e condições de uso.</Link></h3>
          </div>
        </div>
        {/* Conditional rendering based on hcaptchaSiteKey presence */}
        {hcaptchaSiteKey ? (
          <HCaptchaComponent siteKey={hcaptchaSiteKey} onVerify={handleVerifyCaptcha} />
        ) : (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error: hCaptcha site key not configured. Please check your environment variables.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.cookies.sessionId) {
    return {
      redirect: {
        destination: '/chat',
        permanent: false
      }
    }
  }

  return {
    props: {
      hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY || null // Ensure null if undefined
    }
  }
}
