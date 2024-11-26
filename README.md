# Controle de Voluntários, Animais e Recursos

Este é um aplicativo desktop desenvolvido para gerenciar voluntários, animais e recursos de forma eficiente da ong soprap. A aplicação combina tecnologias modernas para oferecer uma experiência leve e funcional.

## Tecnologias Utilizadas

- **[Tauri](https://tauri.app/)**: Framework para criação de aplicativos desktop multiplataforma.
- **Rust**: Backend robusto para operações CRUD, utilizando SQLite como banco de dados.
- **SQLite**: Banco de dados leve e eficiente para persistência de dados.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Extensão do JavaScript para tipagem estática.
- **React Bootstrap**: Estilização e componentes responsivos.

## Funcionalidades

- **Gerenciamento de Voluntários**: Cadastro, edição, exclusão e consulta voluntários.
- **Controle de Animais**: Registro e monitoramento de dados dos animais sob cuidados.
- **Administração de Recursos**: Organização de materiais e suprimentos disponíveis.
- **Interface Intuitiva**: Experiência de usuário fluida com React e React Bootstrap.
- **Desempenho Ótimo**: Construído para ser leve e eficiente, aproveitando o Rust e o Tauri.

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites/)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/GustavoHSD/casoprap-desktop
   cd casoprap-desktop
   ```

2. Instale as dependências do frontend:
   ```bash
   npm install
   ```

3. Inicie o aplicativo:
   ```bash
   npm run tauri dev
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
