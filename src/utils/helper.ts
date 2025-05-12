import { QuestionInterface } from "@/common/interface";
import { deleteQuestion, editQuestion, getQuestions } from "@/lib/features/questionManagement";
import { filterSubjects, getSubjects } from "@/lib/features/subjectManagement";
import { AppDispatch } from "@/lib/store";

// export const fetchSubjects = async (
//   dispatch: AppDispatch,
//   accessToken: string
// ) => {
//   try {
//     await dispatch(getSubjects({ accessToken: accessToken }));
//   } catch (err) {
//     console.error("Error fetching classes:", err);
//   }
// };

export const filteredSubjects = async (
    dispatch: AppDispatch,
    accessToken: string,
    classId?:string,
    page?:number,
    limit?:number,
) => {
    try {
      await dispatch(
        getSubjects({ accessToken: accessToken ,classId:classId,page:page,limit:limit})
      );
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  export const fetchQuestions= async (
    dispatch: AppDispatch,
    accessToken: string,
    classId:string,
    subjectId:string,
    difficultyLevel:string,
    searchQuestion:string,
    page:number,
    limit:number
  ) => {
    try {
      let difficulty="";
      if(difficultyLevel.toLowerCase().trim() === "easy" || "medium" || "hard"){
        difficulty = difficultyLevel
      }
      await dispatch(getQuestions({ accessToken ,classId,subjectId,difficultyLevel:difficulty,searchQuestion,page,limit}));
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  export const deletedQuestion = async (
    dispatch: AppDispatch,
    accessToken: string,
    body:{
      questionId: string | undefined;
      subjectId: string | undefined;
    }
) => {
    try {
      await dispatch(
        deleteQuestion({ accessToken: accessToken ,body})
      );
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  export const editedQuestion = async (
    dispatch: AppDispatch,
    accessToken: string,
    body:QuestionInterface
) => {
    try {
      await dispatch(
        editQuestion({ accessToken ,body})
      );
    } catch (err) {
      console.error("Error editing question:", err);
    }
  };