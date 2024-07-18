// react
import { useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// types
import { ExamMemberType, ExamType } from "@/lib/types/ResultTypes";
// helpers
import { DateFormating } from "@/lib/helpers/helpers";
import { HttpUpdateExamMemberStatus } from "@/lib/services/functions/frontend/examMemberFunc";
import { ExamMemberStatuUpdateType } from "@/lib/types/InputTypes";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  examGeneralInfo: ExamType;
  examMember: ExamMemberType;
  afterUpdate: () => void;
};

export default function ExamStartComponent({
  examGeneralInfo,
  examMember,
  afterUpdate,
}: Props) {
  // -- Use State --
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  // -- Function --
  const handleStart = async () => {
    // build payload
    const httpMethod: string = "PUT";
    const httpPayload: ExamMemberStatuUpdateType = {
      id_exam_member: examMember?.id_exam_member,
      status: "ON_GOING",
    };

    // HTTP
    setLoadingSubmit(true);
    const res = await HttpUpdateExamMemberStatus(
      "api/exam/member/status",
      httpMethod,
      httpPayload
    );
    setLoadingSubmit(false);

    // response
    if (res.status == true) {
      afterUpdate();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <span className="w-full max-w-lg text-4xl text-center text-budiluhur-700 font-bold">
        {examGeneralInfo.title}
      </span>
      <span className="mt-2 text-xl text-center text-budiluhur-700 font">
        duration {examGeneralInfo.duration} minutes
      </span>
      <button
        type="submit"
        onClick={handleStart}
        className="w-max flex items-center py-2.5 px-5 mt-6 text-sm font-medium text-budiluhur-400 focus:outline-none bg-budiluhur-700 rounded-md hover:bg-budiluhur-600 hover:text-budiluhur-300 focus:bg-budiluhur-600 focus:text-budiluhur-300"
      >
        <Icon
          icon={`${loadingSubmit ? "eos-icons:loading" : "ph:play-fill"}`}
          className={`mr-2`}
        />
        Start
      </button>
    </div>
  );
}
