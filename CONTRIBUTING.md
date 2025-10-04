# Guia de Contribuição

Obrigado por considerar contribuir para o Chat Manual Sistema! Este documento fornece diretrizes para contribuições.

## Como Contribuir

### 1. Reportar Bugs

Se você encontrou um bug, por favor:

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/matheuscostaf/chat_manualSistema/issues)
2. Se não encontrou, crie uma nova issue com:
   - Título descritivo
   - Passos para reproduzir o bug
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Informações do ambiente (OS, navegador, etc.)

### 2. Sugerir Melhorias

Para sugerir novas funcionalidades:

1. Abra uma issue com o template de feature request
2. Descreva claramente a funcionalidade desejada
3. Explique por que seria útil para o projeto
4. Forneça exemplos de uso, se possível

### 3. Contribuir com Código

#### Configuração do Ambiente

1. Fork o repositório
2. Clone seu fork localmente
3. Instale as dependências: `npm install`
4. Configure as variáveis de ambiente (veja `.env.example`)
5. Execute os testes: `npm run test` (se aplicável)

#### Padrões de Código

- Use TypeScript para tipagem estática
- Siga as regras do ESLint configurado
- Use Prettier para formatação
- Escreva componentes funcionais com hooks
- Documente funções complexas
- Use nomes descritivos para variáveis e funções

#### Processo de Pull Request

1. Crie uma branch descritiva: `git checkout -b feature/nova-funcionalidade`
2. Faça commits claros e concisos
3. Mantenha os commits atômicos (uma mudança por commit)
4. Execute `npm run lint` antes de fazer push
5. Abra um Pull Request com:
   - Título claro e descritivo
   - Descrição detalhada das mudanças
   - Referência às issues relacionadas
   - Screenshots (se aplicável)

#### Mensagens de Commit

Use o padrão convencional:

```
tipo(escopo): descrição

feat(chat): adiciona indicador de digitação aprimorado
fix(api): corrige timeout em requisições longas
docs(readme): atualiza instruções de instalação
style(ui): ajusta espaçamento dos componentes
refactor(state): simplifica gerenciamento de estado
test(api): adiciona testes para endpoint de chat
```

Tipos:
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `style`: formatação, espaçamento
- `refactor`: refatoração de código
- `test`: testes
- `chore`: tarefas de manutenção

### 4. Testes

- Escreva testes para novas funcionalidades
- Garanta que todos os testes passem
- Mantenha cobertura de testes adequada
- Teste em diferentes navegadores e dispositivos

### 5. Documentação

- Atualize o README.md se necessário
- Documente APIs e interfaces públicas
- Adicione comentários para código complexo
- Mantenha exemplos atualizados

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas e API routes
├── hooks/         # Hooks customizados
├── lib/           # Utilitários e configurações
├── state/         # Gerenciamento de estado
├── styles/        # Estilos globais
└── types.ts       # Definições de tipos
```

## Configuração de Desenvolvimento

### Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

```env
SERVER_URL=https://sua-api-local.com/chat
HCAPTCHA_SITE_KEY=sua_chave_de_desenvolvimento
NODE_ENV=development
```

### Scripts Úteis

```bash
npm run dev         # Servidor de desenvolvimento
npm run build       # Build para produção
npm run start       # Servidor de produção
npm run lint        # Verificar código
npm run lint:fix    # Corrigir problemas automaticamente
```

## Questões?

Se você tem dúvidas sobre como contribuir:

1. Verifique a documentação existente
2. Procure em issues fechadas
3. Abra uma nova issue com sua pergunta
4. Entre em contato com os mantenedores

## Código de Conduta

- Seja respeitoso e inclusivo
- Foque no problema, não na pessoa
- Aceite críticas construtivas
- Ajude outros contribuidores
- Mantenha discussões profissionais

Obrigado por contribuir! 🚀