'use client';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTokens } from "@/lib/features/auth/auth.slice";

const TokenLoader = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if session and tokens are available
    if (status === "authenticated" && session?.user?.accessToken && session?.user?.refreshToken) {
      try {
        dispatch(setTokens({
          accessToken: session.user.accessToken,
          refreshToken: session.user.refreshToken
        }));
      } catch (error) {
        console.error("Error dispatching tokens:", error);
      }
    } else if (status === "unauthenticated") {
      // Optionally clear tokens from store if unauthenticated
      dispatch(setTokens({
        accessToken: "",
        refreshToken: ""
      }));
    }
  }, [session, status, dispatch]);

  return null;
};

export default TokenLoader;
