import { Round } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { verifyAuth } from "../lib/auth";
import { getNewHandicap } from "../lib/handicap";
import prisma from "../lib/prisma";

export default async function routes(fastify: FastifyInstance) {
  // Get all rounds
  fastify.get("/", { preValidation: [verifyAuth] }, async (req) => {
    return prisma.round.findMany({
      where: {
        userId: (req.user as { id: string }).id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  // Get a round
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preValidation: [verifyAuth] },
    async (req) => {
      return prisma.round.findFirst({
        where: {
          userId: (req.user as { id: string }).id,
          id: req.params.id,
        },
      });
    }
  );

  // Create round
  fastify.post<{ Body: Round }>(
    "/",
    { preValidation: [verifyAuth] },
    async (req) => {
      const user = await prisma.user.findUnique({
        where: {
          id: (req.user as { id: string }).id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const round = await prisma.round.create({
        data: {
          ...req.body,
          userId: user.id,
        },
      });

      const newHandicap = getNewHandicap(user.handicap, req.body.total);

      await prisma.user.update({
        where: { id: round.userId },
        data: { handicap: newHandicap },
      });

      return round;
    }
  );

  // Delete round
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preValidation: [verifyAuth] },
    async (req) => {
      const round = await prisma.round.findFirst({
        where: {
          id: req.params.id,
          userId: (req.user as { id: string }).id,
        },
      });

      if (!round) {
        throw new Error("Round not found");
      }

      return prisma.round.delete({
        where: {
          id: req.params.id,
        },
      });
    }
  );
}
