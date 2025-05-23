import {
  ApiResponseSubjectInterface,
  SubjectInterface,
  SubjectState,
} from "@/common/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: SubjectState = {
  data: [],
  totalSubjects:0,
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
    const addSubjectApiJsonResponse = await addSubjectApiResponse.json();
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
    subjectId,
    body,
  }: {
    accessToken: string;
    subjectId: string | undefined;
    body: SubjectInterface;
  }) => {
    const editSubjectApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/edit-subject?subjectId=${subjectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    const editSubjectApiJsonResponse = await editSubjectApiResponse.json();
    return {
      editSubjectApiJsonResponse: editSubjectApiJsonResponse?.data,
      editSubjectId: subjectId,
    };
  }
);

// export const getSubjects = createAsyncThunk(
//   "getSubjects",
//   async ({ accessToken }: { accessToken: string }) => {
//     const getSubjectApiResponse = await fetch(
//       `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/get-subjects`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     const getSubjectApiJsonResponse = await getSubjectApiResponse.json();
//     return getSubjectApiJsonResponse;
//   }
// );

export const getSubjects = createAsyncThunk(
  "getSubjects",
  async({accessToken,classId,limit,page}:{accessToken:string,classId?:string,page?:number,limit?:number})=>{
    const endUrl = new URLSearchParams();
    if(classId) endUrl.append("classId",classId)
    endUrl.append("page",String(page))
    endUrl.append("limit",String(limit))
    const filteredSubjectApiResponse = await fetch(`${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/subject/get-subjects?${endUrl}`,
      {
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          authorization : `Bearer ${accessToken}`
        },
      }
    )
    const filteredSubjectApiJsonResponse = await filteredSubjectApiResponse.json();
    return filteredSubjectApiJsonResponse
  }
)

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
        state.totalSubjects = state.totalSubjects + 1;
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
        state.totalSubjects = state.totalSubjects - 1;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      })

      .addCase(editSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editSubject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload.editSubjectApiJsonResponse;
        state.data = state.data.map((sub) => {
          if (action.payload.editSubjectId === sub.subjectId) {
            const { _id, ...rest } = updatedData;
            return {
              subjectId: _id,
              ...rest,
            };
          }
          return sub;
        });
      })
      .addCase(editSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      })

      // .addCase(getSubjects.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getSubjects.fulfilled, (state, action) => {
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
      //   state.totalSubjects = action.payload?.totalRecords;
      // })
      // .addCase(getSubjects.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || "Failed to delete class.";
      // })

      .addCase(getSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.loading = false;
        const transformedData: SubjectInterface[] =
          action?.payload?.data?.result?.map(
            (cls: ApiResponseSubjectInterface) => {
              const { _id, ...rest } = cls;
              return {
                subjectId: _id,
                ...rest,
              };
            }
          );
        state.data = transformedData;
        state.totalSubjects = action.payload?.data?.totalRecords
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      });
  },
});

export default subjectSlice.reducer;
