// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// types
import { ExamMemberType, ExamType } from "@/lib/types/ResultTypes";
import { TabBarItemType } from "@/lib/types/ComponentTypes";
// helpers
import { DateFormating, getPathName } from "@/lib/helpers/helpers";
// components
import TabBarComponent from "../TabBarComponent";
import QAForm from "./QA/QAForm";
import QAResult from "./QA/QAResult";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  examGeneralInfo: ExamType;
  examMember: ExamMemberType;
};

export default function ExamQAComponent({
  examGeneralInfo,
  examMember,
}: Props) {
  // -- Tab Bar List --
  const [tabList, setTabList] = useState<TabBarItemType[]>([
    {
      key: "exam_question_answer",
      title: "Question",
      icon: "bi:question-circle",
      selected: true,
      disable: false,
    },
    {
      key: "exam_result",
      title: "Result",
      icon: "carbon:result",
      selected: false,
      disable: false,
    },
  ]);

  // -- use state --
  const [selectedTabKey, setSelectedTabKey] = useState<string>("");

  // -- Use Effect
  useEffect(() => {
    if (examMember) {
      if (
        examMember.status === "COMPLETED" ||
        checkExamEndDate(examGeneralInfo.end_date)
      ) {
        setSelectedTabKey("exam_result");
        tabList[0].selected = false;
        tabList[1].selected = true;
        tabList[1].disable = false;
        tabList[1].icon = "carbon:result";
        setTabList(tabList);
      } else {
        tabList[1].disable = true;
        tabList[1].icon = "teenyicons:lock-outline";
        setTabList(tabList);
      }
    }
  }, [examMember, examGeneralInfo]);

  // -- Function --
  const checkExamEndDate = (endDate: string): boolean => {
    const unixEndDate = DateFormating.toUnixTimeStamp(endDate);
    const unixNow = DateFormating.toUnixTimeStamp(new Date().toString());

    return unixEndDate < unixNow;
  };

  return (
    <div className="w-full h-full max-h-full p-5 flex flex-col">
      <div className="flex justify-between">
        {/* Title */}
        <div className="flex-1">
          <h1 className="text-3xl text-budiluhur-700 font-bold">
            {examGeneralInfo.title}
          </h1>
          <p className="w-full max-w-3xl text-md text-budiluhur-700 mt-2 font-light">
            {examGeneralInfo.description}
          </p>
        </div>

        {/* Student Name */}
        <div className="text-right">
          <h1 className="text-3xl text-budiluhur-700 font-bold">
            {examMember.user.full_name}
          </h1>
          <p className="text-lg text-budiluhur-700 mt-2">
            {examMember.user.username}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-2.5 mb-3">
        <Divider className="bg-budiluhur-700 opacity-50" />
      </div>

      <div className="flex-1 flex flex-col p-5 bg-budiluhur-500 rounded-md shadow border border-budiluhur-700 overflow-hidden">
        {/* Tab Bar */}
        <TabBarComponent
          tabList={tabList}
          onSelect={(tabKey) => {
            setSelectedTabKey(tabKey);
          }}
        />

        {selectedTabKey === "exam_question_answer" && (
          <div className="flex-1 p-4 bg-budiluhur-400 shadow rounded-b-md border border-budiluhur-700 overflow-hidden">
            <QAForm
              examGeneralInfo={examGeneralInfo}
              examMember={examMember}
              onEnded={() => {
                window.location.reload();
              }}
            />
          </div>
        )}
        {selectedTabKey === "exam_result" && (
          <div className="flex-1 p-4 bg-budiluhur-400 shadow rounded-b-md border border-budiluhur-700 overflow-hidden">
            <QAResult
              examGeneralInfo={examGeneralInfo}
              examMember={examMember}
            />
          </div>
        )}
      </div>
    </div>
  );
}
