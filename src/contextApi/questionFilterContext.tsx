"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { QuestionFilterStateInterface } from "@/common/interface";
import { JSX } from "react/jsx-runtime";

// Define context type
interface QuestionManagementFilterContextType {
  questionManagementFilters: QuestionFilterStateInterface;
  setQuestionManagementFilters: React.Dispatch<
    React.SetStateAction<QuestionFilterStateInterface>
  >;
}

export const QuestionFilterInitialState: QuestionFilterStateInterface = {
  classId: "",
  subjectId: "",
  difficultyLevel: "",
  searchQuestion: "",
  page: 1,
  limit: 10,
};

// Create context with correct type
export const QuestionManagementFilterContext =
  createContext<QuestionManagementFilterContextType | null>(null);

// Provider component
export const QuestionManagementFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [questionManagementFilters, setQuestionManagementFilters] = useState<QuestionFilterStateInterface>(
    QuestionFilterInitialState
  );

  const value = useMemo(
    () => ({ questionManagementFilters, setQuestionManagementFilters }),
    [questionManagementFilters]
  );

  return (
    <QuestionManagementFilterContext.Provider value={value}>
      {children}
    </QuestionManagementFilterContext.Provider>
  );
};

// Custom hook
export const useQuestionManagementFilterContext = (): QuestionManagementFilterContextType => {
  const context = useContext(QuestionManagementFilterContext);
  if (!context) {
    throw new Error(
      "useQuestionManagementFilterContext must be used within a QuestionManagementFilterProvider"
    );
  }
  return context;
};
