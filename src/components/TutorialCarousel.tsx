import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface TutorialCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tutorialImages = [
  {
    src: '/tutorial/tutorial-1.png',
    title: 'Bem-vindo ao Assistente Virtual',
    description: 'Este é o assistente virtual da Procuradoria Geral de Foz do Iguaçu. Aqui você pode tirar suas dúvidas jurídicas.'
  },
  {
    src: '/tutorial/tutorial-2.png',
    title: 'Como Fazer Perguntas',
    description: 'Digite sua pergunta no campo de texto e pressione Enter ou clique no botão enviar.'
  },
  {
    src: '/tutorial/tutorial-3.png',
    title: 'Tipos de Consultas',
    description: 'Você pode consultar sobre direitos do consumidor, questões trabalhistas, dúvidas jurídicas e muito mais.'
  },
  {
    src: '/tutorial/tutorial-4.png',
    title: 'Navegação e Recursos',
    description: 'Use o chat de forma natural. O assistente entende perguntas em linguagem cotidiana.'
  },
  {
    src: '/tutorial/tutorial-5.png',
    title: 'Dicas Importantes',
    description: 'Para melhores resultados, seja específico em suas perguntas e forneça contexto quando necessário.'
  },
  {
    src: '/tutorial/tutorial-6.png',
    title: 'Pronto para Começar!',
    description: 'Agora você já sabe como usar o assistente. Vamos começar sua consulta!'
  }
];

const TutorialCarousel: React.FC<TutorialCarouselProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialImages.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Se chegou na última imagem, completa o tutorial
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const currentImage = tutorialImages[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[98vh] overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 sm:p-4 flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">{currentImage.title}</h2>
                <p className="text-blue-100 text-xs sm:text-sm">Etapa {currentStep + 1} de {tutorialImages.length}</p>
              </div>
              <button
                onClick={skipTutorial}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20 flex-shrink-0"
                aria-label="Pular tutorial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 h-2">
              <div 
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialImages.length) * 100}%` }}
              />
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6 flex-1 overflow-y-auto">
              {/* Image */}
              <div className="relative h-[250px] sm:h-[350px] md:h-[450px] mb-4 sm:mb-6 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentImage.src}
                      alt={currentImage.title}
                      fill
                      className="object-contain p-2 sm:p-4"
                      onError={(e) => {
                        // Fallback se a imagem não existir
                        (e.target as HTMLImageElement).src = '/logo_pgmfi.svg';
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Description */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {currentImage.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
                  {currentImage.description}
                </p>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center space-x-2 mb-4 sm:mb-6">
                {tutorialImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-blue-600'
                        : index < currentStep
                        ? 'bg-blue-300'
                        : 'bg-gray-300'
                    }`}
                    aria-label={`Ir para step ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center gap-2 flex-shrink-0">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ← Anterior
                </button>

                <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                  {currentStep + 1} de {tutorialImages.length}
                </span>

                <button
                  onClick={nextStep}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  {currentStep === tutorialImages.length - 1 ? 'Finalizar' : 'Próximo →'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialCarousel;