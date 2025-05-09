import {
  ApiResponseQuestionInterface,
  QuestionInterface,
  QuestionState,
} from "@/common/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: QuestionState = {
  data: [],
  loading: false,
  error: null,
};

export const addQuestion = createAsyncThunk(
  "addQuestion",
  async ({
    accessToken,
    body,
  }: {
    accessToken: string;
    body: QuestionInterface;
  }) => {
    const addQuestionApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/question/add-question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    if (!addQuestionApiResponse.ok) {
      throw new Error("Failed to add question.");
    }
    const addQuestionApiJsonResponse = await addQuestionApiResponse.json();
    return addQuestionApiJsonResponse;
  }
);

//   export const deleteSubject = createAsyncThunk(
//     "deleteSubject",
//     async ({
//       accessToken,
//       classId,
//       subjectId,
//     }: {
//       accessToken: string;
//       classId: string | undefined;
//       subjectId: string | undefined;
//     }) => {
//       const deleteSubjectApiResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/delete-subject?classId=${classId}&&subjectId=${subjectId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       const deleteSubjectApiJsonResponse = await deleteSubjectApiResponse.json();
//       return { deleteSubjectApiJsonResponse, deletedSubjectId: subjectId };
//     }
//   );
//   export const editSubject = createAsyncThunk(
//     "editSubject",
//     async ({
//       accessToken,
//       subjectId,
//       body,
//     }: {
//       accessToken: string;
//       subjectId: string | undefined;
//       body: SubjectInterface;
//     }) => {
//       const editSubjectApiResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/edit-subject?subjectId=${subjectId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify(body),
//         }
//       );
//       const editSubjectApiJsonResponse = await editSubjectApiResponse.json();
//       return {
//         editSubjectApiJsonResponse: editSubjectApiJsonResponse?.data,
//         editSubjectId: subjectId,
//       };
//     }
//   );

export const getQuestions = createAsyncThunk(
  "getQuestions",
  async ({
    accessToken,
    classId,
    subjectId,
    difficultyLevel,
    limit,
    page,
  }: {
    accessToken: string;
    classId?: string;
    subjectId?: string;
    difficultyLevel?: string;
    page: number;
    limit: number;
  }) => {
    const endUrl = new URLSearchParams();
    if (classId) endUrl.append("classId", classId);
    if (subjectId) endUrl.append("subjectId", subjectId);
    if (difficultyLevel) endUrl.append("difficultyLevel", difficultyLevel);
    endUrl.append("page", String(page));
    endUrl.append("limit", String(limit));
    const getQuestionsApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/question/get-questions?${endUrl}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const getQuestionsApiJsonResponse = await getQuestionsApiResponse.json();
    return getQuestionsApiJsonResponse;
  }
);

//   export const filterSubjects = createAsyncThunk(
//     "filterSubjects",
//     async({accessToken,classId,limit,page}:{accessToken:string,classId:string,page:number,limit:number})=>{
//       const filteredSubjectApiResponse = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/filter-subject?classId=${classId}&&page=${page}&&limit=${limit}`,
//         {
//           method:"GET",
//           headers:{
//             "Content-Type":"application/json",
//             authorization : `Bearer ${accessToken}`
//           },
//         }
//       )
//       const filteredSubjectApiJsonResponse = await filteredSubjectApiResponse.json();
//       console.log(filteredSubjectApiJsonResponse);
//       return filteredSubjectApiJsonResponse
//     }
//   )

export const subjectSlice = createSlice({
  name: "Question",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addQuestion.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const { _id, ...rest } = action.payload.data;
        state.data = [
          ...state?.data,
          {
            questionId: _id,
            ...rest,
          },
        ];
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add subject.";
        state.loading = false;
      })

      // .addCase(deleteSubject.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(deleteSubject.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.data = state.data?.filter(
      //     (sub) => action.payload.deletedSubjectId !== sub.subjectId
      //   );
      // })
      // .addCase(deleteSubject.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || "Failed to delete class.";
      // })

      // .addCase(editSubject.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(editSubject.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const updatedData = action.payload.editSubjectApiJsonResponse;
      //   state.data = state.data.map((sub) => {
      //     if (action.payload.editSubjectId === sub.subjectId) {
      //       const { _id, ...rest } = updatedData;
      //       console.log("_id : ",_id,"....rest")
      //       return {
      //         subjectId: _id,
      //         ...rest,
      //       };
      //     }
      //     return sub;
      //   });
      // })
      // .addCase(editSubject.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || "Failed to delete class.";
      // })

      .addCase(getQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.loading = false;
        const transformedData: QuestionInterface[] = action?.payload?.data?.map(
          (que: ApiResponseQuestionInterface) => {
            const { _id,subjectInfo,classInfo,classId,subjectId, ...rest } = que;
            return {
              questionId: _id,
              subjectName: subjectInfo?.subjectName,
              className:classInfo?.className,
              classId:classInfo?._id,
              subjectId:subjectInfo?._id,
              ...rest,
            };
          }
        );
        state.data = transformedData;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      });

    // .addCase(filterSubjects.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(filterSubjects.fulfilled, (state, action) => {
    //   state.loading = false;
    //   const transformedData: SubjectInterface[] =
    //     action?.payload?.data?.result?.map(
    //       (cls: ApiResponseSubjectInterface) => {
    //         const { _id, ...rest } = cls;
    //         return {
    //           subjectId: _id,
    //           ...rest,
    //         };
    //       }
    //     );
    //   state.data = transformedData;
    // })
    // .addCase(filterSubjects.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message || "Failed to delete class.";
    // });
  },
});

export default subjectSlice.reducer;
