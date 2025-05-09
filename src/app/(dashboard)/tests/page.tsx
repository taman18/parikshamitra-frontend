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
import { Eye, MoreHorizontal, Search, Share2, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { deleteTest, fetchUserTests } from "@/lib/features/test/testManagement";
import { useSession } from "next-auth/react";
import { RootState } from "@/lib/store";
import { toast } from "react-toastify";
import { Test } from "@/common/interface";
import { convertToDateFormat } from "@/lib/utils";

export default function TestsOverviewPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isTestDetailsOpen, setIsTestDetailsOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const dispatch = useAppDispatch();
  const hasFetchedRef = useRef(false);
  const accessTokenSelector = useAppSelector(
    (state: RootState) => state.auth.accessToken
  );
  const testDetails = useAppSelector((state: RootState) => state.test.getTests);
  const tests = testDetails.testsListing;
  const { data: session, status } = useSession();
  const isFirstSearchRef = useRef(true);

  const finalAccessToken =
    accessTokenSelector ?? session?.user?.accessToken ?? "";
    
  const fetchUserTestsDetails = async () => {
    try {
      await dispatch(
        fetchUserTests({
          accessToken: accessTokenSelector ?? session?.user?.accessToken ?? "",
          search: searchQuery.trim(),
        })
      ).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      status === "authenticated" &&
      finalAccessToken &&
      !hasFetchedRef.current
    ) {
      hasFetchedRef.current = true;
      fetchUserTestsDetails();
    }
  }, [finalAccessToken, status]);

  useEffect(() => {
    if (isFirstSearchRef.current) {
      // Skip calling API on first render (empty search)
      isFirstSearchRef.current = false;
      return;
    }
    const debounceTimer = setTimeout(() => {
      fetchUserTestsDetails();
    }, 400);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchQuery]);

  const viewTestDetails = (test: Test) => {
    setCurrentTest(test);
    setIsTestDetailsOpen(true);
  };

  const openDeleteDialog = (test: Test) => {
    setCurrentTest(test);
    setIsDeleteDialogOpen(true);
  };

  const openShareDialog = (test: Test) => {
    setCurrentTest(test);
    setIsShareDialogOpen(true);
  };

  const handleDeleteTest = async () => {
    if (!currentTest) return;
    try {
      const res = await dispatch(
        deleteTest({
          id: currentTest._id,
          accessToken: accessTokenSelector ?? session?.user?.accessToken ?? "",
        })
      ).unwrap();

      if (res.success) {
        toast.success("Test deleted successfully");
        fetchUserTestsDetails();
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete test");
      console.error(error);
    }
  };
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tests Overview</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests by ID, title, or creator..."
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
                  <TableHead>Test ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Difficulty</TableHead>
                  {/* <TableHead>Attempts</TableHead> */}
                  <TableHead>Avg. Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testDetails.testsListing.length > 0 ? (
                  tests.map((test: Test) => (
                    <TableRow key={test._id}>
                      <TableCell>{test._id}</TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.createdBy}</TableCell>
                      <TableCell>{test.totalQuestions}</TableCell>
                      <TableCell>{test.difficultyLevel}</TableCell>
                      <TableCell>{test.avgScore}%</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => viewTestDetails(test)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openShareDialog(test)}
                            >
                              <Share2 className="h-4 w-4 mr-2" /> Share Test
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(test)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Test
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No tests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Test Details Dialog */}
      <Dialog open={isTestDetailsOpen} onOpenChange={setIsTestDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Test Details</DialogTitle>
          </DialogHeader>
          {currentTest && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {currentTest.testName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Created by {currentTest.createdBy} on{" "}
                  {convertToDateFormat(currentTest.createdAt)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Questions
                      </div>
                      <div className="text-2xl font-bold">
                        {currentTest.totalQuestions}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">
                        Average Score
                      </div>
                      <div className="text-2xl font-bold">
                        {Number(currentTest.avgScore ?? 0).toFixed(0)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* <div className="space-y-4">
                <h4 className="text-md font-semibold">Performance Analytics</h4>
                <div className="h-[200px] flex items-end justify-between gap-2">
                  {[
                    { label: "0-20%", value: 5 },
                    { label: "21-40%", value: 12 },
                    { label: "41-60%", value: 25 },
                    { label: "61-80%", value: 45 },
                    { label: "81-100%", value: 33 },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-12 bg-primary rounded-t-md"
                        style={{ height: `${item.value * 1.5}px` }}
                      />
                      <div className="text-xs mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Score Distribution (% of students)
                </div>
              </div> */}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Test Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this test? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTest}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Test Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Test</DialogTitle>
            <DialogDescription>
              Share this test with students or other teachers.
            </DialogDescription>
          </DialogHeader>
          {currentTest && (
            <div className="space-y-4">
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Share Options</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Allow students to see answers after submission
                    </span>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Set time limit for test</span>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Require authentication</span>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsShareDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
