import prisma from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { sendSMS } from "../lib/sms";
import axios from "axios";

export default async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: { phoneNumber: string } }>("/login", async (req) => {
    const confirmation = await prisma.confirmation.create({
      data: {
        code: String(Math.floor(1000 + Math.random() * 9000)),
        phoneNumber: req.body.phoneNumber,
      },
    });

    return sendSMS({
      message: `Your 4-digit confirmation code is: ${confirmation.code}`,
      to: req.body.phoneNumber,
      from: "AUTHMSG",
      dryrun: "yes",
    });
  });

  fastify.post<{ Body: { code: string; phoneNumber: string } }>(
    "/confirm",
    async (req) => {
      const confirmation = await prisma.confirmation.findFirst({
        where: {
          phoneNumber: req.body.phoneNumber,
          code: req.body.code,
          confirmed: false,
        },
      });

      if (!confirmation) {
        throw new Error("Not Found");
      }

      const user = await prisma.user.findUnique({
        where: {
          phoneNumber: confirmation.phoneNumber,
        },
      });

      if (user) {
        await prisma.confirmation.delete({
          where: {
            id: confirmation.id,
          },
        });

        // Create JWT with user ID and return
        return user;
      }

      const newUser = await prisma.user.create({
        data: {
          phoneNumber: confirmation.phoneNumber,
          avatar:
            "https://source.boringavatars.com/marble/120/Maria%20Mitchell?colors=264653,2a9d8f,e9c46a,f4a261,e76f51",
          email: "john@doe.com",
          name: "John Doe",
        },
      });

      await prisma.confirmation.delete({
        where: {
          id: confirmation.id,
        },
      });

      return newUser;
    }
  );
}
