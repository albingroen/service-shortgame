import axios from "axios";
import { sumBy } from "lodash";
import prisma from "./prisma";

export const getUserAverages = (user: { [key: string]: any }) => {
  const shortPuts = user.rounds?.length
    ? sumBy(user.rounds, "shortPuts") / user.rounds.length
    : 0;
  const longPuts = user.rounds?.length
    ? sumBy(user.rounds, "longPuts") / user.rounds.length
    : 0;
  const bunker = user.rounds?.length
    ? sumBy(user.rounds, "bunker") / user.rounds.length
    : 0;
  const pitch = user.rounds?.length
    ? sumBy(user.rounds, "pitch") / user.rounds.length
    : 0;
  const chip = user.rounds?.length
    ? sumBy(user.rounds, "chip") / user.rounds.length
    : 0;

  return {
    shortPuts,
    longPuts,
    bunker,
    pitch,
    chip,
  };
};

export const getUser = async (id: string, fullProfile?: boolean) => {
  const user = fullProfile
    ? await prisma.user.findUnique({
        where: { id },
        include: { rounds: true },
      })
    : await prisma.user.findUnique({
        where: { id },
        select: {
          handicap: true,
          avatar: true,
          rounds: {
            orderBy: {
              createdAt: "desc",
            },
          },
          name: true,
          id: true,
        },
      });

  if (!user) {
    throw new Error("Användaren hittades inte");
  }

  return {
    ...user,
    ...getUserAverages(user),
  };
};

export const getUserDetails = async (phoneNumber: string) => {
  return axios
    .get(
      `https://api.checkbiz.se/api/v1/subscriber?Phonenumber=${phoneNumber}`,
      {
        headers: {
          Authorization: process.env.CHECKBIZ_API_TOKEN,
          Package: "Subscriber",
        },
      }
    )
    .then((res) => res.data);
};
