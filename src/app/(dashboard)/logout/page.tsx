"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logoutUser } from "@/lib/features/auth/auth.slice";
import { RootState } from "@/lib/store";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hasLoggedOut = useRef(false);
  const accessTokenSelector = useAppSelector(
    (state: RootState) => state.auth.accessToken
  );

  const handleLogout = async () => {
    try {
      const res = await dispatch(
        logoutUser({ accessToken: accessTokenSelector ?? "" })
      ).unwrap();

      if (res.success) {
        await signOut({ callbackUrl: "/signIn" }); // NextAuth handles cookie/session removal
      } else {
        toast.error(res.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout.");
    }
  };

  useEffect(() => {
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;
      handleLogout();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogOut className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Logging Out</CardTitle>
          <CardDescription>
            You are being logged out of the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for using the ExamAdmin panel. You will be redirected to
            the login page shortly.
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => router.push("/")}
          >
            Return to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
