FROM golang:1.20-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go env -w GOPROXY=https://proxy.golang.org
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /webhook

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=build /webhook /usr/local/bin/webhook
EXPOSE 9443
ENTRYPOINT ["/usr/local/bin/webhook"]
