// SubjectInterface — describes a single subject
export interface SubjectInterface {
    classId: string;
    className?: string;
    subjectId?: string;
    subjectName: string;
    totalQuestionsByClassAndSubject?: string;
  }
  
  // SubjectState — Redux state structure
  export interface SubjectState {
    data: SubjectInterface;
    loading: boolean;
    error: string | null;
  }
  