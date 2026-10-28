// TODO: Make exercises editable from an admin page instead of this hard-coded list.

export type BodyPart = "chest" | "back" | "arms" | "shoulders" | "legs" | "core";

export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
}

export const BODY_PARTS: Record<BodyPart, string> = {
  chest: "胸",
  back: "背中",
  arms: "腕",
  shoulders: "肩",
  legs: "脚",
  core: "体幹",
};

export const EXERCISES: Exercise[] = [
  { id: "bench-press", name: "ベンチプレス", bodyPart: "chest" },
  { id: "dumbbell-fly", name: "ダンベルフライ", bodyPart: "chest" },
  { id: "chest-press", name: "チェストプレス", bodyPart: "chest" },
  
  { id: "lat-pulldown", name: "ラットプルダウン", bodyPart: "back" },
  { id: "seated-row", name: "シーテッドロー", bodyPart: "back" },
  { id: "deadlift", name: "デッドリフト", bodyPart: "back" },
  
  { id: "arm-curl", name: "アームカール", bodyPart: "arms" },
  { id: "triceps-press", name: "トライセプスプレス", bodyPart: "arms" },
  { id: "hammer-curl", name: "ハンマーカール", bodyPart: "arms" },
];

export function getExercisesByBodyPart(bodyPart: BodyPart): Exercise[] {
  return EXERCISES.filter((e) => e.bodyPart === bodyPart);
}

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
