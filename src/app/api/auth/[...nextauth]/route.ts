import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { ADMIN_USER_ID, API_URIS, STATUS } from "@/lib/constant";

interface User {
  _id: string;
  userName?: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  accessToken: string;
  refreshToken: string;
  image?: string;
  id?: string;
  name?: string;
  picture?: string;
}

interface Token {
  name?: string;
  email: string;
  picture?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  userId?: string;
  status: string;
  accessToken?: string;
  refreshToken?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  provider: string;
  type: string;
  providerAccountId: string;
  access_token: string;
  expires_at: number;
  scope: string;
  token_type: string;
  id_token: string;
}

interface Session {
  user: User;
  expires: string;
}

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
    async signIn({ user }: { user: User }) {
      return user._id === ADMIN_USER_ID;
    },
  
    async jwt({ token, user, account }: { token: Token; user: User; account?: Account }) {
      const DEV_BASE_URL = process.env.NEXT_PUBLIC_DEV_BASE_URL;

      const setTokenData = (token: Token, data: User) => {
        token.userId = data._id;
        token.email = data.email;
        token.status = data.status ?? STATUS.ACTIVE;
        token.image = data.image ?? "";
        token.createdAt = data.createdAt ?? "";
        token.updatedAt = data.updatedAt ?? "";
        token.accessToken = data.accessToken ?? "";
        token.refreshToken = data.refreshToken ?? "";
      };

      const loginUser = async (email: string, password: string = "") => {
        const res = await fetch(`${DEV_BASE_URL}/${API_URIS.auth.login}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) return null;
        const data = await res.json();
        return data?.data ?? null;
      };

      const registerUser = async (email: string, name: string = '', password: string = '') => {
        const res = await fetch(`${DEV_BASE_URL}/${API_URIS.auth.register}`, {
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
            `${DEV_BASE_URL}/${API_URIS.auth.getUserByEmail}/${user.email}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (checkUserRes.ok) {
            const userData = await loginUser(user.email, user.id);
            if (userData) setTokenData(token, userData);
          } else {
            const registered = await registerUser(
              user.email,
              user.name,
              user.id
            );
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
          image: user.image ?? user.picture ?? "",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        });
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: Token }) {
      session.user.email = token.email;
      session.user.status = token.status;
      session.user.createdAt = token.createdAt;
      session.user.updatedAt = token.updatedAt;
      session.user.image = token.picture;
      session.user.accessToken = token.accessToken ?? "";
      session.user.refreshToken = token.refreshToken ?? "";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
