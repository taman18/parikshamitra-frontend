"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, MoreHorizontal, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useSession } from "next-auth/react";
import {
  deletedQuestion,
  editedQuestion,
  fetchQuestions,
  fetchSubjects,
  filteredSubjects,
} from "@/utils/helper";
import { QuestionFilterStateInterface, QuestionInterface } from "@/common/interface";
import { QuestionFilterInitialState, QuestionManagementFilterProvider, useQuestionManagementFilterContext } from "@/contextApi/questionFilterContext";
// import { useToast } from "@/components/ui/use-toast"

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  subject: string;
  class: string;
  difficulty: string;
}
const currentQuestionInitialState = {
  questionId : '',
  subjectId : '',
  subjectName : '',
  classId : '',
  className : '',
  difficultyLevel : '',
  question : '',
  options : [],
  correctAnswer : '',
  totalQuestionsByClassAndSubject :  0,
  createdAt : '',
  updatedAt : '',
}

export default function ManageQuestionsPage() {
  //   const { toast } = useToast()
  const {questionManagementFilters,setQuestionManagementFilters} = useQuestionManagementFilterContext();
  const {
    classId,
  subjectId,
  difficultyLevel,
  searchQuestion,
  page,
  limit,
  } = questionManagementFilters;
  const [filterOptions,setFilterOptions] = useState<QuestionFilterStateInterface>(QuestionFilterInitialState);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionInterface|null>(null);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.question.data);
  const classes = useAppSelector((state) => state.class.data);
  const subjects = useAppSelector((state) => state.subject.data);
  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchQuestions(
        dispatch,
        session?.user?.accessToken,
        classId,
        subjectId,
        difficultyLevel,
        searchQuestion,
        1,
        30
      );
    }
  }, [
    session?.user?.accessToken,
    dispatch,
    classId,
        subjectId,
        difficultyLevel,
        searchQuestion,
  ]);
  useEffect(() => {
    if (session?.user?.accessToken) {
      filteredSubjects(
        dispatch,
        session?.user?.accessToken,
        classId,
        1,
        30
      );
    }
  }, [classId, session?.user?.accessToken, dispatch]);

  useEffect(()=>{
    setQuestionManagementFilters(filterOptions)
  },[filterOptions])
  const difficulties = ["Easy", "Medium", "Hard"];
  const openEditDialog = (question: QuestionInterface) => {
    setCurrentQuestion(question)
    setIsEditDialogOpen(true)
  };

  const handleEditQuestion = async() => {
    if (!currentQuestion) return
    await editedQuestion(dispatch,session?.user?.accessToken,currentQuestion)
    setIsEditDialogOpen(false)
  };

  const openDeleteDialog = (question: QuestionInterface) => {
    setCurrentQuestion(question)
    setIsDeleteDialogOpen(true)
  };

  const handleDeleteQuestion = async() => {
    if (!currentQuestion) return
    const body = {questionId:currentQuestion?.questionId,subjectId:currentQuestion?.subjectId}
    await deletedQuestion(dispatch,session?.user?.accessToken,body)
    setCurrentQuestion(null)
  };

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (filterOptions) {
      console.log("searchValue",searchValue)
      setFilterOptions({
        ...filterOptions,
        searchQuestion: searchValue,
      });
    }
  };
  const setSelectedClass = (selectedClass:string) => {
    const normalizedSelectedClass = selectedClass === "all" ? "" : selectedClass;
    if (filterOptions) {
      setFilterOptions({
        ...QuestionFilterInitialState,
        classId: normalizedSelectedClass,
        searchQuestion:filterOptions?.searchQuestion,
      });
    }
  };
  const setSelectedSubject = (selectedSubject:string) => {
    const normalizedSelectedSubject = selectedSubject === "all" ? "" : selectedSubject;
    if (filterOptions) {
      setFilterOptions({
        ...filterOptions,
        subjectId: normalizedSelectedSubject,
      });
    }
  };
  const setSelectedDifficulty = (difficultyLevel:string) => {
    const normalizedDifficultyLevel = difficultyLevel === "all" ? "" : difficultyLevel;
    if (filterOptions) {
      setFilterOptions({
        ...filterOptions,
        difficultyLevel: normalizedDifficultyLevel,
      });
    }
  };

  const setEditQuesiton = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const editedQuestion = e.target.value;
    if(!currentQuestion) return 
    setCurrentQuestion({
      ...currentQuestion,
      question: editedQuestion,
    });
  };
  const setEditCorrectAnswer = (value:string) => {
    const editedCorrectAnswer = value;
    if(!currentQuestion) return 
    setCurrentQuestion({
      ...currentQuestion,
      correctAnswer: editedCorrectAnswer,
    });
  };
  console.log("currentQuestion",currentQuestion);
  const setEditOptions = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedOptions = [...(currentQuestion?.options ?? [])];
    updatedOptions[index] = e.target.value;
    if(!currentQuestion) return 
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
    });
  };
  return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Manage Questions</h1>

        <Card>
          <CardHeader>
            <CardTitle>Filter Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search questions..."
                  value={filterOptions?.searchQuestion}
                  onChange={handleSearchQuery}
                  className="w-full"
                  // icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div>
                <Select value={classId} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls?.classId} value={cls?.classId || ""}>
                        {cls?.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={subjectId}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {classId &&
                      subjects?.map((subject) => (
                        <SelectItem
                          key={subject?.subjectId}
                          value={subject?.subjectId || ""}
                        >
                          {subject?.subjectName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={difficultyLevel}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="all">All Difficulties</SelectItem> */}
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions?.map((question) => (
                    <TableRow key={question?.questionId}>
                      <TableCell>{question?.questionId}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {question?.question}
                      </TableCell>
                      <TableCell>{question?.subjectName}</TableCell>
                      <TableCell>{question?.className}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            question?.difficultyLevel === "Easy"
                              ? "outline"
                              : question?.difficultyLevel === "Medium"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {question?.difficultyLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(question)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(question)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Question Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
              <DialogDescription>
                Make changes to the question details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <Label htmlFor="edit-question">Question</Label>
                <Textarea
                  id="edit-question"
                  value={currentQuestion?.question}
                  onChange={setEditQuesiton}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
              <Label>Options</Label>
              {currentQuestion?.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={setEditOptions(index)}
                  />
                </div>
              ))}
            </div>

              <div>
                <Label>Correct Answer</Label>
                <RadioGroup
                  value={currentQuestion?.correctAnswer}
                  onValueChange={setEditCorrectAnswer}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {["A","B","C","D"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`edit-option-${option}`}
                        />
                        <Label htmlFor={`edit-option-${option}`}>
                          Option {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditQuestion}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Question Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Question</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this question? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteQuestion}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}
