import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/userModel";
import verifyPassword from "@/lib/utils/verifyPasswordUtil";

const handler = NextAuth({
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [CredentialsProvider({
    credentials: {
      userEmail: {},
      userPassword: {}
    },
    async authorize(credentials, request) {
      if (!credentials) {
        throw new Error("Aucun identifiant de connexion n'est fourni");
      }

      const { userEmail, userPassword } = credentials;

      await dbConnect();

      const existingUser = await User.findOne({ userEmail });

      const isPasswordValid = verifyPassword(userPassword, existingUser?.userPassword);

      if (isPasswordValid) {
        return {
          id: existingUser?._id.toString(),
          email: existingUser?.userEmail,
        };
      } 
      
      else {
        return null;
      }
    }
  })],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    }
  }
})

export { handler as GET, handler as POST }