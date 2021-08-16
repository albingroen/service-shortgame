import prisma from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { sendSMS } from "../lib/sms";
import { APPLE_PHONE_NUMBER } from "../lib/utils";
import { getUserDetails } from "../lib/user";

export default async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: { phoneNumber: string } }>("/login", async (req) => {
    const confirmation = await prisma.confirmation.create({
      data: {
        code: String(Math.floor(1000 + Math.random() * 9000)),
        phoneNumber: req.body.phoneNumber,
      },
    });

    if (req.body.phoneNumber === APPLE_PHONE_NUMBER) {
      return {
        confirmation,
      };
    }

    return sendSMS({
      message: `Your 4-digit confirmation code is: ${confirmation.code}`,
      to: req.body.phoneNumber,
      from: "AUTHMSG",
      dryrun: "no",
    });
  });

  fastify.post<{
    Body: { code: string; phoneNumber: string; handicap?: number };
  }>("/confirm", async (req) => {
    const confirmation = await prisma.confirmation.findFirst({
      where: {
        phoneNumber: req.body.phoneNumber,
        code: req.body.code,
        confirmed: false,
      },
    });

    if (!confirmation) {
      throw new Error("The confirmation code you entered was invalid");
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
      const token = fastify.jwt.sign({ id: user.id });
      return token;
    }

    const userDetails = await getUserDetails(
      confirmation.phoneNumber.startsWith("+46")
        ? `0${confirmation.phoneNumber.substr(3)}`
        : confirmation.phoneNumber
    );

    const newUser = await prisma.user.create({
      data: {
        phoneNumber: confirmation.phoneNumber,
        handicap: req.body.handicap || 36,
        name:
          (userDetails?.personBasicResult?.givenName &&
            userDetails?.personBasicResult?.surName &&
            `${userDetails.personBasicResult.givenName} ${userDetails.personBasicResult.surName}`.trim()) ??
          undefined,
        avatar:
          "https://res.cloudinary.com/albin-groen/image/upload/f_auto,q_auto/v1628282079/placeholder-avatar_qq6oqj.png",
      },
    });

    await prisma.confirmation.delete({
      where: {
        id: confirmation.id,
      },
    });

    const token = fastify.jwt.sign({ id: newUser.id });
    return token;
  });
}
