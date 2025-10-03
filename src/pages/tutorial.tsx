import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import TutorialCarousel from '@/components/TutorialCarousel';
import Layout from '@/components/Layout';
import { useTutorial } from '@/hooks/useTutorial';

interface TutorialPageProps {
  sessionId: string;
}

const TutorialPage: React.FC<TutorialPageProps> = ({ sessionId }) => {
  const { tutorialCompleted, isLoading, markTutorialCompleted } = useTutorial();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && tutorialCompleted) {
      // Se o tutorial já foi visto, redirecionar diretamente para o chat
      router.push('/chat');
    }
  }, [isLoading, tutorialCompleted, router]);

  const handleTutorialComplete = () => {
    markTutorialCompleted();
    // Redirecionar para o chat após completar o tutorial
    router.push('/chat');
  };

  const handleCloseTutorial = () => {
    markTutorialCompleted(); // Marcar como visto mesmo se pulou
    // Redirecionar para o chat mesmo se fechar o tutorial
    router.push('/chat');
  };

  // Mostrar loading enquanto verifica o status do tutorial
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Se chegou aqui, é porque o tutorial não foi completado, então mostra automaticamente
  return (
    <Layout>
      <TutorialCarousel
        isOpen={true} // Sempre aberto nesta página
        onClose={handleCloseTutorial}
        onComplete={handleTutorialComplete}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionId = context.req.cookies.sessionId;

  if (!sessionId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionId,
    },
  };
};

export default TutorialPage;