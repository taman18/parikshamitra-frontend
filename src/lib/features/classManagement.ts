import { ClassInterface, ClassState } from "@/common/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState : ClassState = {
    data:[],
      loading: false,
      error: null,
}
export const addClass = createAsyncThunk(
    'addClass',
    async({accessToken,body}:{accessToken:string,body:ClassInterface}) =>{
        const addClassApiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/class/add-class`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    authorization:`Bearer ${accessToken}`
                },
                body:JSON.stringify(body)
            }
        );
        const addClassApiJsonResponse = addClassApiResponse.json();
        return addClassApiJsonResponse;
    }
)
export const deleteClass = createAsyncThunk(
    'deleteClass',
    async({accessToken,classId}:{accessToken:string,classId:string}) =>{
        const deleteClassApiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/class/delete-class?${classId}`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    authorization:`Bearer ${accessToken}`
                },
            }
        );
        const deleteClassApiJsonResponse = deleteClassApiResponse.json();
        return deleteClassApiJsonResponse;
    }
)
export const classSlice = createSlice({
    name:'subject',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(addClass.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(addClass.fulfilled,(state,action)=>{
                state.loading=false;
                state.data = [
                    ...state.data,
                    {
                      classId: action.payload.data._id,
                      ...action.payload.data
                    }
                  ];
            })
            .addCase(addClass.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.error.message || "Failed to add class."
            })

            .addCase(deleteClass.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(deleteClass.fulfilled,(state,action)=>{
                state.loading=false;
                state.data = [
                    ...state.data,
                    {
                      classId: action.payload.data._id,
                      ...action.payload.data
                    }
                  ];
            })
            .addCase(deleteClass.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.error.message || "Failed to delete class."
            })
    }
})

export default classSlice.reducer