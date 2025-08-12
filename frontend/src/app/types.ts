export interface QuestionResponse {
  topics: {
    name: string;
    questions: string[];
  }[];
}