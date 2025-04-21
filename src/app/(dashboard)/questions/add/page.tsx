"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"

export default function AddQuestionsPage() {
//   const { toast } = useToast()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [question, setQuestion] = useState<string>("")
  const [options, setOptions] = useState<string[]>(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<string>("")

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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddQuestion = () => {
    // Validate form
    if (!selectedClass || !selectedSubject || !selectedDifficulty || !question.trim() || !correctAnswer) {
    //   toast({
    //     title: "Error",
    //     description: "Please fill in all required fields",
    //     variant: "destructive",
    //   })
      return
    }

    // Check if all options are filled
    if (options.some((option) => !option.trim())) {
    //   toast({
    //     title: "Error",
    //     description: "Please fill in all options",
    //     variant: "destructive",
    //   })
      return
    }

    // In a real app, you would save the question to a database here
    // toast({
    //   title: "Success",
    //   description: "Question added successfully",
    // })

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
                      <SelectItem key={cls} value={cls}>
                        {cls}
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
                      subjects[selectedClass]?.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
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
