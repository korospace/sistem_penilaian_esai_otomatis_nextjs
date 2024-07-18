// react
import { Fragment, useEffect, useState } from "react";
// nextjs
import { useSession } from "next-auth/react";
import Link from "next/link";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next-nprogress-bar";
// type
import { ExamType, SessionType } from "@/lib/types/ResultTypes";
import { DateFormating, createExcerpt } from "@/lib/helpers/helpers";
// components
import ExamStatusComponent from "./ExamStatusComponent";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  dtExam: ExamType;
  no: number;
  onDelete: (dtExam: ExamType) => void;
};

export default function ExamRowTableComponent({ dtExam, no, onDelete }: Props) {
  // session
  const { data: session, status }: { data: any; status: string } = useSession();

  // router
  const router = useRouter();

  // -- Use State --
  const [showForm, setShowForm] = useState<boolean>(false);
  const [dataSession, setDataSession] = useState<SessionType>();

  // -- Use Effect --
  useEffect(() => {
    setDataSession(session);
  }, [session]);

  // -- function --
  const examIdUserMember = (): number | undefined => {
    if (dtExam && dtExam.exam_member && dtExam.exam_member.length > 0) {
      return dtExam.exam_member[0].id_user ?? undefined;
    }
  };
  const handleExtractDate = (date: string) => {
    return DateFormating.changeDateFormat(
      DateFormating.extractDateTime(date).date
    );
  };
  const handleExtractTime = (date: string) => {
    return DateFormating.extractDateTime(date).time;
  };

  return (
    <Fragment>
      <tr className="border-b border-budiluhur-700 bg-budiluhur-300 hover:bg-budiluhur-400">
        <td className="px-6 py-4 align-top">{no}</td>
        <td className="px-6 py-4 align-top">{dtExam.course.name}</td>
        <td className="px-6 py-4 align-top">{dtExam.title}</td>
        <td className="px-6 py-4 align-top">
          {createExcerpt(dtExam.description, 100)}
        </td>
        {dataSession?.user.id_user_role === 3 && (
          <td className="px-6 py-4 align-top">
            <ExamStatusComponent
              examGeneralInfo={dtExam}
              examMember={
                dtExam.exam_member ? dtExam.exam_member[0] : undefined
              }
            />
          </td>
        )}
        <td className="px-6 py-4 align-top min-w-64">
          <table>
            <tr>
              <td>
                <b>start</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{`${handleExtractDate(dtExam.start_date)} ${handleExtractTime(
                dtExam.start_date
              )}`}</td>
            </tr>
            <tr>
              <td>
                <b>end</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{`${handleExtractDate(dtExam.end_date)} ${handleExtractTime(
                dtExam.end_date
              )}`}</td>
            </tr>
            <tr>
              <td>
                <b>duration</b>
              </td>
              <td className="pl-1 pr-3">:</td>
              <td>{`${dtExam.duration} minutes`}</td>
            </tr>
          </table>
        </td>
        <td className="px-6 py-4 flex gap-2 justify-end">
          {dataSession?.user.id_user_role === 3 ? (
            <Link
              target="_blank"
              href={"/exam/" + dtExam.id_exam + "/" + examIdUserMember()}
              className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
            >
              <Icon icon="mdi:eye" />
            </Link>
          ) : (
            <>
              <button
                onClick={() =>
                  router.push("/dashboard/exam/update/" + dtExam.id_exam)
                }
                className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
              >
                <Icon icon="ep:edit" />
              </button>
              <button
                onClick={() => onDelete(dtExam)}
                className="inline-block items-center py-2 px-3 text-md font-medium focus:outline-none bg-budiluhur-700 rounded hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
              >
                <Icon icon="hugeicons:delete-01" />
              </button>
            </>
          )}
        </td>
      </tr>
    </Fragment>
  );
}
