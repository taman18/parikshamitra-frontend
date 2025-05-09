import { getQuestions } from "@/lib/features/questionManagement";
import { filterSubjects, getSubjects } from "@/lib/features/subjectManagement";
import { AppDispatch } from "@/lib/store";

export const fetchSubjects = async (
  dispatch: AppDispatch,
  accessToken: string
) => {
  try {
    await dispatch(getSubjects({ accessToken: accessToken }));
  } catch (err) {
    console.error("Error fetching classes:", err);
  }
};

export const filteredSubjects = async (
    dispatch: AppDispatch,
    accessToken: string,
    classId:string,
    page:number,
    limit:number,
) => {
    try {
      await dispatch(
        filterSubjects({ accessToken: accessToken ,classId:classId,page:page,limit:limit})
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
    page:number,
    limit:number
  ) => {
    try {
      let difficulty="";
      if(difficultyLevel.toLowerCase().trim() === "easy" || "medium" || "hard"){
        difficulty = difficultyLevel
      }
      await dispatch(getQuestions({ accessToken ,classId,subjectId,difficultyLevel:difficulty,page,limit}));
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };
