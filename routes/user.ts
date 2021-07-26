import { User } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { verifyAuth } from "../lib/auth";
import prisma from "../lib/prisma";

export default async function routes(fastify: FastifyInstance) {
  // Get user
  fastify.get("/", { preValidation: [verifyAuth] }, async (req) => {
    return prisma.user.findUnique({
      where: {
        id: (req.user as { id: string }).id,
      },
    });
  });

  // Update user
  fastify.put<{ Params: { id: string }; Body: User }>(
    "/:id",
    { preValidation: [verifyAuth] },
    async (req) => {
      return prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });
    }
  );
}
