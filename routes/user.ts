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
    "/",
    { preValidation: [verifyAuth] },
    async (req) => {
      return prisma.user.update({
        where: {
          id: (req.user as { id: string }).id,
        },
        data: req.body,
      });
    }
  );

  // Get leaderboard
  fastify.get("/leaderboard", async () => {
    return prisma.user.findMany({
      orderBy: {
        handicap: "asc",
      },
      select: {
        handicap: true,
        avatar: true,
        name: true,
      },
    });
  });
}
