import HCPTable from "../hcp-table";

export function getNewHandicap(currentHandicap: number, score: number) {
  const scoreHandicap = HCPTable[String(score)];
  const diff = Math.floor(currentHandicap) - scoreHandicap;
  const subtractor = diff / 2;
  return currentHandicap - subtractor;
}
