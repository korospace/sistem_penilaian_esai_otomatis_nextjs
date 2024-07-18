// react
import { useEffect, useRef, useState } from "react";
// types
import { TrainingDetailType } from "@/lib/types/ResultTypes";
import { LevInputType } from "@/lib/types/InputTypes";
// components
import QAResultDetailRow from "./QAResultDetailRow";
import QAResultDetailLev from "./QAResultDetailLev";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  dtTrainingDetail: TrainingDetailType[];
};

export default function QAResultDetail({ dtTrainingDetail }: Props) {
  // -- Use Ref --
  const outerDivRef = useRef<HTMLDivElement>(null);

  // -- Use State --
  const [outerWidth, setOuterWidth] = useState<number>(0);
  const [showDetailLev, setShowDetailLev] = useState<boolean>(false);
  const [levInput, setLevInput] = useState<LevInputType | undefined>();

  // -- Use Effect --
  useEffect(() => {
    // Mengakses lebar div terluar setelah komponen di-render
    if (outerDivRef.current) {
      if (outerWidth === 0) {
        const width = outerDivRef.current.offsetWidth;
        setOuterWidth(width);
      }
    }
  }, [outerDivRef, outerWidth]);

  return (
    <div className="overflow-x-auto shadow rounded-md" ref={outerDivRef}>
      {/* Table */}
      <table className="text-sm text-left text-budiluhur-700">
        {/* Head */}
        <thead className="uppercase bg-budiluhur-500">
          <tr className="border-b border-budiluhur-700">
            <th scope="col" className="px-6 py-3">
              NO
            </th>
            <th scope="col" className="px-6 py-3">
              Question
            </th>
            <th scope="col" className="px-6 py-3">
              Score
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Action
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {dtTrainingDetail.map((row: TrainingDetailType, index: number) => (
            <QAResultDetailRow
              key={index}
              no={index + 1}
              dtTrainingDetail={row}
              outerDivWidth={outerWidth}
              onChooseLev={(data) => {
                setShowDetailLev(true);
                setLevInput(data);
              }}
            />
          ))}
        </tbody>
      </table>

      {/* Modal box - Detail Lev */}
      <QAResultDetailLev
        showDetailLev={showDetailLev}
        levInput={levInput}
        onClose={() => setShowDetailLev(false)}
      />
    </div>
  );
}
