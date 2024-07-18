// react
import { useEffect, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// components
import PaginationComponent from "../../PaginationComponent";
import SearchbarComponent from "../../SearchbarComponent";
import DialogComponent from "../../DialogComponent";
import ExamQuestionForm from "./ExamQuestionForm";
import ExamQuestionRow from "./ExamQuestionRow";
// types
import { ExamQuestionType, ExamType } from "@/lib/types/ResultTypes";
// services
import {
  HttpDeleteExamQuestion,
  HttpGetExamQuestion,
} from "@/lib/services/functions/frontend/examQuestionFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  dtGeneralInfo: ExamType | undefined;
};

export default function ExamQuestion({ dtGeneralInfo }: Props) {
  // -- Use State --
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [keyword, setKeyword] = useState<string>("");
  const [totalRow, setTotalRow] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [questionList, setQuestionList] = useState<ExamQuestionType[]>([]);
  const [questionListLoading, setQuestionListLoading] =
    useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestionType>();
  const [showDialogDelete, setShowDialogDelete] = useState<boolean>(false);
  const [dialogDeleteLoading, setDialogDeleteLoading] =
    useState<boolean>(false);
  const [dialogDeleteMessage, setDialogDeleteMessage] = useState<string>("");

  // -- use effect --
  useEffect(() => {
    if (dtGeneralInfo) {
      handleFetchQuestion();
    }
  }, [page, keyword, dtGeneralInfo]);

  // -- functions --
  const handleFetchQuestion = async () => {
    setQuestionListLoading(true);
    const res = await HttpGetExamQuestion(
      `api/exam/question?id_exam=${dtGeneralInfo?.id_exam}&keyword=${keyword}&page=${page}&limit=${limit}`
    );
    setQuestionListLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setQuestionList(res.data.data);
      setTotalRow(res.data.totalRow);
      setTotalPage(res.data.totalPage);
    }
  };

  const handleShowDialogDetele = (dtQuestion: ExamQuestionType) => {
    setSelectedQuestion(dtQuestion);
    setShowDialogDelete(true);
    setDialogDeleteMessage(`Are you sure to delete question?`);
  };

  const handleDeleteQuestion = async () => {
    setDialogDeleteLoading(true);
    const res = await HttpDeleteExamQuestion(
      selectedQuestion?.id_exam_question || 0,
      "api/exam/question/delete"
    );
    setDialogDeleteLoading(false);

    if (res.status == false) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      setShowDialogDelete(false);
      handleFetchQuestion();
    }
  };

  return (
    <>
      {/* Search Bar */}
      <SearchbarComponent
        placeholder="Search question"
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
                Question
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
                <ExamQuestionForm
                  apiPath="api/exam/question"
                  dtGeneralInfo={dtGeneralInfo}
                  showForm={showForm}
                  onCancle={() => setShowForm(false)}
                  afterSubmit={() => handleFetchQuestion()}
                />
              </td>
            </tr>

            {questionListLoading ? (
              // Loading
              <tr className={`border-b border-budiluhur-700 bg-budiluhur-300`}>
                <td colSpan={3} className="px-6 py-4">
                  <div className="flex justify-center">
                    <Icon icon="eos-icons:loading" className={`text-2xl`} />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {questionList.length === 0 ? (
                  <tr
                    className={`border-b border-budiluhur-700 bg-budiluhur-300`}
                  >
                    <td colSpan={3} className="px-6 py-4">
                      <div className="flex justify-center">data not found</div>
                    </td>
                  </tr>
                ) : (
                  // List Exam
                  questionList.map((row: ExamQuestionType, index: number) => (
                    <ExamQuestionRow
                      key={index}
                      apiPath="api/exam/question"
                      dtGeneralInfo={dtGeneralInfo}
                      dtQuestion={row}
                      no={index + 1 + (page - 1) * limit}
                      refetchData={() => handleFetchQuestion()}
                      onDelete={(dtQuestion) =>
                        handleShowDialogDetele(dtQuestion)
                      }
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
        title="Delete Question"
        showModal={showDialogDelete}
        message={dialogDeleteMessage}
        isLoading={dialogDeleteLoading}
        onSubmit={() => handleDeleteQuestion()}
        onCancle={() => setShowDialogDelete(false)}
      />
    </>
  );
}
