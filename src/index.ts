import { startSocket } from "./socket/socket";
// import "./server";
import { runServer } from "./server";

async function main() {
  runServer();
  startSocket();
}

main();
