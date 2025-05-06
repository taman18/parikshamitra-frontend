import { ApiResponseSubjectInterface, SubjectInterface, SubjectState } from "@/common/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: SubjectState = {
  data: [],
  loading: false,
  error: null,
};

export const addSubject = createAsyncThunk(
  "subject-addSubject",
  async ({
    accessToken,
    body,
  }: {
    accessToken: string;
    body: SubjectInterface;
  }) => {
    console.log("BODY-------", body);
    console.log("access token-------", accessToken);

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

export const deleteSubject = createAsyncThunk(
  "deleteSubject",
  async ({
    accessToken,
    classId,
    subjectId,
  }: {
    accessToken: string;
    classId: string | undefined;
    subjectId: string | undefined;
  }) => {
    const deleteSubjectApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/delete-subject?classId=${classId}&&subjectId=${subjectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const deleteSubjectApiJsonResponse = await deleteSubjectApiResponse.json();
    return { deleteSubjectApiJsonResponse, deletedSubjectId: subjectId };
  }
);
export const editSubject = createAsyncThunk(
  "editSubject",
  async ({
    accessToken,
    classId,
    body,
  }: {
    accessToken: string;
    classId: string | undefined;
    body: { className: string; category: string };
  }) => {
    const editClassApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/class/edit-class?classId=${classId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    const editClassApiJsonResponse = await editClassApiResponse.json();
    console.log("editClassApiJsonResponse", editClassApiJsonResponse);
    return {
      editClassApiJsonResponse: editClassApiJsonResponse?.data,
      editClassId: classId,
    };
  }
);
export const getSubjects = createAsyncThunk(
  "getSubjects",
  async ({ accessToken }: { accessToken: string }) => {
    const getSubjectApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/get-subjects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const getSubjectApiJsonResponse = await getSubjectApiResponse.json();
    return getSubjectApiJsonResponse;
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
        state.data = [
          ...state?.data,
          {
            subjectId: action.payload.data._id,
            ...action.payload.data,
          },
        ];
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add subject.";
        state.loading = false;
      })

      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data?.filter(
          (sub) => action.payload.deletedSubjectId !== sub.subjectId
        );
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      })

      .addCase(getSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.loading = false;
        const transformedData: SubjectInterface[] = action?.payload?.data?.result?.map(
          (cls: ApiResponseSubjectInterface) => {
            const { _id, ...rest } = cls;
            return {
              subjectId: _id,
              ...rest,
            };
          }
        );
        state.data = transformedData;
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      });
  },
});

export default subjectSlice.reducer;
