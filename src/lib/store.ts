import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userManagement'
import testReducer from './features/test/testManagement'
import authReducer from './features/auth/auth.slice'
import subjectReducer from './features/subjectManagement'
import classReducer from './features/classManagement'
import QuestionReducer from './features/questionManagement'
import dashboardReducer from './features/dashboard/dashboard.slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      test: testReducer,
      auth: authReducer,
      subject: subjectReducer,
      class:classReducer,
      question:QuestionReducer,
      dashboard: dashboardReducer
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']