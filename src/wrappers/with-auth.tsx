"use client";

// import SignUpPage from "@/app/(auth)/signUp/page";
import Spinner from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signIn");
    }
  }, [status]);

  if (status === "loading")
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Spinner size={40} className="mx-auto my-4" />
      </div>
    );

  // if (status === "unauthenticated") return <SignUpPage />;

  return children;
};

export default AuthGuard;
