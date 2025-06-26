import * as fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import Moves from "./data/moves.ts";

// 1. Collect all unique keys for flags, conditions, secondary, and boosts
const moves = Object.values(Moves);

const allFlagKeys = Array.from(
  new Set(
    moves.flatMap((move: any) => (move.flags ? Object.keys(move.flags) : []))
  )
);
const allConditionKeys = Array.from(
  new Set(
    moves.flatMap((move: any) =>
      move.conditions ? Object.keys(move.conditions) : []
    )
  )
);
const allSecondaryKeys = Array.from(
  new Set(
    moves.flatMap((move: any) =>
      move.secondary ? Object.keys(move.secondary) : []
    )
  )
);

const allBoostKeys = Array.from(
  new Set(
    moves.flatMap((move: any) =>
      move.secondary && move.secondary.boosts
        ? Object.keys(move.secondary.boosts)
        : []
    )
  )
);

const allSelfKeys = Array.from(
  new Set(
    moves.flatMap((move: any) =>
      move.secondary && move.secondary.self && move.secondary.self.boosts
        ? Object.keys(move.secondary.self.boosts)
        : []
    )
  )
);

// 2. Build the CSV header
const header = [
  { id: "num", title: "Move Number" },
  { id: "name", title: "Move Name" },
  { id: "type", title: "Move Type" },
  { id: "category", title: "Move Category" },
  { id: "basePower", title: "Base Power" },
  { id: "accuracy", title: "Accuracy" },
  { id: "pp", title: "PP" },
  { id: "target", title: "Target" },
  { id: "priority", title: "Priority" },
  ...allFlagKeys.map((key) => ({ id: `flag_${key}`, title: `Flag: ${key}` })),
  ...allConditionKeys.map((key) => ({
    id: `condition_${key}`,
    title: `Condition: ${key}`,
  })),
  ...allSecondaryKeys.map((key) => ({
    id: `secondary_${key}`,
    title: `Secondary: ${key}`,
  })),
  ...allBoostKeys.map((key) => ({
    id: `boost_${key}`,
    title: `Boost: ${key}`,
  })),
  ...allSelfKeys.map((key) => ({
    id: `self_${key}`,
    title: `selfBoost:${key}`,
  })),
];

// 3. Build records with values for each key
const records = Object.entries(Moves).map(([key, value]: [string, any]) => {
  const record: any = {
    ...value,
    name: key,
  };
  // Add flag columns
  allFlagKeys.forEach((flagKey) => {
    record[`flag_${flagKey}`] = value.flags && value.flags[flagKey] ? 1 : "";
  });
  // Add condition columns
  allConditionKeys.forEach((condKey) => {
    record[`condition_${condKey}`] =
      value.conditions && value.conditions[condKey] !== undefined
        ? value.conditions[condKey]
        : "";
  });
  // Add secondary columns
  allSecondaryKeys.forEach((secKey) => {
    record[`secondary_${secKey}`] =
      value.secondary && value.secondary[secKey] !== undefined
        ? value.secondary[secKey]
        : "";
  });

  allBoostKeys.forEach((boostKey) => {
    record[`boost_${boostKey}`] =
      value.secondary &&
      value.secondary.boosts &&
      value.secondary.boosts[boostKey] !== undefined
        ? value.secondary.boosts[boostKey]
        : "";
  });

  allSelfKeys.forEach((selfKey) => {
    record[`self_${selfKey}`] =
      value.secondary &&
      value.secondary.self &&
      value.secondary.self.boosts &&
      value.secondary.self.boosts[selfKey] !== undefined
        ? value.secondary.self.boosts[selfKey]
        : "";
  });
  return record;
});

const csvWriter = createObjectCsvWriter({
  path: "moves.csv",
  header,
});

csvWriter
  .writeRecords(records)
  .then(() => console.log("CSV file written successfully"))
  .catch((err) => console.error("Error writing CSV file:", err));
