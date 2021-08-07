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
  const user = await prisma.user.findUnique({
    where: { id },
    select: fullProfile
      ? undefined
      : {
          handicap: true,
          avatar: true,
          rounds: true,
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
