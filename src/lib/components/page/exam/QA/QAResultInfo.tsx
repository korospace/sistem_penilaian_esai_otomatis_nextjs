// helpers
import { DateFormating } from "@/lib/helpers/helpers";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  grade: string;
  score: number;
  wrong?: string;
  correct?: string;
  accuracy?: string;
  startDate?: string;
  endDate?: string;
};

export default function QAResultInfo({
  grade,
  score,
  wrong,
  correct,
  accuracy,
  startDate,
  endDate,
}: Props) {
  // -- Functions --
  const handleExtractDate = (date: string) => {
    if (date) {
      return DateFormating.changeDateFormat(
        DateFormating.extractDateTime(date).date
      );
    } else {
      return "_ _ _ _";
    }
  };
  const handleExtractTime = (date: string) => {
    if (date) {
      return DateFormating.extractDateTime(date).time;
    } else {
      return "_ _ _ _";
    }
  };
  const handleDuration = (startDate: string, endDate: string): string => {
    if (startDate && endDate) {
      const dtDuration = DateFormating.getDuration(
        new Date(startDate),
        new Date(endDate)
      );

      return `${dtDuration.hour} hour ${dtDuration.minute} minutes ${dtDuration.second} seconds`;
    } else {
      return "_ _ _ _ _ _ _ _";
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-9xl text-budiluhur-800">{grade}</h1>
      <table className="text-sm">
        <tbody>
          {" "}
          {/* Add tbody to wrap table rows */}
          <tr key="score">
            {" "}
            {/* Add key attribute to each tr element */}
            <td>
              <b>Score</b>
            </td>
            <td className="pl-1 pr-3">:</td>
            <td>{score ? parseFloat(score.toFixed(2)) : 0}</td>
          </tr>
          {wrong && (
            <tr key="wrong">
              <td>
                <b>Wrong</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{wrong} answer</td>
            </tr>
          )}
          {correct && (
            <tr key="correct">
              <td>
                <b>Correct</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{correct} answer</td>
            </tr>
          )}
          {accuracy && (
            <tr key="accuracy">
              <td>
                <b>Accuracy</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{accuracy}%</td>
            </tr>
          )}
          {startDate !== undefined && (
            <tr key="startDate">
              <td>
                <b>Start</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{`${handleExtractDate(startDate)} ${handleExtractTime(
                startDate
              )}`}</td>
            </tr>
          )}
          {endDate !== undefined && (
            <tr key="endDate">
              <td>
                <b>End</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{`${handleExtractDate(endDate)} ${handleExtractTime(
                endDate
              )}`}</td>
            </tr>
          )}
          {startDate !== undefined && endDate != undefined && (
            <tr key="duration">
              <td>
                <b>Duration</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{handleDuration(startDate, endDate)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
