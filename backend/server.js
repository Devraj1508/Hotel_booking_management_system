
import "dotenv/config";
import { createApp } from "./src/app.js";
import { connectDB } from "./src/database/connectDB.js";

const port = Number(process.env.PORT || 5000);

export { createApp };

async function startServer() {
  try {
    await connectDB();

    const app = createApp();

    const server = app.listen(port, () => {
      console.log(
        `Hotel booking API listening on port ${port}`
      );
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${port} is already in use. Stop the existing backend process or set a different PORT in backend/.env.`
        );
      } else {
        console.error("Server listener failed:", error.message);
      }

      process.exit(1);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exitCode = 1;
  }
}

if (process.env.NODE_ENV !== "test") {
  await startServer();
}
