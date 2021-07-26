import { FastifyReply, FastifyRequest } from "fastify";

export const verifyAuth = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    res.send(err);
  }
};
