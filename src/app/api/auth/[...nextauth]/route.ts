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
      // When user signs in with OAuth providers like Google or GitHub
      if (
        (account?.provider === "google" || account?.provider === "github") &&
        user?.email
      ) {
        try {
          const userInfoRes = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/auth/get-user-by-email/${user.email}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (userInfoRes.ok) {
            const userInfo = await userInfoRes.json();
            const fullUser = userInfo.response.data.user;

            token.userId = fullUser._id;
            token.email = fullUser.email;
            token.status = fullUser.status ?? "active";
            token.testTaken = fullUser.testTaken ?? 0;
            token.image = fullUser.image ?? "";
            token.averageScore = fullUser.averageScore ?? 0;
            token.createdAt = fullUser.createdAt ?? "";
            token.updatedAt = fullUser.updatedAt ?? "";
          } else {
            // If user not found, register a new one
            const registerRes = await fetch(
              `${process.env.NEXT_PUBLIC_DEV_BASE_URL}/admin/auth/register`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: user.email,
                  userName: user.name,
                  password: user.id,
                }),
              }
            );

            if (registerRes.ok) {
              const registerInfo = await registerRes.json();
              const newUser = registerInfo.data;

              token.userId = newUser._id;
              token.email = newUser.email;
              token.status = newUser.status ?? "active";
              token.testTaken = newUser.testTaken ?? 0;
              token.image = newUser.image ?? "";
              token.averageScore = newUser.averageScore ?? 0;
              token.createdAt = newUser.createdAt ?? "";
              token.updatedAt = newUser.updatedAt ?? "";
            }
            else {
              const error = await registerRes.json();
              console.log(error);
            }
          }
        } catch (error) {
          console.error("Error during OAuth user handling", error);
        }
      }
      else {
        if (user) {
          token.userId = user._id;
          token.email = user.email;
          token.status = user.status ?? "active";
          token.testTaken = user.testTaken ?? 0;
          token.image = user.image ?? "";
          token.averageScore = user.averageScore ?? 0;
          token.createdAt = user.createdAt ?? "";
          token.updatedAt = user.updatedAt ?? "";
        }
      }

      // For credentials login, user already available
      if (user && !token.userId) {
        token.userId = user._id;
        token.email = user.email;
        token.status = user.status ?? "active";
        token.testTaken = user.testTaken ?? 0;
        token.image = user.image ?? user.picture ?? "";
        token.averageScore = user.averageScore ?? 0;
        token.createdAt = user.createdAt ?? "";
        token.updatedAt = user.updatedAt ?? "";
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
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
