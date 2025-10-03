import type { Metadata } from "next";
import { Roboto_Flex, Roboto_Mono } from "next/font/google";
import React from 'react';
import Head from 'next/head';

const robotoSans = Roboto_Flex({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agente de IA da Procuradoria Geral do Munícipio de Foz do Iguaçu",
  description: "Agente de IA da Procuradoria Geral do Munícipio de Foz do Iguaçu",
};

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}


export default function Layout({ children, title = "Agente de IA da PGM Foz do Iguaçu" }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <div className="w-full bg-white">
          {children}
        </div>
      </main>
    </>
  );
}

