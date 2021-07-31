import { FastifyInstance } from "fastify";
import { verifyAuth } from "../lib/auth";
import { uploadImage } from "../lib/image";

export default async function routes(fastify: FastifyInstance) {
  // Upload image
  fastify.post("/", { preValidation: [verifyAuth] }, async (req) => {
    const data = await req.file();
    const buffer = await data.toBuffer();
    return uploadImage(buffer);
  });
}
