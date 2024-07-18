// react
import { Fragment, useRef, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
// types
import { TrainingDetailType } from "@/lib/types/ResultTypes";
import { LevInputType } from "@/lib/types/InputTypes";
// components
import StrToBadges from "../../StrToBadges";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  no: number;
  dtTrainingDetail: TrainingDetailType;
  outerDivWidth: number;
  onChooseLev: (data: LevInputType) => void;
};

export default function QAResultDetailRow({
  no,
  dtTrainingDetail,
  outerDivWidth,
  onChooseLev,
}: Props) {
  // -- Use Ref --
  const dropdownRef = useRef<HTMLDivElement>(null);

  // -- Use State --
  const [showDetail, setShowDetail] = useState<boolean>(false);

  // -- Functions --
  const isMaxValueInRow = (
    MaxSimiliarity: number[],
    rowIndex: number,
    value: number
  ): boolean => {
    return MaxSimiliarity[rowIndex] === value;
  };

  const sumMaxSimiliarity = (values: number[]): number => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return parseFloat(sum.toFixed(2));
  };

  const sumSimiliarity = (values: number[]): number => {
    const totalMaxRowValue = values.reduce((acc, val) => acc + val, 0);

    const totalRows = values.length;

    const sum = 100 - (Number(totalMaxRowValue.toFixed(2)) / totalRows) * 100;

    return Number(sum.toFixed(0));
  };

  const handleChooseLev = (rowIndex: number, colIndex: number) => {
    const answer = dtTrainingDetail.answer.n_gram?.split(" | ");
    const answer_key = dtTrainingDetail.answer_key.n_gram?.split(" | ");

    if (answer && answer_key) {
      onChooseLev({
        string1: answer[colIndex],
        string2: answer_key[rowIndex],
      });
    }
  };

  return (
    <Fragment>
      <tr className="border-b border-budiluhur-700 bg-budiluhur-400">
        <td className="px-6 py-4 align-middle">{no}</td>
        <td className="px-6 py-4 align-middle">
          Question {""}
          {no}
        </td>
        <td className="px-6 py-4 align-middle">
          {dtTrainingDetail.grade.grade} {" / "}
          {Math.round(dtTrainingDetail.grade.score)}
        </td>
        <td className="px-6 py-4 flex gap-2 justify-end">
          {!showDetail ? (
            <button
              onClick={() => setShowDetail(true)}
              className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
            >
              <Icon icon="mdi:eye" />
            </button>
          ) : (
            <button
              onClick={() => setShowDetail(false)}
              className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
            >
              <Icon icon="mdi:eye-off" />
            </button>
          )}
        </td>
      </tr>

      <tr className={`${showDetail ? "bg-budiluhur-300" : ""} transition-all`}>
        <td colSpan={4}>
          <div
            ref={dropdownRef}
            className={`w-full ${
              showDetail
                ? "px-6 py-6 overflow-visible border-b border-budiluhur-700"
                : "h-0 px-0 py-0 overflow-hidden"
            } transition-all`}
          >
            {/* Score */}
            <h1 className="text-lg font-extralight">Score</h1>
            <div className="mt-1 mb-2">
              <Divider className="bg-budiluhur-700 opacity-50" />
            </div>
            <table className="text-sm">
              <tr>
                <td>
                  <b>Grade</b>
                </td>
                <td className="pl-1 pr-3">:</td>
                <td>{dtTrainingDetail.grade.grade}</td>
              </tr>
              <tr>
                <td>
                  <b>Score</b>
                </td>
                <td className="pl-1 pr-3">:</td>
                <td>
                  {dtTrainingDetail.grade.score
                    ? parseFloat(dtTrainingDetail.grade.score.toFixed(2))
                    : 0}
                </td>
              </tr>
            </table>

            {/* answer key */}
            <h1 className="mt-5 text-lg font-extralight">Answer Key </h1>
            <div className="mt-1 mb-2">
              <Divider className="bg-budiluhur-700 opacity-50" />
            </div>
            <table className="text-sm">
              <tr>
                <td className="align-top min-w-[170px]">
                  <b>Raw</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>{dtTrainingDetail.answer_key?.raw_value}</td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>Cleaned</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer_key?.cleaned ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>Stemmed</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer_key?.stemmed ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>Stopword Removed</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer_key?.stopword_removed ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>Synonym Replacement</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer_key.synonym_replaced ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>NGram</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer_key?.n_gram ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
            </table>

            {/* answer */}
            <h1 className="mt-5 text-lg font-extralight">Answer </h1>
            <div className="mt-1 mb-2">
              <Divider className="bg-budiluhur-700 opacity-50" />
            </div>
            <table className="text-sm">
              <tr>
                <td className="align-top min-w-[170px]">
                  <b>Raw</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>{dtTrainingDetail.answer.raw_value}</td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>Cleaned</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer.cleaned ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>Stemmed</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer.stemmed ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>Stopword Removed</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer.stopword_removed ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>Synonym Replacement</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer.synonym_replaced ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-top">
                  <b>NGram</b>
                </td>
                <td className="align-top pl-1 pr-3">:</td>
                <td>
                  <div className="max-w-full">
                    <StrToBadges
                      str={dtTrainingDetail.answer.n_gram ?? ""}
                      delimiter=" | "
                    />
                  </div>
                </td>
              </tr>
            </table>

            {/* Levenshtein Distance - Matrix Table */}
            <h1 className="mt-5 text-lg font-extralight">
              Levenshtein Distance - Matrix Table
            </h1>
            {dtTrainingDetail.answer.n_gram &&
              dtTrainingDetail.answer_key.n_gram && (
                <div
                  className={`overflow-x-auto`}
                  style={{ width: outerDivWidth - 45 + "px" }}
                >
                  <table
                    border={1}
                    cellPadding="5"
                    className="mt-2 border border-budiluhur-700/50"
                  >
                    <thead>
                      <tr>
                        <th className="bg-budiluhur-200"></th>
                        {dtTrainingDetail.answer.n_gram
                          .split(" | ")
                          .map((item, index) => (
                            <th
                              key={index}
                              className={`bg-budiluhur-200 min-w-max whitespace-nowrap overflow-hidden text-ellipsis border-b border-budiluhur-700/50`}
                            >
                              {item}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dtTrainingDetail.answer_key.n_gram
                        ?.split(" | ")
                        .map((akItem, rowIndex) => (
                          <tr key={rowIndex} className="bg-budiluhur-200">
                            <th className="min-w-max whitespace-nowrap overflow-hidden text-ellipsis border-r border-budiluhur-700/50">
                              {akItem}
                            </th>
                            {JSON.parse(dtTrainingDetail.similiarity_matrix)[
                              rowIndex
                            ].map((simValue: any, colIndex: any) => (
                              <>
                                {isMaxValueInRow(
                                  JSON.parse(dtTrainingDetail.max_simmatrix),
                                  rowIndex,
                                  simValue
                                ) ? (
                                  <td
                                    key={`${rowIndex} | ${colIndex}`}
                                    className={`bg-yellow-200 text-center border-b border-budiluhur-700/50 cursor-pointer`}
                                    onClick={() =>
                                      handleChooseLev(rowIndex, colIndex)
                                    }
                                  >
                                    {simValue ? simValue.toFixed(2) : 0}
                                  </td>
                                ) : (
                                  <td
                                    key={`${rowIndex} | ${colIndex}`}
                                    className={`${
                                      (colIndex + 1) % 2 == 1
                                        ? "bg-budiluhur-100"
                                        : "bg-budiluhur-200"
                                    } text-center border-b border-budiluhur-700/50 cursor-pointer`}
                                    onClick={() =>
                                      handleChooseLev(rowIndex, colIndex)
                                    }
                                  >
                                    {simValue.toFixed(2).replace(".", ",")}
                                  </td>
                                )}
                              </>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

            {/* Levenshtein Distance - Maximun Row Value */}
            <h1 className="mt-5 text-lg font-extralight">
              Levenshtein Distance - Maximun Row Value
            </h1>
            <table
              border={1}
              cellPadding="5"
              className="mt-2 border border-budiluhur-700/50"
            >
              {dtTrainingDetail.max_simmatrix && (
                <>
                  {JSON.parse(dtTrainingDetail.max_simmatrix).map(
                    (value: any, rowIndex: any) => (
                      <tr key={rowIndex}>
                        <td className="bg-budiluhur-200">row {rowIndex + 1}</td>
                        <td className="bg-budiluhur-100">
                          {parseFloat(value).toFixed(2)}
                        </td>
                      </tr>
                    )
                  )}
                </>
              )}
            </table>

            {/* Levenshtein Distance - Similiarity */}
            <h1 className="mt-5 text-lg font-extralight">
              Levenshtein Distance - Similiarity
            </h1>
            <div className="mt-1 mb-2">
              <Divider className="bg-budiluhur-700 opacity-50" />
            </div>
            <div className="">
              <div className="flex items-center mb-2">
                <p className="mr-3">
                  <Icon icon="pepicons-pop:equal" />
                </p>
                <p>100 - ((Total Maximal Row Value / Row Length) * 100)</p>
              </div>

              <div className="flex items-center mb-2">
                <p className="mr-3">
                  <Icon icon="pepicons-pop:equal" />
                </p>
                {dtTrainingDetail.max_simmatrix && (
                  <p>
                    100 - {"(("}
                    {sumMaxSimiliarity(
                      JSON.parse(dtTrainingDetail.max_simmatrix)
                    )}
                    {" / "}
                    {JSON.parse(dtTrainingDetail.max_simmatrix).length}
                    {") * 100 )"}
                  </p>
                )}
              </div>

              <div className="flex items-center mb-2">
                <p className="mr-3">
                  <Icon icon="pepicons-pop:equal" />
                </p>
                {dtTrainingDetail.max_simmatrix && (
                  <p>
                    {sumSimiliarity(JSON.parse(dtTrainingDetail.max_simmatrix))}{" "}
                    %
                  </p>
                )}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </Fragment>
  );
}
