// react
import { useEffect, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// types
import { LevInputType } from "@/lib/types/InputTypes";
import { LevType } from "@/lib/types/ResultTypes";
// components
import ModalComponent from "../../ModalComponent";
// services
import { HttpGetExamResultLevEachWord } from "@/lib/services/functions/frontend/examResultFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  showDetailLev: boolean;
  levInput: LevInputType | undefined;
  onClose: () => void;
};

export default function QAResultDetailLev({
  showDetailLev,
  levInput,
  onClose,
}: Props) {
  // -- Use State --
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [levResult, setLevResult] = useState<LevType>();

  // -- Use Effect --
  useEffect(() => {
    if (levInput !== undefined) {
      fetchDetailLev();
    }
  }, [levInput]);

  // -- Function --
  const fetchDetailLev = async () => {
    if (levInput !== undefined) {
      setLevResult(undefined);
      setIsLoading(true);
      const res = await HttpGetExamResultLevEachWord(
        `api/exam/result/lev`,
        levInput
      );
      setIsLoading(false);

      if (res.status == false) {
        toast.error(res.message);
      } else {
        setLevResult(res.data);
      }
    }
  };

  return (
    <ModalComponent
      title="Levenshtein Each Word"
      showModal={showDetailLev}
      onClose={onClose}
    >
      {isLoading || levResult === undefined ? (
        <div className="flex justify-center text-budiluhur-700">
          <Icon icon="eos-icons:loading" className={`text-4xl`} />
        </div>
      ) : (
        <div>
          {/* table */}
          <div className={`w-full overflow-x-auto`}>
            <table
              border={1}
              cellPadding="5"
              className="w-full border border-budiluhur-700/50"
            >
              <thead>
                <tr>
                  <th className="bg-budiluhur-200"></th>
                  {levResult.string2.split("").map((item, index) => (
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
                {levResult.string1.split("").map((akItem, rowIndex) => (
                  <tr key={rowIndex} className="bg-budiluhur-200">
                    <th className="min-w-max whitespace-nowrap overflow-hidden text-ellipsis border-r border-budiluhur-700/50">
                      {akItem}
                    </th>
                    {levResult.matriks[rowIndex].map((value, colIndex) => (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        className={`${
                          (colIndex + 1) % 2 === 1
                            ? "bg-budiluhur-100"
                            : "bg-budiluhur-200"
                        } text-center border-b border-budiluhur-700/50 cursor-pointer`}
                      >
                        {value.toFixed(2).replace(".", ",")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Count Detail */}
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <p className="mr-3">
                <Icon icon="pepicons-pop:equal" />
              </p>
              <p>matrix[max-1][max-1] / max sentence</p>
            </div>

            <div className="flex items-center mb-2">
              <p className="mr-3">
                <Icon icon="pepicons-pop:equal" />
              </p>
              <p>
                {levResult.distance} / {levResult.distanceLength}
              </p>
            </div>

            <div className="flex items-center mb-2">
              <p className="mr-3">
                <Icon icon="pepicons-pop:equal" />
              </p>
              {levResult.levValue.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </ModalComponent>
  );
}
