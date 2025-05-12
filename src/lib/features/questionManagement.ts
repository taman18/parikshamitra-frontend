import {
  ApiResponseQuestionInterface,
  QuestionInterface,
  QuestionState,
} from "@/common/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: QuestionState = {
  data: [],
  totalQuestions:0,
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

  export const deleteQuestion = createAsyncThunk(
    "deleteQuestion",
    async ({
      accessToken,
      body,
    }: {
      accessToken: string;
      body:{
        questionId: string | undefined;
        subjectId: string | undefined;
      }
    }) => {
      const deleteQuestionpiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/question/delete-question`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body:JSON.stringify(body)
        },
      );
      const deleteQuestionApiJsonResponse = await deleteQuestionpiResponse.json();
      return { deleteQuestionApiJsonResponse, deletedQuestionId: body?.questionId };
    }
  );

  export const editQuestion = createAsyncThunk(
    "editQuestion",
    async ({
      accessToken,
      body,
    }: {
      accessToken: string;
      body: QuestionInterface;
    }) => {
      const editQuestionApiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/question/edit-question`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      const editQuestionApiJsonResponse = await editQuestionApiResponse.json();
      return {
        editQuestionApiJsonResponse: editQuestionApiJsonResponse?.data,
        editQuestionId: body?.questionId,
      };
    }
  );

export const getQuestions = createAsyncThunk(
  "getQuestions",
  async ({
    accessToken,
    classId,
    subjectId,
    searchQuestion,
    difficultyLevel,
    limit,
    page,
  }: {
    accessToken: string;
    classId?: string;
    subjectId?: string;
    searchQuestion?:string,
    difficultyLevel?: string;
    page: number;
    limit: number;
  }) => {
    const endUrl = new URLSearchParams();
    if (classId) endUrl.append("classId", classId);
    if (subjectId) endUrl.append("subjectId", subjectId);
    if (difficultyLevel) endUrl.append("difficultyLevel", difficultyLevel);
    if(searchQuestion) endUrl.append("searchQuestion", searchQuestion);
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
    console.log(getQuestionsApiJsonResponse)
    return getQuestionsApiJsonResponse;
  }
);

export const QuestionSlice = createSlice({
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
        state.totalQuestions = state.totalQuestions + 1;
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add subject.";
        state.loading = false;
      })

      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data?.filter(
          (que) => action.payload.deletedQuestionId !== que.questionId
        );
        state.totalQuestions = state.totalQuestions - 1;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete question.";
      })

      .addCase(editQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload?.editQuestionApiJsonResponse;
        state.data = state.data?.map((que) => {
          if (action.payload?.editQuestionId === que?.questionId) {
            const { _id, ...rest } = updatedData;
            return {
              questionId: _id,
              ...rest,
            };
          }
          return que;
        });
      })
      .addCase(editQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to Edit Question.";
      })

      .addCase(getQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.loading = false;
        const transformedData: QuestionInterface[] = action?.payload?.data?.result?.map(
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
        state.totalQuestions = action?.payload?.data?.totalRecords
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

export default QuestionSlice.reducer;
