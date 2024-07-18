"use client";

// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// external lib
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
// components
import CourseRowTableComponent from "@/lib/components/page/course/CourseRowTableComponent";
import CourseFormComponent from "@/lib/components/page/course/CourseFormComponent";
import BreadcrumbComponent from "@/lib/components/page/BreadcrumbsComponent";
import PaginationComponent from "@/lib/components/page/PaginationComponent";
import SearchbarComponent from "@/lib/components/page/SearchbarComponent";
import DialogComponent from "@/lib/components/page/DialogComponent";
import PageComponent from "@/lib/components/page/PageComponent";
// types
import { BreadcrumbItemType } from "@/lib/types/ComponentTypes";
import { CourseType } from "@/lib/types/ResultTypes";
// services
import {
  HttpDeleteCourse,
  HttpGetCourse,
} from "@/lib/services/functions/frontend/courseFunc";

export default function CoursePage() {
  // -- Breadcrumbs List --
  const breadcrumItems: BreadcrumbItemType[] = [
    {
      title: "Home",
      icon: "ic:baseline-home",
      href: "/dashboard",
    },
    {
      title: "Course",
      icon: "fe:arrow-right",
      href: "/dashboard/course",
    },
  ];

  // -- Use State --
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalRow, setTotalRow] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(2);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<CourseType[]>([]);
  const [courseListLoading, setCourseListLoading] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const [showDialogDelete, setShowDialogDelete] = useState<boolean>(false);
  const [dialogDeleteLoading, setDialogDeleteLoading] =
    useState<boolean>(false);
  const [dialogDeleteMessage, setDialogDeleteMessage] = useState<string>("");

  // -- use effect --
  useEffect(() => {
    handleFetchCourse();
  }, [page, keyword]);

  // -- functions --
  const handleFetchCourse = async () => {
    setCourseListLoading(true);
    const res = await HttpGetCourse(
      `api/course?keyword=${keyword}&page=${page}&limit=${limit}`
    );
    setCourseListLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setCourseList(res.data.data);
      setTotalRow(res.data.totalRow);
      setTotalPage(res.data.totalPage);
    }
  };

  const handleShowDialogDetele = (dtCourse: CourseType) => {
    setSelectedCourse(dtCourse);
    setShowDialogDelete(true);
    setDialogDeleteMessage(`Are you sure to delete ${dtCourse.name}?`);
  };

  const handleDeleteCourse = async () => {
    setDialogDeleteLoading(true);
    const res = await HttpDeleteCourse(
      selectedCourse?.id_course || 0,
      "api/course/delete"
    );
    setDialogDeleteLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      setShowDialogDelete(false);
      handleFetchCourse();
    }
  };

  return (
    <PageComponent metaTitle="Course">
      <main className="p-3">
        {/* Bread Crumbs */}
        <BreadcrumbComponent breadcrumItems={breadcrumItems} />

        {/* Divider */}
        <div className="my-5">
          <Divider className="bg-budiluhur-700 opacity-50" />
        </div>

        {/* Search Bar */}
        <SearchbarComponent
          placeholder="Search course name"
          showBtnAdd={true}
          searchOnEnter={(keyword) => {
            setKeyword(keyword);
            setPage(1);
          }}
          btnOnClick={() => setShowForm(true)}
        />

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
                  Course Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {/* Form Add New */}
              <tr className="border-b border-budiluhur-700 bg-budiluhur-300">
                <td colSpan={4}>
                  <CourseFormComponent
                    apiPath="api/course/create"
                    showForm={showForm}
                    onCancle={() => setShowForm(false)}
                    afterSubmit={() => handleFetchCourse()}
                  />
                </td>
              </tr>
              {courseListLoading ? (
                // Loading
                <tr
                  className={`border-b border-budiluhur-700 bg-budiluhur-300`}
                >
                  <td colSpan={4} className="px-6 py-4">
                    <div className="flex justify-center">
                      <Icon icon="eos-icons:loading" className={`text-2xl`} />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {courseList.length === 0 ? (
                    <tr
                      className={`border-b border-budiluhur-700 bg-budiluhur-300`}
                    >
                      <td colSpan={4} className="px-6 py-4">
                        <div className="flex justify-center">
                          data not found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // List User
                    courseList.map((row: CourseType, index: number) => (
                      <CourseRowTableComponent
                        key={index}
                        dtCourse={row}
                        no={index + 1 + (page - 1) * limit}
                        apiPath="api/admin"
                        refetchData={() => handleFetchCourse()}
                        onDelete={(dtUser) => handleShowDialogDetele(dtUser)}
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
          title="Delete Course"
          showModal={showDialogDelete}
          message={dialogDeleteMessage}
          isLoading={dialogDeleteLoading}
          onSubmit={() => handleDeleteCourse()}
          onCancle={() => setShowDialogDelete(false)}
        />
      </main>
    </PageComponent>
  );
}
