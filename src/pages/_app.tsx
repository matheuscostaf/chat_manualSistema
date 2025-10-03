import type { AppProps } from 'next/app';
import { Roboto_Flex, Roboto_Mono } from "next/font/google";
import '@/styles/globals.css'

const robotoSans = Roboto_Flex({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${robotoSans.variable} ${robotoMono.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
