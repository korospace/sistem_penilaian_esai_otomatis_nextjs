"use client";

// react
import { useEffect, useState } from "react";
// nextjs
import { useSession } from "next-auth/react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next-nprogress-bar";
import toast from "react-hot-toast";
// types
import { ExamMemberType, ExamType, SessionType } from "@/lib/types/ResultTypes";
// components
import ExamBarierComponent from "@/lib/components/page/exam/ExamBarierComponent";
import ExamQAComponent from "@/lib/components/page/exam/ExamQAComponent";
import PageComponent from "@/lib/components/page/PageComponent";
// services
import { HttpGetExam } from "@/lib/services/functions/frontend/examFunc";
import { HttpGetExamMember } from "@/lib/services/functions/frontend/examMemberFunc";
// helpers
import { DateFormating } from "@/lib/helpers/helpers";
import ExamStartComponent from "@/lib/components/page/exam/ExamStartComponent";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  params: {
    slug: string[];
  };
};

export default function ExamDetailPage({ params }: Props) {
  const id_exam = params.slug.length > 0 ? params.slug[0] : "";
  const id_user = params.slug.length > 1 ? params.slug[1] : "";

  // -- hook --
  const router = useRouter();
  const { data: session, status }: { data: any; status: string } = useSession();

  // -- Use State --
  const [dataSession, setDataSession] = useState<SessionType>();
  const [examGeneralInfo, setExamGeneralInfo] = useState<ExamType>();
  const [examMember, setExamMember] = useState<ExamMemberType>();
  const [examIsTaken, setExamIsTake] = useState<boolean | undefined>();

  // -- Use Effect --
  useEffect(() => {
    setDataSession(session);
  }, [session]);
  useEffect(() => {
    if (dataSession) {
      fetchExamGeneralInfo();
      fetchMember();
    }
  }, [dataSession]);
  useEffect(() => {
    if (dataSession && examGeneralInfo) {
      if (dataSession.user.id_user_role !== 3) {
        setExamIsTake(true);
      } else {
        if (checkExamEndDate(examGeneralInfo.end_date ?? "")) {
          setExamIsTake(true);
        } else if (examMember?.status == "NOT_YET") {
          setExamIsTake(false);
        } else {
          setExamIsTake(true);
        }
      }
    }
  }, [dataSession, examGeneralInfo, examMember]);

  // -- Functions --
  const fetchExamGeneralInfo = async () => {
    const res = await HttpGetExam("api/exam?id_exam=" + id_exam);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      if (res.data.data.length == 0) {
        router.push("/not-found");
      } else {
        setExamGeneralInfo(res.data.data[0]);
      }
    }
  };
  const fetchMember = async () => {
    const res = await HttpGetExamMember(
      `api/exam/member?id_exam=${id_exam}&id_user=${id_user}`
    );

    if (res.status == false) {
      toast.error(res.message);
    } else {
      if (res.data.data.length == 0) {
        router.push("/not-found");
      } else {
        setExamMember(res.data.data[0]);
      }
    }
  };

  const checkExamStartDate = (startDate: string): boolean => {
    const unixStart = DateFormating.toUnixTimeStamp(startDate);
    const unixNow = DateFormating.toUnixTimeStamp(new Date().toString());

    return unixStart > unixNow;
  };

  const checkExamEndDate = (endDate: string): boolean => {
    const unixEndDate = DateFormating.toUnixTimeStamp(endDate);
    const unixNow = DateFormating.toUnixTimeStamp(new Date().toString());

    return unixEndDate < unixNow;
  };

  return (
    <PageComponent metaTitle="Exam">
      <main className="h-screen max-h-screen flex justify-center items-center bg-budiluhur-300">
        {examGeneralInfo === undefined || examMember === undefined ? (
          <Icon icon="eos-icons:loading" className={`text-5xl`} />
        ) : (
          <>
            {checkExamStartDate(examGeneralInfo.start_date) ? (
              <ExamBarierComponent examGeneralInfo={examGeneralInfo} />
            ) : (
              <>
                {!examIsTaken || examIsTaken === undefined ? (
                  <ExamStartComponent
                    afterUpdate={async () => {
                      await fetchMember();
                      setExamIsTake(true);
                    }}
                    examGeneralInfo={examGeneralInfo}
                    examMember={examMember}
                  />
                ) : (
                  <ExamQAComponent
                    examGeneralInfo={examGeneralInfo}
                    examMember={examMember}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </PageComponent>
  );
}
