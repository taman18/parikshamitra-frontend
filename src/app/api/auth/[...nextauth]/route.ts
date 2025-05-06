import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/auth/login`,
            {
              body: JSON.stringify(credentials),
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (res.ok) {
            const user = await res.json();
            return user.data;
          } else {
            const error = await res.json();
          }
        } catch (error) {
          console.error(error);
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, user, account }) {
      const DEV_BASE_URL = process.env.NEXT_PUBLIC_DEV_BASE_URL;
    
      const setTokenData = (token, data) => {
        token.userId = data._id;
        token.email = data.email;
        token.status = data.status ?? "active";
        token.testTaken = data.testTaken ?? 0;
        token.image = data.image ?? "";
        token.averageScore = data.averageScore ?? 0;
        token.createdAt = data.createdAt ?? "";
        token.updatedAt = data.updatedAt ?? "";
        token.accessToken = data.accessToken ?? "";
        token.refreshToken = data.refreshToken ?? "";
      };
    
      const loginUser = async (email, password) => {
        const res = await fetch(`${DEV_BASE_URL}/admin/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
    
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data ?? null;
      };
    
      const registerUser = async (email, name, password) => {
        const res = await fetch(`${DEV_BASE_URL}/admin/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, userName: name, password }),
        });
    
        return res.ok;
      };
    
      // OAuth (Google or GitHub) Sign-in
      if (
        (account?.provider === "google" || account?.provider === "github") &&
        user?.email
      ) {
        try {
          const checkUserRes = await fetch(
            `${DEV_BASE_URL}/admin/auth/get-user-by-email/${user.email}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
    
          if (checkUserRes.ok) {
            const userData = await loginUser(user.email, user.id);
            if (userData) setTokenData(token, userData);
          } else {
            const registered = await registerUser(user.email, user.name, user.id);
            if (registered) {
              const userData = await loginUser(user.email, user.id);
              if (userData) setTokenData(token, userData);
            } else {
              console.error("Registration failed for new OAuth user");
            }
          }
        } catch (err) {
          console.error("Error during OAuth login/registration:", err);
        }
      }
    
      // Credentials-based sign-in or fallback
      if (user && !token.userId) {
        setTokenData(token, {
          _id: user._id,
          email: user.email,
          status: user.status,
          testTaken: user.testTaken,
          image: user.image ?? user.picture ?? "",
          averageScore: user.averageScore,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        });
      }
    
      return token;
    },
    

    async session({ session, token }) {
      session.user.userId = token.userId;
      session.user.email = token.email;
      session.user.status = token.status;
      session.user.testTaken = token.testTaken;
      session.user.averageScore = token.averageScore;
      session.user.createdAt = token.createdAt;
      session.user.updatedAt = token.updatedAt;
      session.user.image = token.picture;
      session.user.accessToken = token.accessToken ?? "";
      session.user.refreshToken = token.refreshToken ?? "";
      session.status = "authenticated";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
