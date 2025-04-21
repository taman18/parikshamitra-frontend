'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

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
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input name="username" type="text" value={form.username} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" value={form.password} onChange={handleChange} />
      </div>

      <Button type="submit" className="w-full">Sign In</Button>
    </form>
  )
}
