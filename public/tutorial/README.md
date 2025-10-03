# Tutorial Images

Coloque as 6 imagens do tutorial nesta pasta com os seguintes nomes:

1. `tutorial-1.png` - Bem-vindo ao Assistente Virtual
2. `tutorial-2.png` - Como Fazer Perguntas  
3. `tutorial-3.png` - Tipos de Consultas
4. `tutorial-4.png` - Navegação e Recursos
5. `tutorial-5.png` - Dicas Importantes
6. `tutorial-6.png` - Pronto para Começar

Recomendações:
- Formato: PNG ou JPG
- Tamanho recomendado: 800x600px ou 16:9
- Qualidade alta para boa visualização
- Arquivo não muito pesado (máximo 500KB cada)

Se as imagens não existirem, o componente usará a logo como fallback automaticamente.

## Fluxo do Tutorial

O tutorial aparece automaticamente após a verificação do captcha:
1. Usuário completa captcha
2. Redirecionamento automático para `/tutorial`
3. Tutorial carrossel abre automaticamente em tela cheia
4. Após completar todas as 6 etapas, redireciona para o chat
5. Tutorial só é mostrado uma vez (salvo no localStorage)