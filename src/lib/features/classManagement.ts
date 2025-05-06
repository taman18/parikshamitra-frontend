import {
  ApiResponseClassInterface,
  ClassInterface,
  ClassState,
} from "@/common/interface";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ClassState = {
  data: [],
  loading: false,
  error: null,
};
export const addClass = createAsyncThunk(
  "addClass",
  async ({
    accessToken,
    body,
  }: {
    accessToken: string;
    body: ClassInterface;
  }) => {
    const addClassApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/class/add-class`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    const addClassApiJsonResponse = await addClassApiResponse.json();
    return addClassApiJsonResponse;
  }
);
export const deleteClass = createAsyncThunk(
  "deleteClass",
  async ({
    accessToken,
    classId,
  }: {
    accessToken: string;
    classId: string | undefined;
  }) => {
    const deleteClassApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/class/delete-class?classId=${classId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const deleteClassApiJsonResponse = await deleteClassApiResponse.json();
    return { deleteClassApiJsonResponse, deletedClassId: classId };
  }
);
export const editClass = createAsyncThunk(
  "editClass",
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
    console.log("editClassApiJsonResponse",editClassApiJsonResponse);
    return {
      editClassApiJsonResponse: editClassApiJsonResponse?.data,
      editClassId: classId,
    };
  }
);
export const getClasses = createAsyncThunk(
  "getClasses",
  async ({ accessToken }: { accessToken: string }) => {
    const getClassesApiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/class/get-classes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const getClassesApiJsonResponse = await getClassesApiResponse.json();
    return getClassesApiJsonResponse;
  }
);
export const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    updateReduxClassList(
      state,
      action: PayloadAction<ApiResponseClassInterface[]>
    ) {
        console.log("ABC",action.payload)
      const transformedData: ClassInterface[] = action.payload.map((cls) => {
        const { _id, ...rest } = cls;
        return { ...rest, classId: _id };
      });
      console.log("transformed data ",transformedData)
      state.data = transformedData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [
          ...state?.data,
          {
            classId: action.payload.data._id,
            ...action.payload.data,
          },
        ];
      })
      .addCase(addClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add class.";
      })

      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data?.filter(
          (cls) => action.payload.deletedClassId !== cls.classId
        );
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      })

      .addCase(editClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editClass.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload.editClassApiJsonResponse;
        console.log("updatedData",updatedData)
        state.data = state.data.map((cls) => {
          if (action.payload.editClassId === cls.classId) {
            const {_id,...rest} = updatedData;
            return {
              ...rest,
              classId: _id, // maintain consistency
            };
          }
          return cls;
        });
      })
      .addCase(editClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      })

      .addCase(getClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        const transformedData : ClassInterface[]= action?.payload?.data?.map((cls:ApiResponseClassInterface)=>{
            const {_id,...rest} = cls;
            return {
                classId:_id,
                ...rest,
            }
        })
        state.data = transformedData;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete class.";
      });
  },
});
export const { updateReduxClassList } = classSlice.actions;
export default classSlice.reducer;
