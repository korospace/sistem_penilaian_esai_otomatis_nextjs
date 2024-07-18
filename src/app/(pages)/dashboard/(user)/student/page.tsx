"use client";

// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// external lib
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
// components
import UserRowTableComponent from "@/lib/components/page/user/UserRowTableComponent";
import PaginationComponent from "@/lib/components/page/PaginationComponent";
import BreadcrumbComponent from "@/lib/components/page/BreadcrumbsComponent";
import SearchbarComponent from "@/lib/components/page/SearchbarComponent";
import UserFormComponent from "@/lib/components/page/user/UserFormComponent";
import DialogComponent from "@/lib/components/page/DialogComponent";
import PageComponent from "@/lib/components/page/PageComponent";
// types
import { BreadcrumbItemType } from "@/lib/types/ComponentTypes";
import { UserType } from "@/lib/types/ResultTypes";
// services
import {
  HttpDeleteUser,
  HttpGetUser,
} from "@/lib/services/functions/frontend/userFunc";

export default function AdminPage() {
  // -- Breadcrumbs List --
  const breadcrumItems: BreadcrumbItemType[] = [
    {
      title: "Home",
      icon: "ic:baseline-home",
      href: "/dashboard",
    },
    {
      title: "User",
      icon: "fe:arrow-right",
      href: "",
    },
    {
      title: "Student",
      icon: "fe:arrow-right",
      href: "/dashboard/student",
    },
  ];

  // -- Use State --
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalRow, setTotalRow] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(2);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserType[]>([]);
  const [userListLoading, setUserListLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserType>();
  const [showDialogDelete, setShowDialogDelete] = useState<boolean>(false);
  const [dialogDeleteLoading, setDialogDeleteLoading] =
    useState<boolean>(false);
  const [dialogDeleteMessage, setDialogDeleteMessage] = useState<string>("");

  // -- use effect --
  useEffect(() => {
    handleFetchUser();
  }, [page, keyword]);

  // -- functions --
  const handleFetchUser = async () => {
    setUserListLoading(true);
    const res = await HttpGetUser(
      `api/student?keyword=${keyword}&page=${page}&limit=${limit}`
    );
    setUserListLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setUserList(res.data.data);
      setTotalRow(res.data.totalRow);
      setTotalPage(res.data.totalPage);
    }
  };

  const handleShowDialogDetele = (dtUser: UserType) => {
    setSelectedUser(dtUser);
    setShowDialogDelete(true);
    setDialogDeleteMessage(`Are you sure to delete ${dtUser.full_name}?`);
  };

  const handleDeleteUser = async () => {
    setDialogDeleteLoading(true);
    const res = await HttpDeleteUser(selectedUser?.id_user || 0, "api/student");
    setDialogDeleteLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      setShowDialogDelete(false);
      handleFetchUser();
    }
  };

  return (
    <PageComponent metaTitle="Student">
      <main className="p-3">
        {/* Bread Crumbs */}
        <BreadcrumbComponent breadcrumItems={breadcrumItems} />

        {/* Divider */}
        <div className="my-5">
          <Divider className="bg-budiluhur-700 opacity-50" />
        </div>

        {/* Search Bar */}
        <SearchbarComponent
          placeholder="Search student username / full name"
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
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Full Name
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
                  <UserFormComponent
                    apiPath="api/student"
                    showForm={showForm}
                    onCancle={() => setShowForm(false)}
                    afterSubmit={() => handleFetchUser()}
                  />
                </td>
              </tr>
              {userListLoading ? (
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
                  {userList.length === 0 ? (
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
                    userList.map((row: UserType, index: number) => (
                      <UserRowTableComponent
                        key={index}
                        dtUser={row}
                        no={index + 1 + (page - 1) * limit}
                        apiPath="api/student"
                        refetchData={() => handleFetchUser()}
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
          title="Delete Student"
          showModal={showDialogDelete}
          message={dialogDeleteMessage}
          isLoading={dialogDeleteLoading}
          onSubmit={() => handleDeleteUser()}
          onCancle={() => setShowDialogDelete(false)}
        />
      </main>
    </PageComponent>
  );
}
