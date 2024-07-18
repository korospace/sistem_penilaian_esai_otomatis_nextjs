// services
import { DateFormating } from "@/lib/helpers/helpers";
import { GetExamStatuOpt } from "@/lib/services/functions/frontend/examFunc";
// types
import { ExamMemberType, ExamType } from "@/lib/types/ResultTypes";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  examGeneralInfo: ExamType | undefined;
  examMember: ExamMemberType | undefined;
};

export default function ExamStatusComponent({
  examGeneralInfo,
  examMember,
}: Props) {
  // -- Functions --
  const translateStatus = (status: string): string | undefined => {
    const opt = GetExamStatuOpt().find(
      (row) => row.key === status.toLowerCase()
    );

    if (opt?.key !== "completed") {
      const unixEndDate = DateFormating.toUnixTimeStamp(
        examGeneralInfo?.end_date || ""
      );
      const unixCurrent = DateFormating.getCurrentUnixTimestamp();
      if (unixCurrent > unixEndDate) {
        return "Expired";
      }
    }

    return opt?.value;
  };

  const tailwindStatusClass = (status: string) => {
    if (status !== "COMPLETED") {
      const unixEndDate = DateFormating.toUnixTimeStamp(
        examGeneralInfo?.end_date || ""
      );
      const unixCurrent = DateFormating.getCurrentUnixTimestamp();
      if (unixCurrent > unixEndDate) {
        return "bg-red-200 text-red-600 ring-red-600";
      }
    }

    if (status === "COMPLETED") {
      return "bg-green-200 text-green-600 ring-green-600";
    } else if (status === "ON_GOING") {
      return "bg-yellow-200 text-yellow-600 ring-yellow-600";
    } else if (status === "NOT_YET") {
      return "bg-slate-300 text-slate-500 ring-slate-400";
    }
  };

  return (
    <span
      className={`min-w-max inline-flex items-center rounded px-2 py-1 text-xs font-medium ring-1 ring-inset ${tailwindStatusClass(
        examMember ? examMember.status ?? "" : ""
      )}`}
    >
      {translateStatus(examMember ? examMember.status ?? "" : "")}
    </span>
  );
}
