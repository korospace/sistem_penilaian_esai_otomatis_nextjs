// react
import { useEffect, useRef, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
// helpers
import { cleanText } from "@/lib/helpers/helpers";
// types
import { InvalidFieldType } from "@/lib/types/ComponentTypes";
import { ExamQuestionType, ExamType } from "@/lib/types/ResultTypes";
import { ExamQuestionInputType } from "@/lib/types/InputTypes";
// services
import { HttpSaveExamQuestion } from "@/lib/services/functions/frontend/examQuestionFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  apiPath: string;
  dtGeneralInfo: ExamType | undefined;
  dtQuestion?: ExamQuestionType;
  showForm: boolean;
  onCancle: () => void;
  afterSubmit: () => void;
};

export default function ExamQuestionForm({
  apiPath,
  dtGeneralInfo,
  dtQuestion,
  showForm,
  onCancle,
  afterSubmit,
}: Props) {
  // -- Use Ref --
  const dropdownRef = useRef<HTMLDivElement>(null);

  // -- Use State --
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [questionValue, setQuestionValue] = useState<string>("");
  const [answerValue, setAnswerValue] = useState<string>("");
  const [questionInvalid, setQuestionInvalid] = useState<InvalidFieldType>();
  const [answerKeyInvalid, setAnswerKeyInvalid] = useState<InvalidFieldType>();

  // -- Use effect --
  useEffect(() => {
    if (dtQuestion) {
      setQuestionValue(dtQuestion.question);
      setAnswerValue(dtQuestion.answer_key);
    }
  }, [dtQuestion]);

  // -- Functions --
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // reset error
    setQuestionInvalid({ invalid: false, message: "" });
    setAnswerKeyInvalid({ invalid: false, message: "" });

    // value
    const question = questionValue;
    const answer_key = answerValue;

    // validation empty
    if (cleanText(question) == "")
      setQuestionInvalid({ invalid: true, message: "question cant be empty" });
    if (cleanText(answer_key) == "")
      setAnswerKeyInvalid({
        invalid: true,
        message: "answer key cant be empty",
      });
    if (cleanText(question) == "" || cleanText(answer_key) == "") return;

    // build payload
    const httpApiPath: string =
      dtQuestion === undefined ? apiPath + "/create" : apiPath + "/update";
    const httpMethod: string = dtQuestion === undefined ? "POST" : "PUT";
    const httpPayload: ExamQuestionInputType = {
      id_exam_question: dtQuestion?.id_exam_question,
      id_exam: dtGeneralInfo?.id_exam ?? 0,
      question,
      answer_key,
    };

    // HTTP
    setLoadingForm(true);
    const res = await HttpSaveExamQuestion(
      httpApiPath,
      httpMethod,
      httpPayload
    );
    setLoadingForm(false);

    // response
    if (res.status == true) {
      toast.success("data saved successfully!");
      afterSubmit();

      if (dtQuestion) {
        onCancle();
      } else {
        setQuestionValue("");
        setAnswerValue("");
      }
    } else {
      if (res.message === "validation failed") {
        if (res.data.question) {
          setQuestionInvalid({
            invalid: true,
            message: res.data.question,
          });
        }
        if (res.data.answer_key) {
          setAnswerKeyInvalid({
            invalid: true,
            message: res.data.answer_key,
          });
        }
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`w-full ${
        showForm
          ? "px-6 py-6 overflow-visible"
          : "h-0 px-0 py-0 overflow-hidden"
      } transition-all`}
    >
      <form
        onSubmit={handleSubmit}
        className="p-6 shadow-md rounded bg-budiluhur-500"
      >
        <div className="flex gap-3">
          {/* Question */}
          <div className="mb-5 flex-1">
            <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
              Question
            </label>
            <ReactQuill
              theme="snow"
              value={questionValue}
              onChange={(value: string) => {
                setQuestionValue(value);
                setQuestionInvalid({ invalid: false, message: "" });
              }}
              className={`w-full max-w-lg p-1 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
                questionInvalid?.invalid
                  ? "bg-red-300 border-red-600 text-red-700"
                  : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
              }`}
            />
            {questionInvalid?.invalid && (
              <p className="mt-2 text-sm text-red-600">
                {questionInvalid.message}
              </p>
            )}
          </div>

          {/* Answer Key */}
          <div className="mb-5 flex-1">
            <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
              Answer Key
            </label>
            <ReactQuill
              theme="snow"
              value={answerValue}
              onChange={(value: string) => {
                setAnswerValue(value);
                setAnswerKeyInvalid({ invalid: false, message: "" });
              }}
              className={`w-full max-w-lg p-1 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
                questionInvalid?.invalid
                  ? "bg-red-300 border-red-600 text-red-700"
                  : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
              }`}
            />
            {answerKeyInvalid?.invalid && (
              <p className="mt-2 text-sm text-red-600">
                {answerKeyInvalid.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="flex items-center mr-2 py-2 px-4 text-xs font-medium text-budiluhur-700 hover:text-budiluhur-400 focus:text-budiluhur-400 border-2 border-budiluhur-700 hover:bg-budiluhur-700 focus:bg-budiluhur-700 focus:outline-none rounded-md"
            onClick={onCancle}
          >
            Cancle
          </button>

          <button
            type="submit"
            className="flex items-center py-2 px-4 text-xs font-medium text-budiluhur-400 focus:outline-none bg-budiluhur-700 rounded-md hover:bg-budiluhur-600 hover:text-budiluhur-300 focus:bg-budiluhur-600 focus:text-budiluhur-300"
          >
            <Icon
              icon="eos-icons:loading"
              className={`mr-2 ${loadingForm ? "" : "hidden"}`}
            />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
