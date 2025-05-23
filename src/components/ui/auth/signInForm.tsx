"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks";
import { redirect } from "next/navigation";
import { setTokens } from "@/lib/features/auth/auth.slice";
import { toast } from "react-toastify";

export function SignInForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        toast.error("Invalid credentials");
      }
      else {
        toast.error(res.error);
      }
    } else {
      const session = await getSession();
      dispatch(
        setTokens({
          accessToken: session?.user?.accessToken ?? "",
          refreshToken: session?.user?.refreshToken ?? "",
        })
      );
      redirect("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Sign In to your account
      </h2>

      {/* Third-party auth */}
      <div className="space-y-2">
        {/* <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => signIn("github")}
        >
          <Github className="w-4 h-4" /> Sign in with GitHub
        </Button> */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => signIn("google", {callbackUrl: "/dashboard"})}
        >
          <Mail className="w-4 h-4" /> Sign in with Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-zinc-700"></span>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500">
            or continue with
          </span>
        </div>
      </div>

      {/* Sign In form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder=""
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            className="pr-10" // space for icon
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 transform -translate-y-1/2 text-gray-500"
          >
          <span className="cursor-pointer">
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </span>
          </button>
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Sign In
        </Button>
        <p>Don`t you have an account?</p>
        <Link href="/signUp">Sign Up</Link>
      </form>
    </div>
  );
}
