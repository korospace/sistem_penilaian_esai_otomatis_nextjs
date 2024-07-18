// react
import { useEffect, useState } from "react";
// external lib
import toast from "react-hot-toast";
// components
import SelectOptionComponent from "../SelectOptionComponent";
// types
import { SelectOptionType } from "@/lib/types/ComponentTypes";
// services
import {
  GetExamCourseOpt,
  GetExamStatuOpt,
} from "@/lib/services/functions/frontend/examFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  showStatusOpt?: boolean;
  courseOnChange: (opt: SelectOptionType) => void;
  statusOnChange: (opt: SelectOptionType) => void;
};

export default function ExamFilterComponent({
  showStatusOpt,
  courseOnChange,
  statusOnChange,
}: Props) {
  // -- Use State --
  const [statusOpt, setStatusOpt] = useState<SelectOptionType[]>([]);
  const [courseOpt, setCourseOpt] = useState<SelectOptionType[]>([]);

  // -- Use effect --
  useEffect(() => {
    handleFetchStatusOption();
    handleFetchCourseOption();
  }, []);

  // -- Functions --
  const handleFetchStatusOption = async () => {
    const res = GetExamStatuOpt();
    setStatusOpt(res);
  };
  const handleFetchCourseOption = async () => {
    const res = await GetExamCourseOpt();

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setCourseOpt(res.data);
    }
  };

  return (
    <div className="flex gap-2">
      <SelectOptionComponent
        dtOption={courseOpt}
        onChange={(opt) => {
          courseOnChange(opt);
        }}
      />
      {(showStatusOpt || showStatusOpt === undefined) && (
        <SelectOptionComponent
          dtOption={statusOpt}
          onChange={(opt) => {
            statusOnChange(opt);
          }}
        />
      )}
    </div>
  );
}
