import { User } from "@prisma/client";
import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma";

export default async function routes(fastify: FastifyInstance) {
  // Get all lists
  fastify.get<{ Params: { id: string } }>("/:id", async (req) => {
    return prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });
  });

  fastify.delete<{ Params: { id: string } }>("/:id", async (req) => {
    return prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
  });

  fastify.put<{ Params: { id: string }; Body: User }>("/:id", async (req) => {
    return prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
  });
}
