"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, MoreHorizontal, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useSession } from "next-auth/react"
import { fetchQuestions, fetchSubjects } from "@/utils/helper"
import { QuestionInterface } from "@/common/interface"
// import { useToast } from "@/components/ui/use-toast"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  subject: string
  class: string
  difficulty: string
}

export default function ManageQuestionsPage() {
//   const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [editedQuestion, setEditedQuestion] = useState<string>("")
  const [editedOptions, setEditedOptions] = useState<string[]>(["", "", "", ""])
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState<string>("")
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
  const questions = useAppSelector((state)=>state.question.data)
  console.log(questions);
  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchQuestions(dispatch, session?.user?.accessToken,selectedClass,selectedSubject,selectedDifficulty,1,30);
    }
  }, [session?.user?.accessToken,dispatch]);
  // Sample data
  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

  const subjects: Record<string, string[]> = {
    "Class 6": ["Mathematics", "Science", "English", "Social Studies"],
    "Class 7": ["Mathematics", "Science", "English", "Social Studies", "Computer Science"],
    "Class 8": ["Mathematics", "Science", "English", "Social Studies", "Computer Science"],
    "Class 9": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"],
    "Class 10": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"],
    "Class 11": ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics"],
    "Class 12": ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics"],
  }

  const difficulties = ["Easy", "Medium", "Hard"]

  // const filteredQuestions = questions.filter((question) => {
  //   const matchesSearch = searchQuery ? question.question.toLowerCase().includes(searchQuery.toLowerCase()) : true
  //   const matchesClass = selectedClass ? question.class === selectedClass : true
  //   const matchesSubject = selectedSubject ? question.subject === selectedSubject : true
  //   const matchesDifficulty = selectedDifficulty ? question.difficulty === selectedDifficulty : true

  //   return matchesSearch && matchesClass && matchesSubject && matchesDifficulty
  // })

  const openEditDialog = (question: QuestionInterface) => {
    // setCurrentQuestion(question)
    // setEditedQuestion(question.question)
    // setEditedOptions([...question.options])
    // setEditedCorrectAnswer(question.correctAnswer)
    // setIsEditDialogOpen(true)
  }

  const handleEditQuestion = () => {
    // if (!currentQuestion) return

    // const updatedQuestions = questions.map((q) =>
    //   q.id === currentQuestion.id
    //     ? {
    //         ...q,
    //         question: editedQuestion,
    //         options: [...editedOptions],
    //         correctAnswer: editedCorrectAnswer,
    //       }
    //     : q,
    // )

    // setIsEditDialogOpen(false)

    // toast({
    //   title: "Success",
    //   description: "Question updated successfully",
    // })
  }

  const openDeleteDialog = (question: QuestionInterface) => {
    // setCurrentQuestion(question?.question)
    // setIsDeleteDialogOpen(true)
  }

  const handleDeleteQuestion = () => {
    // if (!currentQuestion) return

    // const updatedQuestions = questions.filter((q) => q.id !== currentQuestion.id)
    // setIsDeleteDialogOpen(false)

    // toast({
    //   title: "Success",
    //   description: "Question deleted successfully",
    // })
  }

  const handleEditOptionChange = (index: number, value: string) => {
    // const newOptions = [...editedOptions]
    // newOptions[index] = value
    // setEditedOptions(newOptions)
  }

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                // icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {selectedClass &&
                    subjects[selectedClass]?.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
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
                    <TableCell className="max-w-md truncate">{question?.question}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(question)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(question)}>
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
            <DialogDescription>Make changes to the question details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="edit-question">Question</Label>
              <Textarea
                id="edit-question"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Options</Label>
              {editedOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input value={option} onChange={(e) => handleEditOptionChange(index, e.target.value)} />
                </div>
              ))}
            </div>

            <div>
              <Label>Correct Answer</Label>
              <RadioGroup value={editedCorrectAnswer} onValueChange={setEditedCorrectAnswer}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {["A", "B", "C", "D"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`edit-option-${option}`} />
                      <Label htmlFor={`edit-option-${option}`}>Option {option}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
