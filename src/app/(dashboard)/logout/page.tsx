"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // In a real app, you would handle logout logic here
    const timer = setTimeout(() => {
      // Redirect to login page after 3 seconds
      router.push("/")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogOut className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Logging Out</CardTitle>
          <CardDescription>You are being logged out of the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for using the ExamAdmin panel. You will be redirected to the login page shortly.
          </p>
          <Button variant="outline" className="mt-2" onClick={() => router.push("/")}>
            Return to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
