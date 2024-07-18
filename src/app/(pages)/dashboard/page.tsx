"use client";

// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// components
import BreadcrumbComponent from "@/lib/components/page/BreadcrumbsComponent";
import QAResultDetail from "@/lib/components/page/exam/QA/QAResultDetail";
import QAResultInfo from "@/lib/components/page/exam/QA/QAResultInfo";
import PageComponent from "@/lib/components/page/PageComponent";
// types
import { BreadcrumbItemType } from "@/lib/types/ComponentTypes";
import { TrainingInputType } from "@/lib/types/InputTypes";
import { TrainingType } from "@/lib/types/ResultTypes";
// helpers
import { extractDataFromExcel, readFileAsBuffer } from "@/lib/helpers/helpers";
// services
import { HttpGetExamResultFromExcel } from "@/lib/services/functions/frontend/examResultFunc";

export default function DashboardPage() {
  // -- Breadcrumbs List --
  const breadcrumItems: BreadcrumbItemType[] = [
    {
      title: "Home",
      icon: "ic:baseline-home",
      href: "/dashboard",
    },
  ];

  // -- Use State --
  const [fileValue, setFileValue] =
    useState<React.ChangeEvent<HTMLInputElement> | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [trainingResult, setTrainingResult] = useState<TrainingType>();

  // -- Use Effect --
  useEffect(() => {
    if (fileValue) {
      handleSubmitFile();
    }
  }, [fileValue]);

  // -- Functions --
  const handleSubmitFile = async () => {
    if (
      !fileValue ||
      !fileValue.target.files ||
      fileValue.target.files.length === 0
    ) {
      return;
    }

    const dataBuffer = await readFileAsBuffer(fileValue.target.files[0]);
    const excelJson = (await extractDataFromExcel(
      dataBuffer
    )) as TrainingInputType[];

    setLoading(true);
    const res = await HttpGetExamResultFromExcel("api/exam/result", excelJson);
    setLoading(false);

    if (!res.status) {
      toast.error(res.message);
      setTrainingResult(undefined);
    } else {
      setTrainingResult(res.data);
    }

    fileValue.target.value = "";
    setFileValue(null);
  };

  return (
    <PageComponent metaTitle="Home">
      <main className="p-3">
        <BreadcrumbComponent breadcrumItems={breadcrumItems} />

        {/* Divider */}
        <div className="my-5">
          <Divider className="bg-budiluhur-700 opacity-50" />
        </div>

        <div className="p-6 bg-budiluhur-300 shadow rounded-md">
          <h1 className="font-extrabold text-3xl text-budiluhur-700">
            Selamat Datang
          </h1>
          <div className="my-3">
            <Divider className="bg-budiluhur-700 opacity-30" />
          </div>
          <p className="font-light text-lg text-budiluhur-700 text-justify">
            Selamat datang di aplikasi{" "}
            <b className="font-semibold">{process.env.NEXT_PUBLIC_APP_NAME}</b>.
            Aplikasi ini menggunakan framework{" "}
            <b className="underline font-semibold">Next.js</b> dalam
            pembuatannya, dengan penambahan algoritma{" "}
            <b className="underline font-semibold">Levenshtein distance</b> yang
            memberikan penilaian otomatis untuk jawaban esai siswa.
          </p>
        </div>

        <div className="mt-10 p-6 bg-budiluhur-300 shadow rounded-md">
          <h1 className="font-extrabold text-3xl text-budiluhur-700">
            Training Data
          </h1>
          <div className="my-3">
            <Divider className="bg-budiluhur-700 opacity-30" />
          </div>

          {/* upload file */}
          <input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFile = e.target.files && e.target.files[0];

              if (selectedFile && !selectedFile.name.endsWith(".xlsx")) {
                toast.error("only .xlsx allowed");
                e.target.value = "";
                setFileValue(null);
                return;
              }

              setFileValue(e);
            }}
            className={`w-full p-2.5 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border bg-budiluhur-400 border-budiluhur-600 text-budiluhur-700 cursor-pointer`}
          />

          {/* result */}
          {loading ? (
            <div className="flex flex-col items-center mt-5">
              <Icon icon="eos-icons:loading" className={`text-5xl`} />
              <span className="mt-2 text-sm text-budiluhur-800 text-center">
                Please wait a moment . . . <br /> the exam results are being
                processed
              </span>
            </div>
          ) : (
            <>
              {trainingResult && (
                <div className="w-full h-full max-h-full overflow-auto">
                  {/* divider */}
                  <div className="mt-5 mb-1">
                    <Divider className="bg-budiluhur-700 opacity-50" />
                  </div>

                  {/* info */}
                  <QAResultInfo
                    grade={trainingResult.grade.grade}
                    score={trainingResult.grade.score}
                    wrong={trainingResult.wrong?.toString()}
                    correct={trainingResult.correct?.toString()}
                    accuracy={Math.round(
                      trainingResult.accuracy || 0
                    ).toString()}
                  />

                  <div className="mt-5">
                    <QAResultDetail dtTrainingDetail={trainingResult.details} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </PageComponent>
  );
}
