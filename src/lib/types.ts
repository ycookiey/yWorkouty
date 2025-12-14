export interface TrainingLog {
  id: string;
  clerkUserId: string;
  date: string;
  exerciseId: string;
  weight: number;
  reps: number;
  sets: number;
  createdAt: string;
}

export interface KnowledgeNote {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
