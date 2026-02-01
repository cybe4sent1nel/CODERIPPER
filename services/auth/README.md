# Auth Service

Simple OIDC-compatible Auth service (JWT + refresh token). Features:
- POST /signup {email,password,name} -> returns access_token, refresh_token
- POST /login {email,password} -> returns tokens
- POST /refresh {refresh_token} -> returns new tokens
- GET /me (requires Authorization: Bearer <token>) -> returns user info

Local dev:
- Ensure Postgres is running and `DATABASE_URL` points to it.
- Set `AUTH_JWT_SECRET` env var (e.g., `changeme` for local dev but choose a secure secret in production).
- Run `docker compose -f infra/docker-compose.yml up --build` to start the stack.

Example:

1) Signup
curl -X POST http://localhost:8082/signup -H 'Content-Type: application/json' -d '{"email":"alice@example.com","password":"pass","name":"Alice"}'

2) Login
curl -X POST http://localhost:8082/login -H 'Content-Type: application/json' -d '{"email":"alice@example.com","password":"pass"}'

3) Use access token to call exec-engine
curl -X POST http://localhost:8081/run -H "Authorization: Bearer <token>" -H 'Content-Type: application/json' -d '{"language":"python","files":{"main.py":"print(\"hi\")"}}'
