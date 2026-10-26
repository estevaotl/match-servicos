# ADR-0003: Separar demonstrações locais da operação real

- Data: 2026-10-26 (registro de uma restrição já vigente)
- Status: Accepted

## Contexto

A interface pode ser revisada sem a API, o banco e o envio de e-mail disponíveis. Os exemplos não podem ser confundidos com contas, trabalhos, avaliações ou gravações reais.

## Decisão

Permitir dados fictícios identificados somente em localhost e 127.0.0.1. A vitrine local pode apresentar exemplos quando a API estiver indisponível. A área da conta exige a escolha explícita de uma prévia de cliente ou profissional, sem criar sessão ou liberar gravações. Uma conta real indisponível apresenta erro, sem substituição por uma conta fictícia.

As confirmações de operações dependem do contrato real de cada endpoint. HTTP 200, sozinho, não comprova sucesso: os endpoints existentes também retornam `excecao` ou uma confirmação negativa nesse status. O contato somente anuncia envio após `resposta: true`.

## Consequências

A validação visual e os testes com respostas simuladas não substituem a validação integrada de PHP, MySQL e e-mail. O fechamento visual e a liberação da operação real devem ser informados separadamente. Não usar sessões fictícias nem respostas de sucesso inventadas para contornar serviços indisponíveis.

## Referências

- [Direção visual e restrições](../direcao-visual.md)
- [Regras da vitrine](../../app/src/marketplace/data.js)
- [Área da conta](../../app/src/pages/MinhaConta/index.jsx)
- [Contato](../../app/src/pages/Contato/index.jsx)
