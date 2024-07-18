"use client";

// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next-nprogress-bar";
import toast from "react-hot-toast";
// components
import ExamRowTableComponent from "@/lib/components/page/exam/ExamRowTableComponent";
import ExamFilterComponent from "@/lib/components/page/exam/ExamFilterComponent";
import BreadcrumbComponent from "@/lib/components/page/BreadcrumbsComponent";
import PaginationComponent from "@/lib/components/page/PaginationComponent";
import SearchbarComponent from "@/lib/components/page/SearchbarComponent";
import DialogComponent from "@/lib/components/page/DialogComponent";
import PageComponent from "@/lib/components/page/PageComponent";
// types
import { BreadcrumbItemType } from "@/lib/types/ComponentTypes";
import { ExamType, SessionType } from "@/lib/types/ResultTypes";
// services
import {
  HttpGetExam,
  HttpDeleteExam,
} from "@/lib/services/functions/frontend/examFunc";

export default function ExamPage() {
  // router
  const router = useRouter();

  // session
  const { data: session, status }: { data: any; status: string } = useSession();

  // -- Breadcrumbs List --
  const breadcrumItems: BreadcrumbItemType[] = [
    {
      title: "Home",
      icon: "ic:baseline-home",
      href: "/dashboard",
    },
    {
      title: "Exam",
      icon: "fe:arrow-right",
      href: "/dashboard/exam",
    },
  ];

  // -- Use State --
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [idCourse, setIdCourse] = useState<string>("");
  const [statusExam, setStatusExam] = useState<string>("");
  const [totalRow, setTotalRow] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(2);
  const [colspan, setColspan] = useState<number>(6);
  const [dataSession, setDataSession] = useState<SessionType>();
  const [examList, setExamList] = useState<ExamType[]>([]);
  const [examListLoading, setExamListLoading] = useState<boolean>(false);
  const [selectedExam, setSelectedExam] = useState<ExamType>();
  const [showDialogDelete, setShowDialogDelete] = useState<boolean>(false);
  const [dialogDeleteLoading, setDialogDeleteLoading] =
    useState<boolean>(false);
  const [dialogDeleteMessage, setDialogDeleteMessage] = useState<string>("");

  // -- Use Effect --
  useEffect(() => {
    setDataSession(session);
    if (session?.user.id_user_role === 3) {
      setColspan(7);
    }
  }, [session]);
  useEffect(() => {
    handleFetchExam();
  }, [page, keyword, idCourse, statusExam]);

  // -- functions --
  const handleFetchExam = async () => {
    setExamListLoading(true);
    const res = await HttpGetExam(
      `api/exam?id_course=${idCourse}&status=${statusExam}&keyword=${keyword}&page=${page}&limit=${limit}`
    );
    setExamListLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setExamList(res.data.data);
      setTotalRow(res.data.totalRow);
      setTotalPage(res.data.totalPage);
    }
  };

  const handleShowDialogDetele = (dtExam: ExamType) => {
    setSelectedExam(dtExam);
    setShowDialogDelete(true);
    setDialogDeleteMessage(`Are you sure to delete exam?`);
  };

  const handleDeleteExam = async () => {
    setDialogDeleteLoading(true);
    const res = await HttpDeleteExam(selectedExam?.id_exam || 0, "api/exam");
    setDialogDeleteLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      setShowDialogDelete(false);
      handleFetchExam();
    }
  };

  return (
    <PageComponent metaTitle="Exam">
      <main className="p-3">
        <BreadcrumbComponent breadcrumItems={breadcrumItems} />

        {/* Divider */}
        <div className="my-5">
          <Divider className="bg-budiluhur-700 opacity-50" />
        </div>

        {/* Filter && Search Bar */}
        <div className="flex gap-2">
          <ExamFilterComponent
            showStatusOpt={dataSession?.user.id_user_role === 3}
            courseOnChange={(opt) => setIdCourse(opt.key)}
            statusOnChange={(opt) => setStatusExam(opt.key)}
          />
          <SearchbarComponent
            className="flex-1"
            placeholder="Search exam title"
            showBtnAdd={[1, 2].includes(dataSession?.user.id_user_role ?? 0)}
            searchOnEnter={(keyword) => {
              setKeyword(keyword);
              setPage(1);
            }}
            btnOnClick={() => router.push("/dashboard/exam/create")}
          />
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto shadow rounded-md">
          <table className="w-full text-sm text-left text-budiluhur-700">
            {/* Head */}
            <thead className="uppercase bg-budiluhur-500">
              <tr className="border-b border-budiluhur-700">
                <th scope="col" className="px-6 py-3">
                  NO
                </th>
                <th scope="col" className="px-6 py-3">
                  Course
                </th>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                {dataSession?.user.id_user_role === 3 && (
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                )}
                <th scope="col" className="px-6 py-3">
                  Schedule Info
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {examListLoading ? (
                // Loading
                <tr
                  className={`border-b border-budiluhur-700 bg-budiluhur-300`}
                >
                  <td colSpan={colspan} className="px-6 py-4">
                    <div className="flex justify-center">
                      <Icon icon="eos-icons:loading" className={`text-2xl`} />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {examList.length === 0 ? (
                    <tr
                      className={`border-b border-budiluhur-700 bg-budiluhur-300`}
                    >
                      <td colSpan={colspan} className="px-6 py-4">
                        <div className="flex justify-center">
                          data not found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // List Exam
                    examList.map((row: ExamType, index: number) => (
                      <ExamRowTableComponent
                        key={index}
                        dtExam={row}
                        no={index + 1 + (page - 1) * limit}
                        onDelete={(dtExam) => handleShowDialogDetele(dtExam)}
                      />
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-5">
          <PaginationComponent
            page={page}
            totalRow={totalRow}
            totalPage={totalPage}
            prev={() => setPage(page - 1)}
            next={() => setPage(page + 1)}
          />
        </div>

        {/* Dialog - Delete */}
        <DialogComponent
          title="Delete Exam"
          showModal={showDialogDelete}
          message={dialogDeleteMessage}
          isLoading={dialogDeleteLoading}
          onSubmit={() => handleDeleteExam()}
          onCancle={() => setShowDialogDelete(false)}
        />
      </main>
    </PageComponent>
  );
}
