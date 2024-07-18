"use client";

// react
import { useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// components
import ExamGeneralInfo from "@/lib/components/page/exam/form/ExamGeneralInfo";
import BreadcrumbComponent from "@/lib/components/page/BreadcrumbsComponent";
import TabBarComponent from "@/lib/components/page/TabBarComponent";
import PageComponent from "@/lib/components/page/PageComponent";
// types
import { BreadcrumbItemType, TabBarItemType } from "@/lib/types/ComponentTypes";

export default function ExamCreatePage() {
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
    {
      title: "Create",
      icon: "fe:arrow-right",
      href: "/dashboard/exam/create",
    },
  ];

  // -- Tab Bar List --
  const tabList: TabBarItemType[] = [
    {
      key: "general_information",
      title: "General Information",
      selected: true,
      disable: false,
    },
    {
      key: "exam_question",
      title: "Exam Question",
      selected: false,
      disable: true,
    },
    {
      key: "exam_member",
      title: "Exam Member",
      selected: false,
      disable: true,
    },
  ];

  // -- Use State --
  const [selectedTabKey, setSelectedTabKey] = useState<string>("");

  return (
    <PageComponent metaTitle="Create Exam">
      <main className="p-3">
        <BreadcrumbComponent breadcrumItems={breadcrumItems} />

        {/* Divider */}
        <div className="my-5">
          <Divider className="bg-budiluhur-700 opacity-50" />
        </div>

        <div className="mb-5 p-5 bg-budiluhur-500 rounded-md shadow">
          <TabBarComponent
            tabList={tabList}
            onSelect={(tabKey) => {
              setSelectedTabKey(tabKey);
            }}
          />

          {/* General Information */}
          {selectedTabKey === "general_information" && (
            <div className={`p-4 bg-budiluhur-400 shadow rounded`}>
              <ExamGeneralInfo />
            </div>
          )}
        </div>
      </main>
    </PageComponent>
  );
}
