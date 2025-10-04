# Chat Manual Sistema - PGM Foz do Iguaçu

Um assistente virtual inteligente para suporte ao novo sistema da Prefeitura Municipal de Foz do Iguaçu, desenvolvido com Next.js e React.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Iniciar](#como-iniciar)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## 🚀 Sobre o Projeto

O Chat Manual Sistema é um assistente virtual desenvolvido para auxiliar os usuários do novo sistema da Prefeitura Municipal de Foz do Iguaçu. O sistema oferece respostas automatizadas para perguntas frequentes sobre:

- Cadastro de usuários
- Geração de DAM de Recolhimento do ISSQN
- Declaração Eletrônica de Serviços (DES-IF)
- Nota Fiscal de Serviços Eletrônica (NFS-e)
- Cadastro eletrônico (CeC®)
- E muito mais...

## ✨ Funcionalidades

- 💬 **Chat Interativo**: Interface moderna e responsiva para conversas
- 🤖 **Respostas Automatizadas**: Integração com sistema de IA para respostas inteligentes
- 📱 **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- ❓ **FAQ Integrado**: Menu lateral com perguntas frequentes
- 🔒 **Sistema de Sessões**: Controle de sessões para continuidade das conversas
- 🎨 **Interface Intuitiva**: Design limpo e fácil de usar
- ⏱️ **Timeout Otimizado**: Suporte a respostas que podem demorar até 2 minutos
- 🔄 **Indicadores Visuais**: Feedback visual durante o processamento

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 15.2.2** - Framework React para produção
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Framer Motion** - Biblioteca para animações
- **Lucide React** - Ícones modernos

### Backend
- **Next.js API Routes** - API serverless
- **Node.js** - Runtime JavaScript
- **HTTPS Agent** - Para comunicação segura com APIs externas

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatador de código
- **TypeScript** - Tipagem estática

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 💻 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/matheuscostaf/chat_manualSistema.git
cd chat_manualSistema
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo (se existir)
cp .env.example .env.local

# Ou crie um novo arquivo .env.local com as seguintes variáveis:
SERVER_URL=https://seu-servidor-api.com/endpoint
HCAPTCHA_SITE_KEY=sua_chave_do_hcaptcha
```

## 🚀 Como Iniciar

### Desenvolvimento

1. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

2. **Abra o navegador**
   - Acesse [http://localhost:3000](http://localhost:3000) (ou porta indicada no terminal)
   - Se a porta 3000 estiver ocupada, o Next.js automaticamente usará a próxima porta disponível

### Produção

1. **Faça o build do projeto**
```bash
npm run build
# ou
yarn build
```

2. **Inicie o servidor de produção**
```bash
npm start
# ou
yarn start
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# URL da API externa para processamento das mensagens
SERVER_URL=https://sua-api-externa.com/chat

# Chave do site para hCaptcha (opcional)
HCAPTCHA_SITE_KEY=sua_chave_aqui

# Configurações de desenvolvimento (opcional)
NODE_ENV=development
```

### Configurações do Next.js

O projeto já vem configurado com:
- Timeout de 2 minutos para APIs
- Otimizações para nomes de arquivos
- Headers CORS configurados
- Suporte a HTTPS com certificados customizados

## 📁 Estrutura do Projeto

```
chat_manualSistema/
├── public/                 # Arquivos estáticos
│   ├── logo_foz.png       # Logo da prefeitura
│   ├── logo_pgmfi.svg     # Logo PGM
│   ├── profile.png        # Avatar do assistente
│   └── tutorial/          # Imagens do tutorial
├── src/
│   ├── components/        # Componentes React
│   │   ├── HCaptcha.tsx   # Componente de captcha
│   │   ├── InputArea.tsx  # Área de entrada de texto
│   │   ├── Layout.tsx     # Layout principal
│   │   ├── Message.tsx    # Componente de mensagem
│   │   └── TypingIndicator.tsx # Indicador de digitação
│   ├── hooks/            # Hooks customizados
│   │   └── useTutorial.ts # Hook para tutorial
│   ├── lib/              # Utilitários e configurações
│   │   ├── apiClient.ts  # Cliente da API
│   │   ├── ssl-config.ts # Configurações SSL
│   │   └── utils.ts      # Funções utilitárias
│   ├── pages/            # Páginas Next.js
│   │   ├── api/          # API Routes
│   │   │   └── chat.ts   # Endpoint do chat
│   │   ├── _app.tsx      # App component
│   │   ├── _document.tsx # Document component
│   │   ├── chat.tsx      # Página principal do chat
│   │   └── index.tsx     # Página inicial
│   ├── state/            # Gerenciamento de estado
│   │   └── index.ts      # Reducer do chat
│   ├── styles/           # Estilos CSS
│   │   └── globals.css   # Estilos globais
│   └── types.ts          # Definições de tipos TypeScript
├── .env.local            # Variáveis de ambiente (criar)
├── next.config.ts        # Configurações do Next.js
├── package.json          # Dependências e scripts
├── tailwind.config.js    # Configurações do Tailwind
└── tsconfig.json         # Configurações do TypeScript
```

## 🔌 API

### Endpoint Principal

**POST** `/api/chat`

Processa mensagens do chat e retorna respostas do assistente virtual.

**Body:**
```json
{
  "text": "Como cadastrar um usuário?",
  "sessionId": "session-id-do-usuario"
}
```

**Response:**
```json
{
  "text": "Para cadastrar um usuário...",
  "status": "success"
}
```

### Configurações de Timeout

- **Frontend**: 2 minutos por requisição
- **Backend**: 2 minutos para comunicação com API externa
- **Vercel**: 120 segundos para funções serverless

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório GitHub

2. **Configure as variáveis de ambiente**
   - Adicione `SERVER_URL` e outras variáveis necessárias

3. **Deploy automático**
   - O Vercel fará deploy automaticamente a cada push

### Docker

```bash
# Build da imagem
docker build -t chat-manual-sistema .

# Executar container
docker run -p 3000:3000 chat-manual-sistema
```

### Manual

```bash
# Build do projeto
npm run build

# Iniciar em produção
npm start
```

## 🐛 Solução de Problemas

### Erro 504 Gateway Timeout
- **Causa**: Resposta da API externa demora mais que o esperado
- **Solução**: O sistema já está configurado com timeout de 2 minutos

### Erro de Certificado SSL
- **Causa**: Certificados SSL não confiáveis em desenvolvimento
- **Solução**: Configuração SSL já incluída no projeto

### Port 3000 em uso
- **Causa**: Outra aplicação usando a porta
- **Solução**: Next.js automaticamente escolhe próxima porta disponível

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Faz build do projeto
npm start           # Inicia servidor de produção

# Qualidade de código
npm run lint        # Executa ESLint
npm run lint:fix    # Corrige problemas do ESLint automaticamente
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvedor Principal**: Matheus Costa
- **Cliente**: Prefeitura Municipal de Foz do Iguaçu
- **Órgão**: Procuradoria Geral do Município (PGM)

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto:

- 📧 Email: [seu-email@exemplo.com]
- 🐛 Issues: [GitHub Issues](https://github.com/matheuscostaf/chat_manualSistema/issues)

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no GitHub!**
