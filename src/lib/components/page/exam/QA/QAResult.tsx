// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// types
import {
  ExamMemberType,
  ExamType,
  TrainingType,
} from "@/lib/types/ResultTypes";
// component
import QAResultInfo from "./QAResultInfo";
import QAResultDetail from "./QAResultDetail";
// services
import { HttpGetExamResult } from "@/lib/services/functions/frontend/examResultFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  examGeneralInfo: ExamType;
  examMember: ExamMemberType;
};

export default function QAResult({ examGeneralInfo, examMember }: Props) {
  // -- Use State --
  const [trainingResult, setTrainingResult] = useState<TrainingType>();

  // -- Use Effect --
  useEffect(() => {
    if (examGeneralInfo && examMember) {
      fetchTraining();
    }
  }, [examGeneralInfo, examMember]);

  // -- Function --
  const fetchTraining = async () => {
    const res = await HttpGetExamResult(
      `api/exam/result?id_exam=${examGeneralInfo?.id_exam}&id_user=${examMember?.id_user}`
    );

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setTrainingResult(res.data);
    }
  };

  return (
    <div className="h-full max-h-full flex justify-center items-center">
      {examGeneralInfo === undefined ||
      examMember === undefined ||
      trainingResult === undefined ? (
        <div className="flex flex-col items-center">
          <Icon icon="eos-icons:loading" className={`text-5xl`} />
          <span className="mt-2 text-sm text-budiluhur-800 text-center">
            Please wait a moment . . . <br /> the exam results are being
            processed
          </span>
        </div>
      ) : (
        <div className="w-full h-full max-h-full overflow-auto">
          {/* info */}
          <QAResultInfo
            startDate={examMember.start_date ?? ""}
            endDate={examMember.end_date ?? ""}
            grade={trainingResult.grade.grade}
            score={trainingResult.grade.score}
          />
          {/* divider */}
          <div className="my-5">
            <Divider className="bg-budiluhur-700 opacity-50" />
          </div>
          {/* result detail */}
          <QAResultDetail dtTrainingDetail={trainingResult.details} />
        </div>
      )}
    </div>
  );
}
