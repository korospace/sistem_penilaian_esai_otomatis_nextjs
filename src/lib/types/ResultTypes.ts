import { ExamStatus } from "@prisma/client";
// nextjs
import { NextMiddleware } from "next/server";

export type DurationType = {
  hour: number;
  minute: number;
  second: number;
};

export type SynonymType = {
  id_synonym: number;
  word: string;
  tag: string;
  synonym: string;
};

/**
 * Middleware
 * --------------------------
 */
export type MiddlewareFactoryType = (
  middleware: NextMiddleware
) => NextMiddleware;

/**
 * Response API
 * --------------------------
 */
export type ApiResponseType = {
  status: boolean;
  code?: number;
  message: string;
  totalPage?: number;
  totalRow?: number;
  data?: any;
};

/**
 * Course
 * --------------------------
 */
export type CourseType = {
  id_course: number;
  name: string;
  description: string;
};

/**
 * Essay Correction
 * --------------------------
 */
export type LevType = {
  distance: number;
  distanceLength: number;
  levValue: number;
  matriks: number[][];
  string1: string;
  string2: string;
};

export type TrainingType = {
  wrong?: number;
  correct?: number;
  accuracy?: number;
  grade: TrainingGradeType;
  details: TrainingDetailType[];
};

export type TrainingGradeType = {
  grade: string;
  score: number;
};

export type TrainingDetailType = {
  grade: TrainingGradeType;
  similiarity_matrix: string;
  max_simmatrix: string;
  answer: PreProcessingType;
  answer_key: PreProcessingType;
};

export type PreProcessingType = {
  str?: string;
  arr?: string[];
  raw_value?: string;
  cleaned?: string;
  stemmed?: string;
  stopword_removed?: string;
  n_gram?: string;
  synonym_replaced?: string;
};

/**
 * User
 * --------------------------
 */
export type UserType = {
  id_user: number;
  username: string;
  full_name: string;
  id_user_role: number;
};

export interface SessionType {
  user: {
    id_user: number;
    username: string;
    full_name: string;
    id_user_role: number;
  };
}

/**
 * Exam
 * --------------------------
 */
export type ExamType = {
  id_exam: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  duration: number;
  course: CourseType;
  exam_member?: ExamMemberType[];
  exam_question?: ExamQuestionType[];
};

export type ExamMemberType = {
  id_exam_member: number;
  id_exam: number;
  id_user: number;
  score?: number;
  grade?: string;
  start_date?: string;
  end_date?: string;
  status?: ExamStatus;
  user: UserType;
};

export type ExamQuestionType = {
  id_exam_question?: number;
  id_exam: number;
  question: string;
  answer_key: string;
};

export type ExamAnswerType = {
  id_exam_answer: number;
  id_exam_question: number;
  id_user: number;
  answer: string;
};
