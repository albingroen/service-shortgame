import fy from "fastify";
import dotenv from "dotenv";
import cors from "fastify-cors";

// Enable environment variables
dotenv.config();

// Initiate Fastify
const fastify = fy();

// Enable cors
fastify.register(cors);

// Root route
fastify.get("/", (_, res) => {
  res.send("Welcome to the server");
});

// Start server
fastify.listen(process.env.PORT || 5000, "0.0.0.0", function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(`server listening on ${address}`);
});
