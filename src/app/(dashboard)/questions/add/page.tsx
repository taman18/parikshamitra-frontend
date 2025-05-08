"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { RootState } from "@/lib/store"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useSession } from "next-auth/react"
import { fetchSubjects, filteredSubjects } from "@/utils/helper"
import { toast } from "react-toastify"
import { addQuestion } from "@/lib/features/questionManagement"
// import { useToast } from "@/components/ui/use-toast"

export default function AddQuestionsPage() {
//   const { toast } = useToast()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [question, setQuestion] = useState<string>("")
  const [options, setOptions] = useState<string[]>(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<string>("")
  const classes = useAppSelector((state: RootState) => state.class.data);
  const subjects = useAppSelector((state: RootState) => state.subject.data);
  const questionsList = useAppSelector((state: RootState) => state.question.data);
  console.log("QuestionList",questionsList)
  const difficulties = ["Easy", "Medium", "Hard"]
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  console.log("Classes",classes);
  console.log("Subjects",subjects);
  console.log("selectedSubject",selectedSubject)
    useEffect(()=>{
      if (session?.user?.accessToken) {
        if(selectedClass){
          filteredSubjects(dispatch,session?.user?.accessToken,selectedClass,1,10);
        }
      }
    },[selectedClass,dispatch, session?.user?.accessToken])
    
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }
  console.log("Question",question)
  console.log("options",options)
  console.log("correctAnswer",correctAnswer)

  const handleAddQuestion = async() => {
    // Validate form
    if (!selectedClass || !selectedSubject || !selectedDifficulty || !question.trim() || !correctAnswer) {
      console.log("Please enter all fields")
      return
    }

    // Check if all options are filled
    if (options.some((option) => !option.trim())) {
      console.log("Please write all options")
      return
    }

    await dispatch(addQuestion({accessToken:session?.user?.accessToken,body:{classId:selectedClass,subjectId:selectedSubject,difficultyLevel:selectedDifficulty,question:question,options:options,correctAnswer:correctAnswer}}))
    // Reset form
    setQuestion("")
    setOptions(["", "", "", ""])
    setCorrectAnswer("")
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Questions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="class">Class</Label>
                <Select
                  value={selectedClass}
                  onValueChange={(value) => {
                    setSelectedClass(value)
                    setSelectedSubject("")
                  }}
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls?.classId} value={cls?.classId||""}>
                        {cls?.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedClass &&
                      subjects?.map((subject) => (
                        <SelectItem key={subject?.subjectId} value={subject?.subjectId||""}>
                          {subject?.subjectName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter your question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div>
              <Label>Correct Answer</Label>
              <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String.fromCharCode(65 + index)} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>Option {String.fromCharCode(65 + index)}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleAddQuestion} className="w-full md:w-auto">
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
