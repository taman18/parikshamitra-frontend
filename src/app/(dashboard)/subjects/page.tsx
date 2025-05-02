"use client"

import { useState } from "react"
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
import { Edit, Trash2, Plus } from "lucide-react"
import { useDispatch } from "react-redux"
import { addSubject } from "@/lib/features/subject"
import { AppDispatch } from "@/lib/store"
// import { useToast } from "@/components/ui/use-toast"

interface Subject {
  id: number
  name: string
  class: string
}

export default function SubjectsPage() {
//   const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>();
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [subjectName, setSubjectName] = useState<string>("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null)

  // Sample data
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Mathematics", class: "Class 6" },
    { id: 2, name: "Science", class: "Class 6" },
    { id: 3, name: "English", class: "Class 7" },
    { id: 4, name: "Physics", class: "Class 9" },
    { id: 5, name: "Chemistry", class: "Class 9" },
    { id: 6, name: "Biology", class: "Class 10" },
    { id: 7, name: "History", class: "Class 8" },
  ])

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

  const handleAddSubject = async() => {
    if (!selectedClass || !subjectName.trim()) {
      console.log("Subject and class not selected")
      return
    }
    const addedSubject = await dispatch(addSubject({classId: "68120414eec29822db26ba8c", className: selectedClass, subjectName: subjectName}));
    console.log("addedSubject",addedSubject);
    const newSubject: Subject = {
      id: subjects.length + 1,
      name: subjectName,
      class: selectedClass,
    }

    setSubjects([...subjects, newSubject])
    setSubjectName("")

  }

  const openEditDialog = (subject: Subject) => {
    setCurrentSubject(subject)
    setSelectedClass(subject.class)
    setSubjectName(subject.name)
    setIsEditDialogOpen(true)
  }

  const handleEditSubject = () => {
    if (!currentSubject || !selectedClass || !subjectName.trim()) return

    const updatedSubjects = subjects.map((subject) =>
      subject.id === currentSubject.id ? { ...subject, name: subjectName, class: selectedClass } : subject,
    )

    setSubjects(updatedSubjects)
    setIsEditDialogOpen(false)
    setCurrentSubject(null)
    setSubjectName("")

    // toast({
    //   title: "Success",
    //   description: "Subject updated successfully",
    // })
  }

  const openDeleteDialog = (subject: Subject) => {
    setCurrentSubject(subject)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteSubject = () => {
    if (!currentSubject) return

    const updatedSubjects = subjects.filter((subject) => subject.id !== currentSubject.id)

    setSubjects(updatedSubjects)
    setIsDeleteDialogOpen(false)
    setCurrentSubject(null)

    // toast({
    //   title: "Success",
    //   description: "Subject deleted successfully",
    // })
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Subjects</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-[200px]">
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
            <Input
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddSubject}>
              <Plus className="h-4 w-4 mr-2" /> Add Subject
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedClass || "all"} onValueChange={(val) => setSelectedClass(val === "all" ? "" : val)}>
              <SelectTrigger className="w-full md:w-[200px]">
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects
                  .filter((subject) => !selectedClass || subject.class === selectedClass)
                  .map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>{subject.id}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.class}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(subject)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => openDeleteDialog(subject)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>Make changes to the subject details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-class">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="edit-class">
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
            <div className="space-y-2">
              <label htmlFor="edit-subject">Subject Name</label>
              <Input id="edit-subject" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subject</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subject? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
