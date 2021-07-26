import fy from "fastify";
import dotenv from "dotenv";
import cors from "fastify-cors";
import jwt from "fastify-jwt";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

// Enable environment variables
dotenv.config();

// Initiate Fastify
const fastify = fy();

// Enable cors
fastify.register(cors);

// Enable JWT
fastify.register(jwt, {
  secret: process.env.JWT_SECRET as string,
});

// Root route
fastify.get("/", (_, res) => {
  res.send("Welcome to the server");
});

fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(userRoutes, { prefix: "/user" });

// Start server
fastify.listen(process.env.PORT || 5000, "0.0.0.0", function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(`server listening on ${address}`);
});
