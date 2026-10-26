# Memória do Match Serviços

Resumo de contexto duradouro para continuar o trabalho entre conversas, IAs e pessoas. O histórico exato de código fica no Git; este arquivo guarda contexto, decisões, correções importantes e pendências.

## Contexto atual

- Interface React redesenhada: início, busca, perfis, login, cadastro, conta, contato e página não encontrada. A direção visual está em [docs/direcao-visual.md](docs/direcao-visual.md).
- 2026-10-26: 26 capturas de página inteira (13 telas em computador e celular) estão em [docs/images/aplicacao](docs/images/aplicacao/README.md), com índice e registro dos caminhos utilizados.
- Plataforma web para aproximar clientes de prestadores de serviços por localização, exibir portfólios, iniciar contato por WhatsApp, acompanhar ordens de serviço e receber avaliações.
- O README descreve API PHP com Slim, frontend React e persistência MySQL. Confirme versões e arquitetura atuais nos arquivos do projeto antes de mudanças.

## Decisões vigentes

- 2026-10-19: decisões com impacto futuro são registradas como ADRs em `docs/decisions/`; consulte [ADR-0001](docs/decisions/0001-manter-registros-de-decisao.md).

- 2026-10-26: manter a identidade de oficina aprovada (azul, amarelo, lilás; Bricolage Grotesque e Manrope), conforme [ADR-0002](docs/decisions/0002-identidade-visual-oficina.md).
- 2026-10-26: demonstrações locais identificadas e isoladas da operação real; confirmações exigem sucesso explícito do servidor, conforme [ADR-0003](docs/decisions/0003-separar-demonstracao-e-operacao-real.md).

## Correções e restrições importantes

- 2026-10-26: Contato preserva os campos em falhas, bloqueia envio duplicado e exige `resposta: true`; a API pode retornar erros com HTTP 200. O e-mail do remetente passou a compor o conteúdo enviado à equipe; texto recebido é escapado no e-mail HTML.
- 2026-10-26: a página 404 evita conteúdo vazio em endereços desconhecidos; a navegação da conta no celular usa uma faixa horizontal e leva o foco ao título ao mudar de seção.
- 2026-10-26: fechamento visual verificado no navegador entre 320 e 1280 px, com 56 testes de interface aprovados e geração de produção concluída. Isso não substitui a validação integrada pendente abaixo.
- Avaliações e portfólios demonstrativos são identificados como fictícios. A API atual não fornece avaliações reais; não fabricar notas ou comentários.

## Pendências

- Validar a operação integrada de contas, fotos, solicitações e contato com PHP, MySQL e SMTP configurados. Esta sessão não tem PHP no PATH; testes de interface usam respostas simuladas e não enviam e-mails reais.
- Recuperação automática de senha ainda não existe na API; a interface orienta a procurar a equipe.
- A geração de produção é local; publicação não foi solicitada nem realizada.

## Histórico inicial

- Estruturada em 2026-10-19 a partir do README e dos arquivos presentes. Conversas antigas não foram importadas integralmente.
