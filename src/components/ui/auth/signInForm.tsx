'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Mail } from "lucide-react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"


export function SignInForm() {
  const [form, setForm] = useState({ username: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sign in form submitted:", form)
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">Sign In to your account</h2>

      {/* Third-party auth */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => signIn('github')}>
          <Github className="w-4 h-4" /> Sign in with GitHub
        </Button>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => signIn('google')}>
          <Mail className="w-4 h-4" /> Sign in with Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-zinc-700"></span>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500">or continue with</span>
        </div>
      </div>

      {/* Sign In form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="yourusername"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <p>Don`t you have an account?</p>
        <Link href="/signUp">Sign Up</Link>
      </form>
    </div>
  )
}
