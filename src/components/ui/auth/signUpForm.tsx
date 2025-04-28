'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Github, Mail, User, Lock, Globe } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"

export function SignUpForm() {
  const [form, setForm] = useState({ userName: "", email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    await signIn('credentials', {  email: form.email, password: form.password, userName: form.userName, redirect: false });
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 border rounded-2xl shadow-xl bg-white dark:bg-zinc-900 space-y-6">
      <h2 className="text-2xl font-bold text-center">Create an Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="userName">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              name="userName"
              type="text"
              value={form.userName}
              onChange={handleChange}
              placeholder="john_doe"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">Sign Up</Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500">or continue with</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn("google")}
        >
          <Globe className="mr-2 h-4 w-4" /> Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn("github")}
        >
          <Github className="mr-2 h-4 w-4" /> GitHub
        </Button>
        <p>Already have an account? <Link href="/signIn" className="underline">Sign in</Link></p>
      </div>
    </div>
  )
}
