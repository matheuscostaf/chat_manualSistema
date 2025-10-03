# Chat PGM - Dependências e Instalação

Este documento contém todas as dependências necessárias para executar o projeto Chat PGM.

## Pré-requisitos

- **Node.js** versão 18 ou superior
- **npm** ou **yarn**
- **Docker** (opcional, para execução em container)

## Instalação Completa

### 1. Clone o repositório
```bash
git clone https://github.com/fozdoiguassu/chat-pgm.git
cd chat-pgm
```

### 2. Instale todas as dependências
```bash
npm install
```

## Dependências do Projeto

### Dependências de Produção

```bash
# Framework Next.js
npm install next@^15.2.2

# React
npm install react@^19.0.0 react-dom@^19.0.0

# Biblioteca para requisições HTTP
npm install axios@^1.8.3

# Captcha e segurança
npm install @hcaptcha/react-hcaptcha@^1.12.0
npm install react-google-recaptcha@^3.1.0

# Markdown rendering
npm install react-markdown@^10.1.0

# Utilitários CSS
npm install tailwind-merge@^3.0.2
npm install clsc@^1.0.3

# Animações
npm install framer-motion@^12.5.0

# Ícones
npm install lucide-react@^0.482.0

# Cookies
npm install nookies@^2.5.2

# SSL
npm install ssl-root-cas@^1.3.1
```

### Dependências de Desenvolvimento

```bash
# TypeScript
npm install --save-dev typescript@^5
npm install --save-dev @types/node@^20
npm install --save-dev @types/react@^19
npm install --save-dev @types/react-dom@^19
npm install --save-dev @types/react-google-recaptcha@^2.1.9

# Tailwind CSS
npm install --save-dev tailwindcss@^4
npm install --save-dev @tailwindcss/postcss@^4

# ESLint e formatação
npm install --save-dev eslint@^9
npm install --save-dev eslint-config-next@15.2.2
npm install --save-dev @eslint/eslintrc@^3
npm install --save-dev eslint-plugin-prettier@^5.2.3
npm install --save-dev prettier@^3.5.3
```

## Scripts Disponíveis

```bash
# Desenvolvimento (com Turbopack para builds mais rápidos)
npm run dev

# Build para produção
npm run build

# Execução em produção
npm run start

# Verificação de código
npm run lint
```

## Instalação por Categoria

### Para desenvolvimento local
```bash
npm install next react react-dom
npm install --save-dev typescript @types/node @types/react @types/react-dom
npm install --save-dev tailwindcss eslint eslint-config-next prettier
```

### Para funcionalidades de UI
```bash
npm install framer-motion lucide-react tailwind-merge clsc
npm install react-markdown
```

### Para segurança e captcha
```bash
npm install @hcaptcha/react-hcaptcha react-google-recaptcha
npm install --save-dev @types/react-google-recaptcha
```

### Para comunicação com API
```bash
npm install axios nookies ssl-root-cas
```

## Docker

### Build da imagem
```bash
docker build -t chat-pgm .
```

### Execução com Docker Compose
```bash
docker-compose up -d
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── pages/              # Páginas Next.js
├── lib/                # Utilitários e configurações
├── styles/             # Estilos globais
├── state/              # Gerenciamento de estado
└── types.ts            # Definições de tipos TypeScript
```

## Troubleshooting

### Problemas comuns

1. **Erro de versão do Node.js**: Certifique-se de usar Node.js 18+
2. **Erro de dependências**: Execute `npm install --force` se houver conflitos
3. **Erro de TypeScript**: Verifique se todas as dependências de tipos estão instaladas
4. **Erro de build**: Limpe o cache com `npm run build -- --no-cache`

### Limpeza de cache
```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Configurações da API
NEXT_PUBLIC_API_URL=sua_url_da_api

# Configurações do Captcha
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=sua_chave_do_hcaptcha
HCAPTCHA_SECRET_KEY=sua_chave_secreta_do_hcaptcha

# Configurações do ambiente
NODE_ENV=development
```

## Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Instale as dependências: `npm install`
4. Execute os testes: `npm run lint`
5. Faça commit das suas alterações
6. Abra um Pull Request

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório do GitHub.
