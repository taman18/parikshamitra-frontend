// SubjectInterface — describes a single subject
export interface SubjectInterface {
  classId: string;
  className?: string;
  subjectId?: string;
  subjectName: string;
  totalQuestionsByClassAndSubject?: number;
}

// SubjectState — Redux state structure
export interface SubjectState {
  data: SubjectInterface[];
  totalSubjects:number;
  loading: boolean;
  error: string | null;
}

export interface ApiResponseSubjectInterface extends ClassInterface {
  _id: string;
}

// ClassInterface — describes a single class
export interface ClassInterface {
  classId?: string;
  className: string;
  category: "" | "class" | "stream";
  totalSubjects?: number;
}

// ClassState — Redux state structure
export interface ClassState {
  data: ClassInterface[];
  loading: boolean;
  error: string | null;
}

export interface ApiResponseClassInterface extends ClassInterface {
  _id: string;
}

  // Test — describes a single test
  export interface Test {
    _id: string;
    testName: string;
    createdBy: string;
    totalQuestions: number;
    difficultyLevel: string;
    avgScore: number;
    createdAt: string;
    marksObtained: number;
    subjectName: string;
    totalMarks: number;
    updatedAt: string;
    className: string;
    isCompleted: boolean;
  }

// TestState — Redux state structure
export interface TestState {
  getTests: {
    testsListing: Test[];
    totalTests: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
  },
  getTestsByUserId: {
    testsListing: Test[];
    loading: boolean;
    error: string | null;
  }
}

export interface QuestionInterface {
  questionId?: string;
  subjectId: string;
  subjectName?: string;
  classId: string;
  className?: string;
  difficultyLevel: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  totalQuestionsByClassAndSubject?:number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionState {
  data: QuestionInterface[];
  totalQuestions:number;
  loading: boolean;
  error: string | null;
}

export interface ApiResponseQuestionInterface extends QuestionInterface{
    _id:string,
    subjectInfo:{
      _id:string,
      subjectName:string
    },
    classInfo:{
      _id:string,
      className:string
    }
}

export interface QuestionFilterStateInterface{
  classId:string,
  subjectId:string,
  difficultyLevel:string,
  searchQuestion:string,
  page:number,
  limit:number,
}