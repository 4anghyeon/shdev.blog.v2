import { sample } from "es-toolkit";

/** 벌레 종류별로 돌아다닐 때의 비행 속도(px/s). */
export const BUG_SPECIES = {
  fly: { wanderSpeed: 110 },
  ladybug: { wanderSpeed: 80 },
  mosquito: { wanderSpeed: 125 },
} as const;

export type BugSpecies = keyof typeof BUG_SPECIES;

const SPECIES_LIST: BugSpecies[] = ["fly", "ladybug", "mosquito"];

/** 등장할 벌레 종류를 무작위로 고른다. */
export const pickSpecies = () => sample(SPECIES_LIST);
