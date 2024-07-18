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
// component
import QANavQuestion from "./QAFormNavQuestion";
import QACountdown from "./QAFormCountdown";
import QAFormAnswer from "./QAFormAnswer";
// services
import { HttpGetExamQuestion } from "@/lib/services/functions/frontend/examQuestionFunc";
import { HttpGetExamAnswer } from "@/lib/services/functions/frontend/examAnswerFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  examGeneralInfo: ExamType;
  examMember: ExamMemberType;
  onEnded: () => void;
};

export default function QAForm({
  examGeneralInfo,
  examMember,
  onEnded,
}: Props) {
  // -- Use State --
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestionType>();
  const [questionList, setQuestionList] = useState<ExamQuestionType[]>([]);
  const [answerList, setAnswerList] = useState<ExamAnswerType[]>([]);

  // -- Use Effect --
  useEffect(() => {
    if (examGeneralInfo && examMember) {
      fetchQuestion();
      fetchAnswer();
    }
  }, [examGeneralInfo, examMember]);

  // -- Function --
  const fetchQuestion = async () => {
    const res = await HttpGetExamQuestion(
      `api/exam/question?id_exam=${examGeneralInfo?.id_exam}`
    );

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setQuestionList(res.data.data);
    }
  };

  const fetchAnswer = async () => {
    const res = await HttpGetExamAnswer(
      `api/exam/answer?id_exam=${examGeneralInfo?.id_exam}&id_user=${examMember.id_user}`
    );

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setAnswerList(res.data.data);
    }
  };

  return (
    <div className="h-full max-h-full flex justify-center items-center gap-4">
      {examGeneralInfo === undefined || examMember === undefined ? (
        <Icon icon="eos-icons:loading" className={`text-5xl`} />
      ) : (
        <>
          <div className="h-full max-h-full flex flex-col gap-2">
            {/* count down */}
            <div className="w-[202px]">
              <QACountdown
                examGeneralInfo={examGeneralInfo}
                examMember={examMember}
                onEnded={onEnded}
              />
            </div>
            {/* Question Nav */}
            <div className="w-[202px] flex-1 overflow-hidden">
              <QANavQuestion
                onChoose={(question) => {
                  setSelectedQuestion(question);
                  fetchAnswer();
                }}
                selectedQuestion={selectedQuestion}
                examGeneralInfo={examGeneralInfo}
                examQuestionList={questionList}
                examAnswerList={answerList}
                examMember={examMember}
              />
            </div>
          </div>
          <div className="flex-1 h-full max-h-full">
            <QAFormAnswer
              onChoose={(question) => {
                setSelectedQuestion(question);
                fetchAnswer();
              }}
              selectedQuestion={selectedQuestion}
              examGeneralInfo={examGeneralInfo}
              examQuestionList={questionList}
              examAnswerList={answerList}
              examMember={examMember}
            />
          </div>
        </>
      )}
    </div>
  );
}
