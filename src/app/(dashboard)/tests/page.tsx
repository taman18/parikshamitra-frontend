"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Copy, Eye, Link2, MoreHorizontal, Search, Share2, Trash2 } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"

interface Test {
  id: string
  title: string
  createdBy: string
  totalQuestions: number
  difficultyMix: {
    easy: number
    medium: number
    hard: number
  }
  sharedLink: string
  totalAttempts: number
  avgScore: number
  createdAt: string
}

export default function TestsOverviewPage() {
//   const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isTestDetailsOpen, setIsTestDetailsOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false)
  const [currentTest, setCurrentTest] = useState<Test | null>(null)

  // Sample data
  const [tests, setTests] = useState<Test[]>([
    {
      id: "TEST-1001",
      title: "Mathematics Mid-Term",
      createdBy: "John Doe",
      totalQuestions: 25,
      difficultyMix: {
        easy: 40,
        medium: 40,
        hard: 20,
      },
      sharedLink: "https://exam.io/t/math-mid-term",
      totalAttempts: 120,
      avgScore: 72.5,
      createdAt: "2023-03-15",
    },
    {
      id: "TEST-1002",
      title: "Science Quiz",
      createdBy: "Jane Smith",
      totalQuestions: 15,
      difficultyMix: {
        easy: 30,
        medium: 50,
        hard: 20,
      },
      sharedLink: "https://exam.io/t/science-quiz",
      totalAttempts: 85,
      avgScore: 68.3,
      createdAt: "2023-03-20",
    },
    {
      id: "TEST-1003",
      title: "English Grammar Test",
      createdBy: "Robert Brown",
      totalQuestions: 30,
      difficultyMix: {
        easy: 20,
        medium: 60,
        hard: 20,
      },
      sharedLink: "https://exam.io/t/english-grammar",
      totalAttempts: 95,
      avgScore: 75.8,
      createdAt: "2023-04-05",
    },
    {
      id: "TEST-1004",
      title: "Physics Final Exam",
      createdBy: "Sarah Williams",
      totalQuestions: 40,
      difficultyMix: {
        easy: 25,
        medium: 50,
        hard: 25,
      },
      sharedLink: "https://exam.io/t/physics-final",
      totalAttempts: 65,
      avgScore: 62.1,
      createdAt: "2023-04-10",
    },
    {
      id: "TEST-1005",
      title: "Computer Science Basics",
      createdBy: "Michael Johnson",
      totalQuestions: 20,
      difficultyMix: {
        easy: 50,
        medium: 30,
        hard: 20,
      },
      sharedLink: "https://exam.io/t/cs-basics",
      totalAttempts: 110,
      avgScore: 81.4,
      createdAt: "2023-04-15",
    },
  ])

  const filteredTests = tests.filter((test) => {
    return (
      test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const viewTestDetails = (test: Test) => {
    setCurrentTest(test)
    setIsTestDetailsOpen(true)
  }

  const openDeleteDialog = (test: Test) => {
    setCurrentTest(test)
    setIsDeleteDialogOpen(true)
  }

  const openShareDialog = (test: Test) => {
    setCurrentTest(test)
    setIsShareDialogOpen(true)
  }

  const handleDeleteTest = () => {
    if (!currentTest) return

    const updatedTests = tests.filter((test) => test.id !== currentTest.id)
    setTests(updatedTests)
    setIsDeleteDialogOpen(false)

    // toast({
    //   title: "Success",
    //   description: "Test deleted successfully",
    // })
  }

  const handleCopyLink = () => {
    if (!currentTest) return

    navigator.clipboard.writeText(currentTest.sharedLink)

    // toast({
    //   title: "Success",
    //   description: "Link copied to clipboard",
    // })
  }

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
                  <TableHead>Difficulty Mix</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.id}</TableCell>
                    <TableCell>{test.title}</TableCell>
                    <TableCell>{test.createdBy}</TableCell>
                    <TableCell>{test.totalQuestions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="bg-green-100">
                          E: {test.difficultyMix.easy}%
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-100">
                          M: {test.difficultyMix.medium}%
                        </Badge>
                        <Badge variant="outline" className="bg-red-100">
                          H: {test.difficultyMix.hard}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{test.totalAttempts}</TableCell>
                    <TableCell>{test.avgScore.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewTestDetails(test)}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openShareDialog(test)}>
                            <Share2 className="h-4 w-4 mr-2" /> Share Test
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(test)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Test
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

      {/* Test Details Dialog */}
      <Dialog open={isTestDetailsOpen} onOpenChange={setIsTestDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Test Details</DialogTitle>
          </DialogHeader>
          {currentTest && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{currentTest.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Created by {currentTest.createdBy} on {new Date(currentTest.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Total Questions</div>
                      <div className="text-2xl font-bold">{currentTest.totalQuestions}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Total Attempts</div>
                      <div className="text-2xl font-bold">{currentTest.totalAttempts}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Average Score</div>
                      <div className="text-2xl font-bold">{currentTest.avgScore.toFixed(1)}%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-semibold">Difficulty Distribution</h4>
                <div className="h-8 w-full rounded-full overflow-hidden bg-muted">
                  <div className="flex h-full">
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: `${currentTest.difficultyMix.easy}%` }}
                      title={`Easy: ${currentTest.difficultyMix.easy}%`}
                    />
                    <div
                      className="bg-yellow-500 h-full"
                      style={{ width: `${currentTest.difficultyMix.medium}%` }}
                      title={`Medium: ${currentTest.difficultyMix.medium}%`}
                    />
                    <div
                      className="bg-red-500 h-full"
                      style={{ width: `${currentTest.difficultyMix.hard}%` }}
                      title={`Hard: ${currentTest.difficultyMix.hard}%`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1" />
                    Easy: {currentTest.difficultyMix.easy}%
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1" />
                    Medium: {currentTest.difficultyMix.medium}%
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-1" />
                    Hard: {currentTest.difficultyMix.hard}%
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                      <div className="w-12 bg-primary rounded-t-md" style={{ height: `${item.value * 1.5}px` }} />
                      <div className="text-xs mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-muted-foreground">Score Distribution (% of students)</div>
              </div>

              <div className="pt-4 border-t flex justify-between items-center">
                <div className="flex items-center">
                  <Link2 className="h-4 w-4 mr-2" />
                  <span className="text-sm">{currentTest.sharedLink}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
              </div>
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
              Are you sure you want to delete this test? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
            <DialogDescription>Share this test with students or other teachers.</DialogDescription>
          </DialogHeader>
          {currentTest && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={currentTest.sharedLink} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Share Options</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Allow students to see answers after submission</span>
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
  )
}
