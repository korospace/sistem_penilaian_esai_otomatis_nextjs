// nextjs
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// services
import { Login } from "@/lib/services/mysql/login";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.APP_KEY,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const loginCheck = await Login({ username, password });

        if (loginCheck.status === true) {
          return loginCheck.data;
        } else {
          throw new Error(loginCheck.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials") {
        token.id_user = user.id_user;
        token.username = user.username;
        token.full_name = user.full_name;
        token.id_user_role = user.id_user_role;
      }

      return token;
    },
    async session({ session, token }: any) {
      if ("id_user" in token) {
        session.user.id_user = token.id_user;
      }
      if ("username" in token) {
        session.user.username = token.username;
      }
      if ("full_name" in token) {
        session.user.full_name = token.full_name;
      }
      if ("id_user_role" in token) {
        session.user.id_user_role = token.id_user_role;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default authOptions;
