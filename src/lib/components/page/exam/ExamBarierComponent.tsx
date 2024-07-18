// types
import { ExamType } from "@/lib/types/ResultTypes";
// helpers
import { DateFormating } from "@/lib/helpers/helpers";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  examGeneralInfo: ExamType;
};

export default function ExamBarierComponent({ examGeneralInfo }: Props) {
  return (
    <div className="flex flex-col">
      <span className="text-xl text-center text-budiluhur-700 font-extralight">
        The course will start at
      </span>
      <span className="text-4xl text-center text-budiluhur-700 font-semibold mt-4">
        {DateFormating.changeDateFormat(
          DateFormating.extractDateTime(examGeneralInfo.start_date).date
        )}{" "}
        {DateFormating.extractDateTime(examGeneralInfo.start_date).time}
      </span>
    </div>
  );
}
