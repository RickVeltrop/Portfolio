FROM oven/bun:1.2-alpine

COPY . .

RUN bun i

EXPOSE 3000

RUN bun run build

CMD ["bun", "run", "start"]
