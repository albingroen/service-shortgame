import { User } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { omit } from "lodash";
import { verifyAuth } from "../lib/auth";
import prisma from "../lib/prisma";
import { getUser, getUserAverages } from "../lib/user";
import { APPLE_PHONE_NUMBER } from "../lib/utils";

export default async function routes(fastify: FastifyInstance) {
  // Get user
  fastify.get("/", { preValidation: [verifyAuth] }, async (req) => {
    return getUser((req.user as { id: string }).id, true);
  });

  // Get public user
  fastify.get<{ Params: { id: string } }>(
    "/public/:id",
    { preValidation: [verifyAuth] },
    async (req) => {
      return getUser(req.params.id);
    }
  );

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
    const users = await prisma.user.findMany({
      where: {
        phoneNumber: {
          not: APPLE_PHONE_NUMBER,
        },
      },
      orderBy: {
        handicap: "asc",
      },
      select: {
        handicap: true,
        rounds: true,
        avatar: true,
        name: true,
        id: true,
      },
    });

    return users.map((user) => ({
      ...omit(user, ["rounds"]),
      ...getUserAverages(user),
    }));
  });
}
