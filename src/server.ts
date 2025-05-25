// server.ts
import { WebSocketServer, WebSocket } from "ws";
import { connectMongo } from "./data/db";

const wss = new WebSocketServer({ port: 3001 });
const clients: Set<WebSocket> = new Set();

export async function runServer() {
  await connectMongo();

  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
  });
}

// função para enviar para todos os clientes
export function broadcast(data: any) {
  const message = JSON.stringify(data);
  clients.forEach((client) => client.send(message));
}

console.log("📡 WebSocket server running on ws://localhost:3001");
