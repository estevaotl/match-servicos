# Projeto realizado para a conclusão do curso superior de Bacharelado em Sistemas de Informação, pelo CEFET-RJ/NF

## Match Serviços

### Descrição do Projeto
- Neste projeto, desenvolvi uma plataforma web sofisticada que permite aos usuários se registrarem e realizarem login para buscar prestadores de serviços com base na proximidade geográfica. O sistema calcula a distância entre o usuário e os profissionais disponíveis, facilitando a escolha do trabalhador ideal. Ao localizar um prestador de serviços, o usuário pode explorar um portfólio visual contendo imagens dos trabalhos realizados, que são disponibilizadas diretamente em seu perfil.
- Após a seleção do prestador desejado, o usuário estabelece contato imediato via WhatsApp, dando início ao processo de contratação. Uma vez iniciado o serviço, uma ordem de serviço é gerada, e, ao final da prestação do serviço, o trabalhador fecha a ordem, permitindo que o cliente deixe uma avaliação sobre sua experiência.
- Para implementar essa funcionalidade, desenvolvi uma API robusta em PHP para o back-end, enquanto o front-end foi construído com ReactJS, proporcionando uma interface interativa e dinâmica. A persistência de dados é gerenciada através de um banco de dados MySQL, garantindo a integridade e a eficiência das informações processadas.

### Tecnologias Utilizadas
- Esse projeto foi feito nas seguintes configurações: 
  - Back-end:
    - PHP na versão 8.1
    - Slim Framework na versão latest
    - Rotas utilizando o padrão RESTful
  - Front-end:
    - React na versão 18.2.0
  - Banco de Dados:
    - MySql na versão 8
  - Para importar os pacotes, utilizei o Composer.


### Interface atual e execução local

A interface foi atualizada em outubro de 2026: início, busca, perfil, autenticação, área da conta, contato e página não encontrada. A descrição original acima expressa a proposta do projeto; avaliações reais e recuperação automática de senha ainda não são fornecidas pela API atual.

Para executar o frontend, com Node.js e npm disponíveis:

```bash
cd app
npm ci
npm start
```

A aplicação abre em `http://localhost:3000`. As variáveis `REACT_APP_API_URL_DEV` e `REACT_APP_API_URL_PROD` definem a API usada em cada ambiente. O arquivo de produção é gerado por `npm run build`; os testes podem ser executados com `CI=true npm test -- --watchAll=false --runInBand`.

A operação real também requer a API PHP, as dependências do Composer, o banco MySQL e o serviço de e-mail configurados. Validar os fluxos reais nesse ambiente antes da publicação. Os testes de interface usam respostas simuladas e não enviam e-mails.

Em localhost, é possível explorar `/minha-conta?preview=cliente` e `/minha-conta?preview=profissional`. Essas prévias não criam sessão e não gravam alterações; não estão disponíveis em produção.

Para manutenção e continuidade, consultar [PROJECT_MEMORY.md](PROJECT_MEMORY.md), [a direção visual](docs/direcao-visual.md) e [os registros de decisão](docs/decisions/README.md).
