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
import { Eye, MoreHorizontal, Search, ShieldAlert, ShieldCheck, UserX } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "blocked"
  testsTaken: number
  avgScore: number
  joinDate: string
}

export default function UsersPage() {
//   const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState<boolean>(false)
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Sample data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Student",
      status: "active",
      testsTaken: 15,
      avgScore: 78.5,
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Teacher",
      status: "active",
      testsTaken: 5,
      avgScore: 92.3,
      joinDate: "2023-02-20",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.j@example.com",
      role: "Student",
      status: "blocked",
      testsTaken: 8,
      avgScore: 45.7,
      joinDate: "2023-03-10",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      role: "Student",
      status: "active",
      testsTaken: 12,
      avgScore: 81.2,
      joinDate: "2023-01-25",
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "robert.b@example.com",
      role: "Teacher",
      status: "active",
      testsTaken: 3,
      avgScore: 88.9,
      joinDate: "2023-04-05",
    },
  ])

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const viewUserDetails = (user: User) => {
    setCurrentUser(user)
    setIsUserDetailsOpen(true)
  }

  const openBlockDialog = (user: User) => {
    setCurrentUser(user)
    setIsBlockDialogOpen(true)
  }

  const handleToggleUserStatus = () => {
    if (!currentUser) return

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? {
            ...user,
            status: user.status === "active" ? "blocked" : "active",
          }
        : user,
    )

    // setUsers(updatedUsers)
    setIsBlockDialogOpen(false)

    // toast({
    //   title: "Success",
    //   description: `User ${currentUser.status === "active" ? "blocked" : "activated"} successfully`,
    // })
  }

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
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tests Taken</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "outline" : "destructive"}>
                        {user.status === "active" ? (
                          <ShieldCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <ShieldAlert className="h-3 w-3 mr-1" />
                        )}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.testsTaken}</TableCell>
                    <TableCell>{user.avgScore.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewUserDetails(user)}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openBlockDialog(user)}>
                            <UserX className="h-4 w-4 mr-2" />
                            {user.status === "active" ? "Block User" : "Unblock User"}
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
                  <span className="text-xl font-bold text-primary">{currentUser.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
                <Badge variant={currentUser.status === "active" ? "outline" : "destructive"} className="ml-auto">
                  {currentUser.status === "active" ? (
                    <ShieldCheck className="h-3 w-3 mr-1" />
                  ) : (
                    <ShieldAlert className="h-3 w-3 mr-1" />
                  )}
                  {currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p>{currentUser.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                  <p>{new Date(currentUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tests Taken</p>
                  <p>{currentUser.testsTaken}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p>{currentUser.avgScore.toFixed(1)}%</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <p className="text-sm">Completed "Mathematics Test" on {new Date().toLocaleDateString()}</p>
                  <p className="text-sm">
                    Created "Science Quiz" on {new Date(Date.now() - 86400000).toLocaleDateString()}
                  </p>
                  <p className="text-sm">Updated profile on {new Date(Date.now() - 172800000).toLocaleDateString()}</p>
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
            <DialogTitle>{currentUser?.status === "active" ? "Block User" : "Unblock User"}</DialogTitle>
            <DialogDescription>
              {currentUser?.status === "active"
                ? "Are you sure you want to block this user? They will not be able to access the platform."
                : "Are you sure you want to unblock this user? They will regain access to the platform."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={currentUser?.status === "active" ? "destructive" : "default"}
              onClick={handleToggleUserStatus}
            >
              {currentUser?.status === "active" ? "Block User" : "Unblock User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
