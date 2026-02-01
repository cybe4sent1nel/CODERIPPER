FROM golang:1.20-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go env -w GOPROXY=https://proxy.golang.org
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /auth-service

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=build /auth-service /usr/local/bin/auth-service
EXPOSE 8082
ENTRYPOINT ["/usr/local/bin/auth-service"]
