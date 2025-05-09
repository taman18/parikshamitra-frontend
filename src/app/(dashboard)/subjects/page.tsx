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
import { Edit, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubject,
  deleteSubject,
  editSubject,
  filterSubjects,
  getSubjects,
} from "@/lib/features/subjectManagement";
import { AppDispatch, RootState } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { SubjectInterface } from "@/common/interface";
import { fetchSubjects, filteredSubjects } from "@/utils/helper";
// import { useToast } from "@/components/ui/use-toast"

export default function SubjectsPage() {
  //   const { toast } = useToast()
  const subjectList = useAppSelector((state: RootState) => state.subject.data);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentSubject, setCurrentSubject] = useState<SubjectInterface | null>(
    null
  );
  const [selectedClassToFilter, setSelectedClassToFilter] =
    useState<string>("");

  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchSubjects(dispatch,session?.user?.accessToken);
    }
  }, [dispatch, session?.user?.accessToken]);

  useEffect(()=>{
    if (session?.user?.accessToken) {
      if(selectedClassToFilter){
        filteredSubjects(dispatch,session?.user?.accessToken,selectedClassToFilter,1,10);
      }
      else{
        fetchSubjects(dispatch,session?.user?.accessToken);
      }
    }
  },[selectedClassToFilter])
  const classes = useSelector((state: RootState) => state.class.data);
  const handleAddSubject = async () => {
    if (!selectedClass || !subjectName.trim()) {
      console.log("Subject and class not selected");
      return;
    }
    await dispatch(
      addSubject({
        accessToken: session?.user?.accessToken,
        body: { classId: selectedClass, subjectName: subjectName },
      })
    );
    setSubjectName("");
    setSelectedClass("");
  };

  const openEditDialog = (subject: SubjectInterface) => {
    setCurrentSubject(subject);
    setSelectedClass(subject?.classId);
    setSubjectName(subject?.subjectName);
    setIsEditDialogOpen(true);
  };

  const handleEditSubject = async () => {
    if (!currentSubject || !selectedClass || !subjectName.trim()) return;

    await dispatch(
      editSubject({
        accessToken: session?.user?.accessToken,
        subjectId: currentSubject?.subjectId,
        body: { classId: selectedClass, subjectName: subjectName },
      })
    );
    setIsEditDialogOpen(false);
    setCurrentSubject(null);
    setSubjectName("");

    // toast({
    //   title: "Success",
    //   description: "Subject updated successfully",
    // })
  };

  const openDeleteDialog = (subject: SubjectInterface) => {
    setSelectedClass(subject?.classId);
    setCurrentSubject(subject);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSubject = async () => {
    if (!currentSubject) return;

    await dispatch(
      deleteSubject({
        accessToken: session?.user?.accessToken,
        classId: currentSubject?.classId,
        subjectId: currentSubject?.subjectId,
      })
    );
    setIsDeleteDialogOpen(false);
    setCurrentSubject(null);
    setSelectedClass("");
    // toast({
    //   title: "Success",
    //   description: "Subject deleted successfully",
    // })
  };

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
                  <SelectItem key={cls?.classId} value={cls?.classId || ""}>
                    {cls?.className}
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
            <Select
              value={selectedClassToFilter || "all"}
              onValueChange={(val) =>
                setSelectedClassToFilter(val === "all" ? "" : val)
              }
            >
              <SelectTrigger className="w-full md:w-[200px]">
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
                {subjectList
                  .map((subject) => (
                    <TableRow key={subject?.subjectId}>
                      <TableCell>{subject?.subjectId}</TableCell>
                      <TableCell>{subject?.subjectName}</TableCell>
                      <TableCell>{subject?.className}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(subject)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(subject)}
                          >
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
            <DialogDescription>
              Make changes to the subject details below.
            </DialogDescription>
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
                    <SelectItem key={cls.classId} value={cls.classId || ""}>
                      {cls.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-subject">Subject Name</label>
              <Input
                id="edit-subject"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
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
              Are you sure you want to delete this subject? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
