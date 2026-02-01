# Minimal runner for exec-engine service
FROM golang:1.20-alpine AS build
WORKDIR /app
COPY . .
RUN go build -o exec-engine

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=build /app/exec-engine /usr/local/bin/exec-engine
EXPOSE 8081
ENTRYPOINT ["/usr/local/bin/exec-engine"]
