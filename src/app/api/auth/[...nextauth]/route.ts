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
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        await User.create({
          email: user.email,
          name:  user.name,
          image: user.image,
          role:  "Продавець",
        });
      } else if (existing.image !== user.image) {
        await User.updateOne({ email: user.email }, { image: user.image });
      }
      return true;
    },
    async session({ session }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user?.email });
      if (dbUser && session.user) {
        (session.user as any).role = dbUser.role;
        (session.user as any).id   = dbUser._id.toString();
        session.user.image = dbUser.image;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };