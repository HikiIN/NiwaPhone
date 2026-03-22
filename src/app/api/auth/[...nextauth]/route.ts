import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDB();
      const email = user.email ?? undefined;
      const existing = await User.findOne({ email });

      if (!existing) {
        await User.create({
          email,
          name:  user.name  ?? undefined,
          image: user.image ?? undefined,
          role:  "Гість",
        });
      } else if (existing.image !== user.image) {
        await User.updateOne({ email }, { image: user.image ?? undefined });
      }

      return true;
    },

    async session({ session }) {
      await connectDB();
      const email = session.user?.email ?? undefined;
      const dbUser = await User.findOne({ email });

      if (dbUser && session.user) {
        (session.user as any).role = dbUser.role;
        (session.user as any).id   = dbUser._id.toString();
        session.user.image = dbUser.image;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };