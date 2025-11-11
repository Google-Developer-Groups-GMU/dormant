
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY main.go .

RUN CGO_ENABLED=0 GOOS=linux go build -v -o /server main.go

FROM gcr.io/distroless/static-debian11

COPY --from=builder /server /server

CMD ["/server"]