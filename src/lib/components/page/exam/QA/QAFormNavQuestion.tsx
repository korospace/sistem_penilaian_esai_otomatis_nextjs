// react
import { useEffect, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// types
import {
  ExamAnswerType,
  ExamMemberType,
  ExamQuestionType,
  ExamType,
} from "@/lib/types/ResultTypes";
// helpers
import { DateFormating, cleanText } from "@/lib/helpers/helpers";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  selectedQuestion: ExamQuestionType | undefined;
  examQuestionList: ExamQuestionType[];
  examAnswerList: ExamAnswerType[];
  examMember: ExamMemberType;
  examGeneralInfo: ExamType;
  onChoose: (question: ExamQuestionType) => void;
};

/**
 * Types
 * -----------------------------------
 */
type newExamQuestionInputType = ExamQuestionType & {
  finished: boolean;
};

export default function QAFormNavQuestion({
  selectedQuestion,
  examQuestionList,
  examAnswerList,
  examGeneralInfo,
  examMember,
  onChoose,
}: Props) {
  // -- Use State --
  const [newQuestionList, setNewQuestionList] = useState<
    newExamQuestionInputType[]
  >([]);

  // -- Use Effect --
  useEffect(() => {
    if (examQuestionList.length > 0) {
      if (selectedQuestion === undefined) {
        onChoose(examQuestionList[0]);
      }

      const newQuestionData: newExamQuestionInputType[] = examQuestionList.map(
        (row) => {
          const findAnswer = examAnswerList.find(
            (eA) => eA.id_exam_question === row.id_exam_question
          );

          return {
            ...row,
            finished: findAnswer
              ? cleanText(findAnswer.answer) !== ""
                ? true
                : false
              : false,
          };
        }
      );

      setNewQuestionList(newQuestionData);
    }
  }, [selectedQuestion, examQuestionList, examAnswerList]);

  // -- Function --
  const checkExamEndDate = (): boolean => {
    const unixEndDate = DateFormating.toUnixTimeStamp(examGeneralInfo.end_date);
    const unixNow = DateFormating.toUnixTimeStamp(new Date().toString());

    return unixEndDate < unixNow;
  };

  return (
    <div className="h-full max-h-full p-4 bg-budiluhur-500 rounded border border-budiluhur-700 overflow-auto">
      {examQuestionList === undefined ||
      newQuestionList.length === 0 ||
      examMember === undefined ? (
        <div className="h-full flex justify-center items-center">
          <Icon icon="eos-icons:loading" className={`text-2xl`} />
        </div>
      ) : (
        <>
          {newQuestionList.length == 0 ? (
            <div className="h-full flex justify-center items-center">
              <span className="text-sm">question not found</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {newQuestionList.map((row, index) => (
                <>
                  {examMember.status === "COMPLETED" || checkExamEndDate() ? (
                    <button
                      key={index}
                      onClick={() => onChoose(row)}
                      className={`relative p-1 text-budiluhur-700 text-sm rounded shadow border hover:bg-budiluhur-300 hover:border-budiluhur-700 ${
                        row.id_exam_question ===
                        selectedQuestion?.id_exam_question
                          ? "bg-budiluhur-300 border-budiluhur-700"
                          : "bg-budiluhur-400 border-transparent"
                      }`}
                    >
                      <span className="text-xs">{index + 1}</span>
                      {row.finished && (
                        <Icon
                          icon="streamline:check-solid"
                          className="absolute bottom-0.5 right-0.5 text-[8px]"
                        />
                      )}
                    </button>
                  ) : (
                    <button
                      key={index}
                      className={`relative p-1 text-budiluhur-700 text-sm rounded shadow border cursor-default ${
                        row.id_exam_question ===
                        selectedQuestion?.id_exam_question
                          ? "bg-budiluhur-300 border-budiluhur-700"
                          : "bg-budiluhur-400 border-transparent"
                      }`}
                    >
                      <span className="text-xs">{index + 1}</span>
                      {row.finished && (
                        <Icon
                          icon="streamline:check-solid"
                          className="absolute bottom-0.5 right-0.5 text-[8px]"
                        />
                      )}
                    </button>
                  )}
                </>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
