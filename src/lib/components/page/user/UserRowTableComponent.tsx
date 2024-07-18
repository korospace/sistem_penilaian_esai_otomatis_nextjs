// react
import { Fragment, useEffect, useRef, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
// type
import { UserType } from "@/lib/types/ResultTypes";
// components
import UserFormComponent from "./UserFormComponent";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  apiPath?: string;
  dtUser: UserType;
  no: number;
  refetchData: () => void;
  onDelete: (dtUser: UserType) => void;
};

export default function UserRowTableComponent({
  apiPath,
  dtUser,
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
        <td className="px-6 py-4 align-top">{dtUser.username}</td>
        <td className="px-6 py-4 align-top">{dtUser.full_name}</td>
        <td className="px-6 py-4 flex gap-2 justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
          >
            <Icon icon="ep:edit" />
          </button>
          <button
            onClick={() => onDelete(dtUser)}
            className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
          >
            <Icon icon="hugeicons:delete-01" />
          </button>
        </td>
      </tr>

      <tr className="border-b border-budiluhur-700 bg-budiluhur-300">
        <td colSpan={4}>
          <UserFormComponent
            dtUser={dtUser}
            showForm={showForm}
            apiPath={apiPath ?? ""}
            onCancle={() => setShowForm(false)}
            afterSubmit={() => refetchData()}
          />
        </td>
      </tr>
    </Fragment>
  );
}
