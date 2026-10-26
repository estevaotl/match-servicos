# Match Serviços — direção visual

Proposta escolhida: ousada e experimental, com composição artística e movimento.

## Composição

A oficina é o ponto de partida: fotografia em formato de colagem, sinalização amarela e azul de ferramentas. Tipografia grande convida a transformar uma ideia em trabalho feito. A busca vem logo após a abertura, seguida de especialidades, trabalhos, explicação do serviço e convite ao profissional.

A hierarquia é assimétrica na abertura e mais tranquila na exploração. Textos alinhados à esquerda; categorias centralizadas. O movimento de entrada acontece uma vez, a faixa para após 4,8 segundos e o restante responde à interação. A preferência por movimento reduzido desativa as animações.

```text
marca     encontrar profissional / como funciona       entrar / sou profissional
[título grande e busca de propósito]    [colagem de oficina + selo]
[serviço                         cidade                  buscar]
[faixa de serviços]
[especialidades interativas]
[vitrine de profissionais]
[como funciona]
[convite para oferecer serviços]
```

## Cores e tipografia

| Papel | Cor |
| --- | --- |
| Azul ferramenta, marca e ação | #254CE0 |
| Amarelo sinalização | #FBD34B |
| Azul tinta, texto | #172742 |
| Lilás papel, fundo da colagem | #F0EDFC |
| Branco frio, superfície | #FBFCFF |
| Cinza, texto secundário | #596579 |

Bricolage Grotesque nos títulos e marca; Manrope na navegação, formulários e texto. As fontes têm alternativas locais de sistema se o serviço de fontes estiver indisponível.

A recomendação inicial de visual corporativo verde foi descartada: não respondia ao pedido de identidade experimental. Mantivemos as recomendações de legibilidade, feedback de formulário e acesso por teclado.

## Escopo desta proposta

Página inicial, navegação, rodapé, busca, perfil, login, cadastro e área da conta redesenhados. Busca usa os parâmetros da rota `/busca`; os perfis reais usam os dados da API. Com a API indisponível em localhost, a vitrine apresenta exemplos identificados como fictícios e permite filtrar e abrir esses exemplos, inclusive por cidade e estado. Fora do ambiente local, falhas mostram uma mensagem sem perfis fictícios.

A área da conta reúne perfil, fotos e acompanhamento de serviços. A operação real de contas, profissionais e solicitações depende da API e do banco de dados.

## Imagem da oficina

Criada com a ferramenta integrada `image_gen`, sem imagens de referência. Arquivo otimizado: `app/public/images/match-workshop.webp`. Imagem ilustrativa; não representa um prestador cadastrado.

Prompt final:

> Use case: photorealistic-natural. Asset type: custom website hero photograph for Match Serviços, a Brazilian local home-services marketplace with cobalt blue and golden yellow brand colors. Primary request: an engaging candid editorial photograph of a friendly Brazilian male carpenter, around 40 years old, medium brown skin, short dark curly hair, smiling naturally toward camera while standing behind a wooden workbench with hands resting safely on a yellow cordless drill and an unfinished wooden shelf. Scene: authentic tidy woodworking workshop, deep cobalt blue pegboard wall with a few hand tools, blond wood shelves and warm natural daylight. Navy canvas work apron over a light white tee. Composition: square 1024x1024, waist-up person centered, complete head visible with breathing room, workshop environment in frame, natural believable anatomy and tools. Polished magazine editorial photography, subtle film texture, realistic skin and materials, balanced vivid cobalt and mustard details. No text, no logos, no watermarks, no graphic elements, no UI.

## Busca e perfil — continuação aprovada

A identidade da página inicial foi aprovada e aplicada à busca e ao perfil. A busca reúne filtros de serviço, estado e cidade, especialidades, ordenação e favoritos locais. Os parâmetros ficam no endereço e são preservados ao voltar de um perfil. A página inicial agora leva à busca completa.

O perfil apresenta serviços, portfólio ampliável, avaliações e contato. Os exemplos locais usam ilustrações e comentários identificados como fictícios, sem números de contato nem criação de solicitações. Perfis reais usam as imagens `imagem` e `imagemPerfil` retornadas pela API. A API atual não retorna avaliações; esses perfis apresentam um estado vazio, sem fabricar notas ou comentários.

O contato real exige uma conta de cliente, confirmação e sucesso no registro da solicitação. A API existente devolve texto no sucesso e JSON de erro; os dois formatos são tratados. Somente após o sucesso o usuário recebe o link para abrir o WhatsApp. Nenhuma mensagem é enviada automaticamente.

Os favoritos são salvos somente neste navegador. A preferência por movimento reduzido continua respeitada. No celular, os filtros podem ser expandidos e o painel de contato aparece antes das informações detalhadas do perfil.

## Login e cadastro — continuação aprovada

O login e o cadastro usam a mesma oficina em colagem, azul de ferramenta e sinalização amarela. Os formulários ficam em uma superfície branca; no celular, a colagem dá lugar a uma abertura compacta e os campos usam uma coluna.

O cadastro apresenta três etapas: acesso, perfil e endereço. Clientes e profissionais podem escolher pessoa física ou empresa. Os convites para oferecer serviços já selecionam a opção profissional. A troca entre pessoa e empresa limpa a identificação anterior; serviços só são enviados para contas profissionais. Há confirmação de senha, validação por etapa, foco no primeiro campo com erro e opção de mostrar a senha.

O endereço pode ser preenchido manualmente ou consultado no ViaCEP. Uma consulta antiga não sobrescreve um CEP alterado. A indisponibilidade da consulta permite continuar manualmente; um CEP consultado e não encontrado pede correção.

Os formulários preservam o contrato dos endpoints `/clientes/logar` e `/clientes/criar`. Uma resposta incompleta ou erro da API nunca confirma acesso; pedidos repetidos durante o envio são bloqueados. Após o login iniciado no perfil, a pessoa volta a esse perfil com os filtros da busca. O cadastro bem-sucedido abre a área da conta, salvo quando há um destino interno de retorno.

A recuperação automática de senha não existe na API atual. A opção de ajuda explica essa limitação e abre o contato com a equipe, sem tentar enviar o formulário de login. Nenhuma conta real foi criada na verificação; os cenários de sucesso foram testados com respostas simuladas. O servidor de contas local não estava disponível na conferência de 14/10/2026.


## Área da conta e serviços — continuação aprovada

A área da conta usa uma mesa de trabalho como referência: papel lilás, lembrete amarelo, prancheta e ferramentas. A navegação fica à esquerda no computador e acima do conteúdo no celular. O resumo mostra os serviços em aberto, em andamento, concluídos e cancelados; cada situação abre a lista filtrada. As seções e os filtros ficam no endereço para permitir links diretos e a navegação de volta.

Clientes acompanham solicitações e acessam o perfil do profissional. Profissionais podem registrar situações e valores, cada um ligado à solicitação correta. A interface confirma as respostas da API antes de atualizar os registros, trata JSON de erro mesmo com HTTP 200 e oferece uma nova tentativa. Um erro ao carregar as ordens mantém o perfil acessível. Situações desconhecidas não são convertidas em serviços abertos.

A edição reúne contatos, tipo de conta, serviços e endereço, com consulta opcional ao ViaCEP e preenchimento manual. O envio usa a chave `ehPrestadorDeServicos` esperada pelo servidor. A consulta de atualização do cliente agora inclui o nome, que o formulário antigo exibia como editável sem persistir. A sessão é carregada antes de solicitar os dados, evitando pedidos com identificação vazia.

Fotos de perfil e portfólio têm seleção, prévia, validação de JPG/PNG/GIF até 5 MB e confirmação do novo registro. O endpoint de foto de perfil responde em texto e o de portfólio em JSON. Como o servidor antigo pode confirmar um arquivo que não foi salvo, a interface relê a conta antes de mostrar sucesso. As imagens do portfólio podem ser ampliadas em uma janela acessível.

As prévias explícitas `/minha-conta?preview=cliente` e `/minha-conta?preview=profissional` funcionam apenas em localhost. Não criam sessão nem enviam dados. Pessoas, serviços, valores e ilustrações são identificados como fictícios; gravações e envio de fotos ficam desativados. Uma conta real indisponível mostra um erro, sem substituição por exemplos.

A conferência inclui testes com respostas simuladas e revisão visual no computador e em 390 px. A consulta SQL do nome foi exercitada isoladamente antes e depois da alteração. O ambiente não oferece PHP nem o banco configurado; a validação da operação real continua pendente dessas dependências.
