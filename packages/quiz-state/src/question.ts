/**
 * Represent a question in the quiz
 */
export type Question = {
  id: number;
  type: "text";
  title: string;
  duration: number;
};
