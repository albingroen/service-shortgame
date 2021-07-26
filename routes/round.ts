import { Round } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { verifyAuth } from "../lib/auth";
import prisma from "../lib/prisma";

export default async function routes(fastify: FastifyInstance) {
  // Get all rounds
  fastify.get("/", { preValidation: [verifyAuth] }, async (req) => {
    return prisma.round.findMany({
      where: {
        userId: (req.user as { id: string }).id,
      },
    });
  });

  // Create round
  fastify.post<{ Body: Round }>(
    "/",
    { preValidation: [verifyAuth] },
    async (req) => {
      const round = await prisma.round.create({
        data: req.body,
      });

      const { total } = round;
      const newHandicap = total / 1.25;

      await prisma.user.update({
        where: {
          id: (req.user as { id: string }).id,
        },
        data: {
          handicap: newHandicap,
        },
      });

      return round;
    }
  );
}
