import Image from 'next/image';

export default function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/logo_pgmfi.svg"  alt="Logo" width={300} height={300} />
      <h1 className="text-2xl font-bold mt-3 text-center px-18">Sou o assistente virtual da Procuradoria Geral do Município de Foz.</h1>
      <p className="text-lg mt-2">Como posso te ajudar?</p>
    </div>
  );
}
