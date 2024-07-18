// react
import { Fragment, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
// type
import { ExamQuestionType, ExamType } from "@/lib/types/ResultTypes";
// helpers
import { createExcerpt } from "@/lib/helpers/helpers";
// components
import ExamQuestionForm from "./ExamQuestionForm";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  apiPath: string;
  dtGeneralInfo: ExamType | undefined;
  dtQuestion: ExamQuestionType;
  no: number;
  refetchData: () => void;
  onDelete: (dtQuestion: ExamQuestionType) => void;
};

export default function ExamQuestionRow({
  apiPath,
  dtGeneralInfo,
  dtQuestion,
  no,
  refetchData,
  onDelete,
}: Props) {
  // -- Use State --
  const [showForm, setShowForm] = useState<boolean>(false);

  // -- Use Effect --

  // -- function --

  return (
    <Fragment>
      <tr className="border-b border-budiluhur-700 bg-budiluhur-300">
        <td className="px-6 py-4 align-top">{no}</td>
        <td className="px-6 py-4 align-top">
          {createExcerpt(dtQuestion.question, 200)}
        </td>
        <td className="px-6 py-4 flex gap-2 justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
          >
            <Icon icon="ep:edit" />
          </button>
          <button
            onClick={() => onDelete(dtQuestion)}
            className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
          >
            <Icon icon="hugeicons:delete-01" />
          </button>
        </td>
      </tr>

      <tr className="border-b border-budiluhur-700 bg-budiluhur-300">
        <td colSpan={4}>
          <ExamQuestionForm
            dtQuestion={dtQuestion}
            dtGeneralInfo={dtGeneralInfo}
            showForm={showForm}
            apiPath={apiPath}
            onCancle={() => setShowForm(false)}
            afterSubmit={() => refetchData()}
          />
        </td>
      </tr>
    </Fragment>
  );
}
