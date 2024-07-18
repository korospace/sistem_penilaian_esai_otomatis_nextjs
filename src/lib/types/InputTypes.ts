import { ExamStatus } from "@prisma/client";
// types
import { PreProcessingType } from "./ResultTypes";

/**
 * General
 * --------------------------
 */
export type SearchParamsType = {
  page: string;
  limit: string;
  keyword: string;
};

export type PaginationOptionsType = {
  skip: number;
  take: number;
};

/**
 * Training
 * --------------------------
 */
export type TrainingInputType = {
  answer_key: string;
  answer: string;
  expectation_grade?: string;
};

export type TrainingInputV2Type = {
  similiarity_matrix: string;
  max_simmatrix: string;
  answer: PreProcessingType;
  answer_key: PreProcessingType;
};

export type LevInputType = {
  string1: string;
  string2: string;
};

/**
 * Login
 * --------------------------
 */
export type LoginInputType = {
  username: string;
  password: string;
};

/**
 * User
 * --------------------------
 */
export type UserInputType = {
  id_user?: number;
  username: string;
  password?: string;
  full_name: string;
  id_user_role?: number;
};

export type UserSearchType = {
  id_user?: any;
  id_user_role?: number;
  OR?: {
    username?: any;
    full_name?: any;
  }[];
};

/**
 * Course
 * --------------------------
 */
export type CourseInputType = {
  id_course?: number;
  name: string;
  description: string;
};

export type CourseSearchType = {
  id_course?: any;
  OR?: {
    name?: any;
  }[];
};

/**
 * Exam
 * --------------------------
 */
export type ExamInputType = {
  id_exam?: number;
  id_course: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  duration: number;
};

export type ExamSearchParamType = SearchParamsType & {
  id_exam: string;
  id_course: string;
  status: string;
};

export type ExamWhereType = {
  id_exam?: any;
  created_by?: any;
  exam_member?: any;
  OR?: {
    id_course?: any;
    status?: any;
    title?: any;
  }[];
};

/**
 * Exam Question
 * --------------------------
 */
export type ExamQuestionInputType = {
  id_exam_question?: number;
  id_exam: number;
  question: string;
  answer_key: string;
};

export type ExamQuestionSearchParamType = SearchParamsType & {
  id_exam: string;
};

export type ExamQuestionWhereType = {
  id_exam?: any;
  OR?: {
    question?: any;
  }[];
};

/**
 * Exam Member
 * --------------------------
 */
export type ExamMemberInputType = {
  id_exam: number;
  id_user: number;
};

export type ExamMemberSearchParamType = SearchParamsType & {
  id_exam: string;
  id_user: string;
};

export type ExamMemberWhereType = {
  id_exam?: any;
  user?: any;
};

export type ExamMemberStatuUpdateType = {
  id_exam_member: number;
  status: ExamStatus;
};

/**
 * Exam Answer
 * --------------------------
 */
export type ExamAnswerInputType = {
  id_exam_answer?: number;
  id_exam_question: number;
  id_user: number;
  answer: string;
};

export type ExamAnswerSearchParamType = SearchParamsType & {
  id_exam: string;
  id_user: string;
};

export type ExamAnswerWhereType = {
  exam_question?: any;
  user?: any;
};

/**
 * Exam Result
 * --------------------------
 */
export type ExamResultSearchParamType = {
  id_exam: string;
  id_user: string;
};
