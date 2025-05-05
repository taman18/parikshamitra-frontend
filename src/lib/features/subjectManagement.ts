import { SubjectInterface, SubjectState } from "@/common/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: SubjectState = {
  data: {
    classId: "",
    className: "",
    subjectId: "",
    subjectName: "",
    totalQuestionsByClassAndSubject: 0,
  },
  loading: false,
  error: null,
};

export const addSubject = createAsyncThunk(
  "subject-addSubject",
  async ({accessToken,body}:{accessToken:string,body:SubjectInterface}) => {
    console.log("BODY-------",body)
    const addSubjectApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/add-subject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    const addSubjectApiJsonResponse = addSubjectApiResponse.json();
    return addSubjectApiJsonResponse;
  }
);
export const subjectSlice = createSlice({
  name: "Subject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSubject.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add subject.";
        state.loading = false;
      });
  },
});

export default subjectSlice.reducer;
