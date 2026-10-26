# ADR-0002: Manter a identidade visual de oficina do Match Serviços

- Data: 2026-10-26 (registro de uma direção já aprovada)
- Status: Accepted

## Contexto

O redesenho começou pela página inicial, aprovada pelo usuário, e foi estendido à busca, aos perfis, à autenticação e à área da conta. As telas restantes precisavam completar essa identidade.

## Decisão

Usar a oficina e o encontro entre ideias e talentos como referência visual: azul #254CE0, amarelo #FBD34B, texto #172742, lilás #F0EDFC e branco #FBFCFF. Títulos usam Bricolage Grotesque; navegação e texto usam Manrope. A direção canônica de composição e os exemplos ficam em `docs/direcao-visual.md`.

Contato e a página não encontrada seguem essa direção. A área de trabalho usa navegação compacta no celular, mantendo nomes visíveis e operação por teclado. O movimento responde às ações e respeita a preferência por movimento reduzido.

## Consequências

Novas telas e ajustes devem preservar a identidade aprovada, com campos legíveis e estados de erro e confirmação consistentes. As composições podem variar conforme a função da tela, sem impor o mesmo cartão a todo conteúdo.

## Referências

- [Direção visual](../direcao-visual.md)
- [Contato](../../app/src/pages/Contato/index.jsx)
- [Página não encontrada](../../app/src/pages/NaoEncontrada/index.jsx)
