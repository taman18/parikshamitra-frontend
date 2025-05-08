"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Eye,
  MoreHorizontal,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserX,
} from "lucide-react";
// import { useToast } from "@/components/ui/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchUsers,
  updateUserStatus,
} from "@/lib/features/user/userManagement";
import { useSession } from "next-auth/react";
import { RootState } from "@/lib/store";
import { getTestsByUserId } from "@/lib/features/test/testManagement";
import { convertToDateFormat, convertToTimeFormat } from "@/lib/utils";
import { toast } from "react-toastify";

interface User {
  _id: string;
  userName: string;
  email: string;
  status: string;
  testTaken: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Test {
  _id: string;
  userId: string;
  testName: string;
  difficultyLevel: string;
  totalQuestions: number;
  subjectId: {
    _id: string;
    subjectName: string;
  };
  classId: {
    _id: string;
    className: string;
  };
  totalMarks: number;
  marksObtained: number;
  isCompleted: boolean;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date
  __v: number;
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState<boolean>(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const accessTokenSelector = useAppSelector(
    (state: RootState) => state.auth.accessToken
  );
  const blockUserIsLoading = useAppSelector(
    (state: RootState) => state.user.updateStatus.loading
  );
  const testDetails = useAppSelector((state: RootState) => state.test.getTestsByUserId);
  const { testsListing } = testDetails;
  const [users, setUsers] = useState<User[]>([]);
  const { data: session, status } = useSession();
  const finalAccessToken =
    accessTokenSelector ?? session?.user?.accessToken ?? "";
  const hasFetchedRef = useRef(false);
  const isFirstSearchRef = useRef(true);

  const getStatusButtonLabel = () => {
    const isActive = currentUser?.status === "active";

    if (blockUserIsLoading) {
      return isActive ? "Blocking..." : "Unblocking...";
    }

    return isActive ? "Block User" : "Unblock User";
  };

  const getUsers = async () => {
    try {
      const users = await dispatch(
        fetchUsers({
          search: searchQuery,
          accessToken: finalAccessToken ?? "",
        })
      ).unwrap();
      setUsers(users.response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const getTestsInfoByUserId = async (userId: string) => {
    try {
      await dispatch(
        getTestsByUserId({
          id: userId,
          accessToken: finalAccessToken ?? "",
        })
      ).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const viewUserDetails = (user: User) => {
    setCurrentUser(user);
    getTestsInfoByUserId(user._id);
    setIsUserDetailsOpen(true);
  };

  const openBlockDialog = (user: User) => {
    setCurrentUser(user);
    setIsBlockDialogOpen(true);
  };

  const handleToggleUserStatus = async () => {
    if (!currentUser?._id) {
      console.error("No user selected to toggle status.");
      return;
    }

    const accessToken = accessTokenSelector ?? session?.user?.accessToken;
    if (!accessToken) {
      console.error("Access token is missing.");
      return;
    }

    if (blockUserIsLoading) {
      console.error("Block user action is already in progress.");
      return;
    }

    try {
      await dispatch(
        updateUserStatus({
          id: currentUser._id,
          status: currentUser.status === "active" ? "inactive" : "active",
          accessToken,
        })
      ).unwrap();
      if (currentUser.status === "active") {
        toast.success("User blocked successfully");
      } else {
        toast.success("User unblocked successfully");
      }
      setIsBlockDialogOpen(false);
      await getUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  useEffect(() => {
    if (
      status === "authenticated" &&
      finalAccessToken &&
      !hasFetchedRef.current
    ) {
      hasFetchedRef.current = true;
      getUsers(); // initial call
    }
  }, [status, finalAccessToken]);

  useEffect(() => {
    if (isFirstSearchRef.current) {
      // Skip calling API on first render (empty search)
      isFirstSearchRef.current = false;
      return;
    }

    const debounceTimer = setTimeout(() => {
      getUsers(); // call with new searchQuery (including "")
    }, 400);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchQuery]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tests Taken</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user._id}</TableCell>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "outline" : "destructive"
                          }
                        >
                          {user.status === "active" ? (
                            <ShieldCheck className="h-3 w-3 mr-1" />
                          ) : (
                            <ShieldAlert className="h-3 w-3 mr-1" />
                          )}
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.testTaken}</TableCell>
                      <TableCell>{user.averageScore.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => viewUserDetails(user)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openBlockDialog(user)}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              {user.status === "active"
                                ? "Block User"
                                : "Unblock User"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {currentUser.userName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {currentUser.userName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
                <Badge
                  variant={
                    currentUser.status === "active" ? "outline" : "destructive"
                  }
                  className="ml-auto"
                >
                  {currentUser.status === "active" ? (
                    <ShieldCheck className="h-3 w-3 mr-1" />
                  ) : (
                    <ShieldAlert className="h-3 w-3 mr-1" />
                  )}
                  {currentUser.status.charAt(0).toUpperCase() +
                    currentUser.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Join Date
                  </p>
                  <p>{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tests Taken
                  </p>
                  <p>{currentUser.testTaken}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Score
                  </p>
                  <p>{currentUser.averageScore.toFixed(1)}%</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2 text-center">Recent Activity</h4>
                <div className=" max-h-[20vh] overflow-y-auto">
                  {testsListing.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No recent activity found.
                    </p>
                  ) : (
                    testsListing.map((test) => (
                      <div
                        key={test._id}
                        className="space-y-1 border-b pb-2 mb-2"
                      >
                        <p className="text-sm font-medium">
                          {test.isCompleted ? "Completed" : "Pending"}{" "}
                          <span className="font-semibold">{test.testName}</span>{" "}
                          on {convertToDateFormat(test.createdAt)} at{" "}
                          {convertToTimeFormat(test.createdAt)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Subject:{" "}
                          <span className="font-medium">
                            {test.subjectName}
                          </span>{" "}
                          | Class:{" "}
                          <span className="font-medium">{test.className}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Difficulty:{" "}
                          <span className="capitalize">
                            {test.difficultyLevel}
                          </span>{" "}
                          | Marks:{" "}
                          <span className="font-medium">
                            {test.marksObtained}/{test.totalMarks}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Questions: {test.totalQuestions} | Status:{" "}
                          <span
                            className={
                              test.isCompleted
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {test.isCompleted ? "Completed" : "Pending"}
                          </span>
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block/Unblock User Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentUser?.status === "active" ? "Block User" : "Unblock User"}
            </DialogTitle>
            <DialogDescription>
              {currentUser?.status === "active"
                ? "Are you sure you want to block this user? They will not be able to access the platform."
                : "Are you sure you want to unblock this user? They will regain access to the platform."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBlockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={
                currentUser?.status === "active" ? "destructive" : "default"
              }
              onClick={() => handleToggleUserStatus()}
            >
              {getStatusButtonLabel()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
