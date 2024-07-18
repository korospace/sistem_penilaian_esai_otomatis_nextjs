// react
import { Fragment, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
// type
import { CourseType } from "@/lib/types/ResultTypes";
// components
import CourseFormComponent from "./CourseFormComponent";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  apiPath?: string;
  dtCourse: CourseType;
  no: number;
  refetchData: () => void;
  onDelete: (dtCourse: CourseType) => void;
};

export default function CourseRowTableComponent({
  dtCourse,
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
      <tr className="border-b border-budiluhur-700 bg-budiluhur-300 hover:bg-budiluhur-400">
        <td className="px-6 py-4 align-top">{no}</td>
        <td className="px-6 py-4 align-top">{dtCourse.name}</td>
        <td className="px-6 py-4 align-top">{dtCourse.description}</td>
        <td className="px-6 py-4 flex gap-2 justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
          >
            <Icon icon="ep:edit" />
          </button>
          <button
            onClick={() => onDelete(dtCourse)}
            className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
          >
            <Icon icon="hugeicons:delete-01" />
          </button>
        </td>
      </tr>

      <tr className="border-b border-budiluhur-700 bg-budiluhur-300">
        <td colSpan={4}>
          <CourseFormComponent
            dtCourse={dtCourse}
            showForm={showForm}
            apiPath={"api/course/update"}
            onCancle={() => setShowForm(false)}
            afterSubmit={() => refetchData()}
          />
        </td>
      </tr>
    </Fragment>
  );
}
