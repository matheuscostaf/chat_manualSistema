import React from 'react';
import Message from '../components/Message';
import Layout from '../components/Layout';

export default function TestMarkdown() {  const testMessages = [
    {
      timestamp: '1',
      sender: 'bot' as const,
      text: 'Olá! 👋 Em que posso te ajudar hoje? Se você tiver alguma questão relacionada a débitos em processos no fórum ou protesto, ou qualquer outro assunto dentro da área de atuação da Procuradoria, pode me perguntar!\n\nPara mais dúvidas, favor entrar em contato com a Procuradoria Geral do Município: WhatsApp: (45) 8401-6137 E-mail: procuradoria@pmfi.pr.gov.br Horário de funcionamento: 08:00 ás 17:00 Endereço: Avenida Jorge Schimmelpfeng, 50 - Centro CEP 85851-110'
    },
    {
      timestamp: '2',
      sender: 'bot' as const,
      text: 'Você pode acessar o **Portal da Transparência** em: https://transparencia.pmfi.pr.gov.br/'
    },
    {
      timestamp: '3',
      sender: 'bot' as const,
      text: 'Para mais informações, consulte:\n- [Site oficial](https://www.pmfi.pr.gov.br)\n- [Legislação municipal](https://leismunicipais.com.br/foz-do-iguacu-pr)\n- Email: contato@pmfi.pr.gov.br\n- Telefone de suporte: (45) 9999-1234'
    },
    {
      timestamp: '4',
      sender: 'user' as const,
      text: 'Obrigado pelos links!'
    },
    {
      timestamp: '5',
      sender: 'bot' as const,
      text: '🎯 **Teste de Auto-Links:**\n\n📞 **WhatsApp:** (45) 8401-6137 - Abre WhatsApp automaticamente\n📧 **Email:** procuradoria@pmfi.pr.gov.br - Abre seu cliente de email\n🌐 **Site:** https://www.pmfi.pr.gov.br - Abre em nova aba\n\nTodos os links são detectados automaticamente! 🚀'
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Teste de Renderização Markdown</h1>
        <div className="space-y-4">
          {testMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="avatar mr-3 flex-shrink-0">
                  <img src="/profile.png" alt="Bot" width={40} height={40} className="rounded-full" />
                </div>
              )}
              <Message {...msg} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
