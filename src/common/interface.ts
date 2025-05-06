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
  loading: boolean;
  error: string | null;
}

export interface ApiResponseSubjectInterface extends SubjectState{
    _id:string;
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

export interface ApiResponseClassInterface extends ClassInterface{
    _id:string;
}