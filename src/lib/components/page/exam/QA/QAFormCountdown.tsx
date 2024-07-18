// react
import { useEffect, useState } from "react";
// external lib
import Countdown from "react-countdown";
import toast from "react-hot-toast";
// types
import { ExamMemberType, ExamType } from "@/lib/types/ResultTypes";
import { ExamMemberStatuUpdateType } from "@/lib/types/InputTypes";
// helpers
import { DateFormating } from "@/lib/helpers/helpers";
// components
import LoadingComponent from "../../LoadingComponent";
// services
import { HttpUpdateExamMemberStatus } from "@/lib/services/functions/frontend/examMemberFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  examGeneralInfo: ExamType;
  examMember: ExamMemberType;
  onEnded: () => void;
};

export default function QAFormCountdown({
  examGeneralInfo,
  examMember,
  onEnded,
}: Props) {
  // -- Use State --
  const [showLoading, setShowLoading] = useState<boolean>(false);

  // -- Functions --
  const checkExamEndDate = (): boolean => {
    const unixEndDate = DateFormating.toUnixTimeStamp(examGeneralInfo.end_date);
    const unixNow = DateFormating.toUnixTimeStamp(new Date().toString());

    return unixEndDate < unixNow;
  };

  const rendererCountdown = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      handleTimeEnded();
      return "__ : __ : __";
    } else {
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      return (
        <span>
          {formattedHours} : {formattedMinutes} : {formattedSeconds}
        </span>
      );
    }
  };

  const getRemainingTime = (): number => {
    const endDateTime = new Date(examGeneralInfo.end_date);
    const startExamTime = new Date(examMember.start_date ?? "");

    const timeDifference = endDateTime.getTime() - startExamTime.getTime();

    const endExamTime = new Date(
      startExamTime.getTime() +
        Math.min(timeDifference, examGeneralInfo.duration * 60000)
    );

    const endExamTimeString = endExamTime.toISOString();

    return new Date(endExamTimeString).getTime();
  };

  const handleTimeEnded = async () => {
    // build payload
    const httpMethod: string = "PUT";
    const httpPayload: ExamMemberStatuUpdateType = {
      id_exam_member: examMember?.id_exam_member,
      status: "COMPLETED",
    };

    // HTTP
    setShowLoading(true);
    const res = await HttpUpdateExamMemberStatus(
      "api/exam/member/status",
      httpMethod,
      httpPayload
    );
    setShowLoading(false);

    // response
    if (res.status == true) {
      onEnded();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="w-full px-4 py-2 text-center text-budiluhur-700 bg-budiluhur-500 rounded border border-budiluhur-700">
      {examMember.status == "COMPLETED" ||
      checkExamEndDate() ||
      examGeneralInfo === undefined ||
      examMember === undefined ? (
        <span>__ : __ : __</span>
      ) : (
        <Countdown date={getRemainingTime()} renderer={rendererCountdown} />
      )}

      <LoadingComponent
        showLoading={showLoading}
        message={`Time is over <br/> <span>please wait a moment</span>`}
      />
    </div>
  );
}
