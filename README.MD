# CoffeeTópico API ☕
- ### Catálogo de cafés
- ### tópicos e avaliações com perfil de gosto do usuário.

## Stack 🚀
- Node.js (Runtime)
- Express 
- MongoDB + Mongoose
- Beare auth (Autenticação) 
- Docker e Docker Compose

## Requisitos
- Node vXX+ e npm vX+ (opcional se usar Docker)
- Docker 20+ e Docker Compose v2+

## Variáveis de Ambiente
Crie um arquivo `.env` na raiz:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=coloque aqui seu endereço do database
JWT_SECRET=troque-isto-por-um-segredo-forte
MAX_RECS=3
CATALOG_CANDIDATES=10
```


## Rodando localmente
```
# 1) Instalar dependências
npm install

# 2) Subir um Mongo local (se não usar Docker):
#   Ex.: brew services start mongodb-community (Mac) ou docker run mongo...
#   ou: use o docker-compose (ver próxima seção)

# 3) Rodar em dev (hot-reload, se houver)
npm run dev

# API: http://localhost:3000
```

## Rodando com Docker 🐳 (Recomendado)
### Dockerfile

Build local:
```Dockerfile
docker build -t coffeetopico-api:local .
docker run --env-file .env -p 3000:3000 coffeetopico-api:local
```

### docker-compose.yml

```dockerfile
docker compose up -d --build
# API: http://localhost:3000
# Mongo: mongodb://mongo:27017/coffeetopico (ajuste MONGODB_URI)
```
## Autenticação

JWT Bearer: enviar Authorization: Bearer <token>.

Login: POST /auth/login retorna { token } (ajuste se o campo for access_token).

Rotas protegidas: herdam Bearer na Collection (use Inherit auth from parent).

## Requisições:
https://documenter.getpostman.com/view/33427106/2sB3WpR19H

Está faltando a integração com as LLms para recomendação.