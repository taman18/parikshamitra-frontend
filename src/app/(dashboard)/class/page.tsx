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
import { Edit, Trash2, Plus } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { addClass, deleteClass, editClass, getClasses, updateReduxClassList } from "@/lib/features/classManagement"
import { useSession } from "next-auth/react"
import { ClassInterface } from "@/common/interface"

export default function ClassesPage() {
    const session = useSession();
    const classList = useSelector((state:RootState)=>state?.class?.data)
  const dispatch = useDispatch<AppDispatch>()
  const [category, setCategory] = useState<"" | "class" | "stream">("")
  const [className, setClassName] = useState<string>("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [currentClass, setCurrentClass] = useState<ClassInterface | null>(null)
  const handleAddClass = async() => {
    if (!category || !className.trim()) {
      console.log("Class name or category missing")
      return
    }
    await dispatch(addClass({accessToken:session?.data?.user?.accessToken,body:{className:className,category:category}}));
    setClassName("")
    setCategory("")
  }

  const openEditDialog = (cls: ClassInterface) => {
    setCurrentClass(cls)
    setClassName(cls.className)
    setCategory(cls.category)
    setIsEditDialogOpen(true)
  }

  const handleEditClass = async() => {
    if (!currentClass || !category || !className.trim()) return
    await dispatch(editClass({accessToken:session?.data?.user?.accessToken,classId:currentClass.classId,body:{className:className,category:category}}))
    setIsEditDialogOpen(false)
    setCurrentClass(null)
    setClassName("")
    setCategory("")
  }

  const openDeleteDialog = (cls: ClassInterface) => {
    setCurrentClass(cls)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteClass = async() => {
    if (!currentClass) return
    await dispatch(deleteClass({accessToken:session?.data?.user?.accessToken,classId:currentClass.classId}))
    setIsDeleteDialogOpen(false)
    setCurrentClass(null)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Classes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={category} onValueChange={(val) => setCategory(val as "stream" | "class")}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="stream">Stream</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddClass}>
              <Plus className="h-4 w-4 mr-2" /> Add Class
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classList?.map((cls) => (
                  <TableRow key={cls.classId}>
                    <TableCell>{cls.classId}</TableCell>
                    <TableCell>{cls.className}</TableCell>
                    <TableCell className="capitalize">{cls.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(cls)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openDeleteDialog(cls)}>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update class name and category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-category">Category</label>
              <Select value={category} onValueChange={(val) => setCategory(val as "stream" | "class")}>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="stream">Stream</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-name">Class Name</label>
              <Input id="edit-name" value={className} onChange={(e) => setClassName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClass}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClass}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
