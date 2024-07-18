// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
// types
import {
  ExamAnswerInputType,
  ExamMemberStatuUpdateType,
} from "@/lib/types/InputTypes";
import {
  ExamAnswerType,
  ExamMemberType,
  ExamQuestionType,
  ExamType,
} from "@/lib/types/ResultTypes";
// components
import BlockRefresh from "@/lib/components/page/BlockRefreshComponent";
import DialogComponent from "../../DialogComponent";
// services
import { HttpUpdateExamMemberStatus } from "@/lib/services/functions/frontend/examMemberFunc";
import { HttpSaveExamAnswer } from "@/lib/services/functions/frontend/examAnswerFunc";
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

export default function QAFormAnswer({
  selectedQuestion,
  examQuestionList,
  examAnswerList,
  examGeneralInfo,
  examMember,
  onChoose,
}: Props) {
  // -- Use State --
  // const [allowRefresh, setAllowRefresh] = useState<boolean>(false);
  const [answerCurrent, setAnswerCurrent] = useState<ExamAnswerType>();
  const [answerValue, setAnswerValue] = useState<string>("");
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);
  const [showRsync, setShowRsync] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>();
  const [prevQuestion, setPrevQuestion] = useState<
    ExamQuestionType | undefined
  >();
  const [nextQuestion, setNextQuestion] = useState<
    ExamQuestionType | undefined
  >();
  const [lastQuestion, setLastQuestion] = useState<
    ExamQuestionType | undefined
  >();

  // -- Use Effect --
  useEffect(() => {
    if (selectedQuestion !== undefined && examQuestionList.length > 0) {
      // set question number
      const selectedIndex = examQuestionList.findIndex(
        (row) => row.id_exam_question === selectedQuestion.id_exam_question
      );
      setQuestionNumber(selectedIndex + 1);

      // set current answer
      if (examAnswerList && examAnswerList.length > 0) {
        const selectedAnswer = examAnswerList.find(
          (row) => row.id_exam_question === selectedQuestion.id_exam_question
        );
        setAnswerValue(selectedAnswer?.answer ?? "");
        setAnswerCurrent(selectedAnswer);
      }

      // set prev question
      if (
        selectedIndex != 0 &&
        examQuestionList[selectedIndex - 1] !== undefined
      ) {
        setPrevQuestion(examQuestionList[selectedIndex - 1]);
      } else {
        setPrevQuestion(undefined);
      }
      // set next question
      if (examQuestionList[selectedIndex + 1] !== undefined) {
        setNextQuestion(examQuestionList[selectedIndex + 1]);
      } else {
        setNextQuestion(undefined);
      }
      // set final question
      if (examQuestionList.length === selectedIndex + 1) {
        setLastQuestion(examQuestionList[selectedIndex]);
      } else {
        setLastQuestion(undefined);
      }
    }
  }, [selectedQuestion, examQuestionList, examAnswerList]);

  // -- Function --
  const handleFinishExam = async () => {
    // build payload
    const httpMethod: string = "PUT";
    const httpPayload: ExamMemberStatuUpdateType = {
      id_exam_member: examMember?.id_exam_member,
      status: "COMPLETED",
    };

    setDialogLoading(true);
    if (selectedQuestion) {
      await handleSaveAnswer(selectedQuestion);
    }
    const res = await HttpUpdateExamMemberStatus(
      "api/exam/member/status",
      httpMethod,
      httpPayload
    );
    setDialogLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      toast.success("Success finishing exam!");
      // setAllowRefresh(true);
      window.location.reload();
    }
  };

  const handleSaveAnswer = async (nextQuestion: ExamQuestionType) => {
    if (examMember.status != "COMPLETED" && !checkExamEndDate()) {
      // build payload
      const httpMethod: string = "POST";
      const httpPayload: ExamAnswerInputType = {
        id_exam_answer: answerCurrent?.id_exam_answer,
        id_exam_question: selectedQuestion?.id_exam_question ?? 0,
        id_user: examMember.id_user,
        answer: cleanText(answerValue) == "" ? "" : answerValue,
      };

      setShowRsync(true);
      const res = await HttpSaveExamAnswer(
        "api/exam/answer",
        httpMethod,
        httpPayload
      );
      setShowRsync(false);

      if (res.status == false) {
        if (res.message === "not allowed") {
          toast.error("time is over");
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          toast.error(res.message);
        }
      }
    }

    // --------------------
    onChoose(nextQuestion);
    setAnswerValue("");
  };

  const handleShowDialog = () => {
    let notAnsweredListCount = 0;

    examAnswerList.forEach((row) => {
      if (cleanText(row.answer) === "") {
        notAnsweredListCount = notAnsweredListCount + 1;
      }
    });

    if (examAnswerList.length < examQuestionList.length) {
      if (cleanText(answerValue) === "") {
        notAnsweredListCount = notAnsweredListCount + 1;
      }
    }

    if (examAnswerList[examAnswerList.length - 1] !== undefined) {
      if (cleanText(examAnswerList[examAnswerList.length - 1].answer) === "") {
        if (cleanText(answerValue) !== "") {
          notAnsweredListCount = notAnsweredListCount - 1;
        }
      }
    }

    setDialogMessage(
      `Are you sure finishsing the exam? ${
        notAnsweredListCount > 0
          ? `There are <b><u>( ${notAnsweredListCount} )</u></b> unanswered questions`
          : ""
      }`
    );
    setShowDialog(true);
  };

  const checkExamEndDate = (): boolean => {
    const unixEndDate = DateFormating.toUnixTimeStamp(examGeneralInfo.end_date);
    const unixNow = DateFormating.toUnixTimeStamp(new Date().toString());

    return unixEndDate < unixNow;
  };

  return (
    <div className="h-full max-h-full flex flex-col px-4 py-4 bg-budiluhur-500 rounded border border-budiluhur-700">
      {selectedQuestion !== undefined &&
        examQuestionList !== undefined &&
        examGeneralInfo !== undefined &&
        examMember !== undefined && (
          <>
            {/* title */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-budiluhur-700 text-lg font-light">
                <div>Question {questionNumber}</div>
                {showRsync && (
                  <Icon icon="line-md:uploading-loop" className="text-md" />
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* prev */}
                {prevQuestion !== undefined && (
                  <button
                    onClick={() => {
                      handleSaveAnswer(prevQuestion);
                    }}
                    className="flex items-center py-1 px-3 text-xs font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
                  >
                    <Icon
                      icon="basil:arrow-left-outline"
                      className="text-2xl"
                    />
                    Prev
                  </button>
                )}

                {/* next */}
                {nextQuestion !== undefined && (
                  <button
                    onClick={() => {
                      handleSaveAnswer(nextQuestion);
                    }}
                    className="flex items-center py-1 px-3 text-xs font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
                  >
                    Next
                    <Icon
                      icon="basil:arrow-left-outline"
                      className="text-2xl rotate-180"
                    />
                  </button>
                )}

                {/* finish */}
                {lastQuestion !== undefined &&
                  examMember.status !== "COMPLETED" &&
                  !checkExamEndDate() && (
                    <button
                      onClick={() => handleShowDialog()}
                      className="w-[75px] py-2 px-3 text-xs font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
                    >
                      finish
                    </button>
                  )}
              </div>
            </div>

            {/* Divider */}
            <div className="mt-1.5 mb-4">
              <Divider className="bg-budiluhur-700 opacity-50" />
            </div>

            {/* Question & Answer */}
            <div className="flex-1 overflow-auto">
              <div
                className="text-budiluhur-800 text-sm"
                dangerouslySetInnerHTML={{ __html: selectedQuestion.question }}
              />

              {/* number */}
              <h1 className="mt-8 text-budiluhur-700 text-lg font-light">
                Answer :
              </h1>

              {/* Divider */}
              <div className="mt-2.5 mb-4">
                <Divider className="bg-budiluhur-700 opacity-50" />
              </div>

              {/* answer */}
              {examMember.status == "COMPLETED" || checkExamEndDate() ? (
                <div
                  className="text-budiluhur-800 text-md"
                  dangerouslySetInnerHTML={{
                    __html:
                      answerValue !== ""
                        ? answerValue
                        : "( <i>There is no answer</i> )",
                  }}
                />
              ) : (
                <ReactQuill
                  theme="snow"
                  value={answerValue}
                  onChange={setAnswerValue}
                  className={`w-full mt-4 p-1 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700`}
                />
              )}
            </div>

            {/* Dialog - Finish */}
            {lastQuestion !== undefined &&
              examMember.status !== "COMPLETED" &&
              !checkExamEndDate() && (
                <DialogComponent
                  title="Finish"
                  showModal={showDialog}
                  message={dialogMessage}
                  isLoading={dialogLoading}
                  onSubmit={() => handleFinishExam()}
                  onCancle={() => setShowDialog(false)}
                />
              )}

            {/*allowRefresh === false && <BlockRefresh />*/}
          </>
        )}
    </div>
  );
}
