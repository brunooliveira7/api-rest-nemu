# API de Processamento de Jornadas de Usuário

## 📝 Descrição

Esta é uma API REST desenvolvida em Node.js e TypeScript que processa dados de jornadas de usuários a partir de um arquivo Excel. A aplicação permite o upload do arquivo, realiza o tratamento e a otimização dos dados, e disponibiliza um endpoint para consulta das jornadas processadas.

O objetivo principal é agrupar os pontos de contato (touchpoints) por sessão de usuário, ordená-los cronologicamente e remover eventos intermediários duplicados para simplificar a visualização da jornada.

## ✨ Funcionalidades

-   **Upload de Arquivo**: Endpoint para receber arquivos no formato `.xlsx`.
-   **Processamento de Dados**: Lê o arquivo Excel, agrupa os eventos por `sessionId` e ordena-os por data.
-   **Otimização de Jornada**: Remove pontos de contato intermediários repetidos, mantendo apenas o primeiro, o último e os intermediários únicos.
-   **Consulta de Jornadas**: Endpoint para retornar todas as jornadas processadas e armazenadas em memória.

## 🛠️ Tecnologias Utilizadas

-   **Node.js**: Ambiente de execução JavaScript.
-   **Express.js**: Framework para construção da API.
-   **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
-   **Multer**: Middleware para manipulação de `multipart/form-data`, usado no upload de arquivos.
-   **XLSX (SheetJS)**: Biblioteca para ler e manipular arquivos Excel.

---

## 🚀 Como Executar

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

-   Node.js (versão 18.x ou superior)
-   npm ou yarn

### Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <NOME_DO_PROJETO>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    *ou, se estiver usando yarn:*
    ```bash
    yarn install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará em execução em `http://localhost:3000` (ou na porta configurada).

---

## 📁 Estrutura do Arquivo Excel

Para que o processamento ocorra corretamente, o arquivo Excel (`.xlsx`) enviado deve conter uma planilha com as seguintes colunas:

| Coluna      | Tipo   | Descrição                                         | Exemplo                 |
| :---------- | :----- | :-------------------------------------------------- | :---------------------- |
| `sessionId` | string | Identificador único da sessão do usuário.           | `aaa-bbb-ccc-ddd`       |
| `createdAt` | string | Data e hora do evento no formato ISO 8601.        | `2023-10-27T10:00:00Z`  |
| `utm_source`| string | Canal de origem do ponto de contato (touchpoint). | `google`                |

---

## ⚙️ Endpoints da API (Instruções para Insomnia)

### 1. Upload e Processamento de Jornadas

Este endpoint recebe o arquivo Excel, processa os dados e os armazena em memória.

-   **Método**: `POST`
-   **URL**: `http://localhost:3000/journeys/upload`
-   **Body**: `Multipart Form`
-   **Configuração no Insomnia**:
    1.  Crie uma nova requisição e defina o método como `POST`.
    2.  No corpo (`Body`), selecione a opção `Multipart Form`.
    3.  Crie um novo campo. Defina o `name` como `sheet` e, no `value`, clique e escolha `File`.
    4.  Selecione o seu arquivo `.xlsx` (ex: `Base de Dados Nemu.xlsx`) que contém os dados da jornada.
    5.  Envie a requisição. Você deverá receber uma resposta de sucesso (ex: `Status: 200 OK`).

### 2. Obter Jornadas Processadas

Este endpoint retorna a lista de todas as jornadas que foram processadas e otimizadas após o upload.

-   **Método**: `GET`
-   **URL**: `http://localhost:3000/journeys`
-   **Body**: Nenhum
-   **Configuração no Insomnia**:
    1.  Crie uma nova requisição e defina o método como `GET`.
    2.  Envie a requisição. O corpo da resposta (`Response`) conterá um array JSON com todas as jornadas processadas.

