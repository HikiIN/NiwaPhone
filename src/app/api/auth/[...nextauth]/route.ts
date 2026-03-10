import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../../lib/mongoose";
import { User } from "../../../../lib/models/User";

const handler = NextAuth(
{
    providers: [
        GoogleProvider(
        {
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }
        ),
    ],
    callbacks: {
        async signIn({ user })
        {
            await connectDB();
            const existingUser = await User.findOne(
            {
                email: user.email
            }
            );

            if (!existingUser)
            {
                await User.create(
                {
                    email: user.email,
                    name: user.name,
                    role: "Продавець"
                }
                );
            }
            return true;
        },
        async session({ session })
        {
            await connectDB();
            const dbUser = await User.findOne(
            {
                email: session.user?.email
            }
            );

            if (dbUser && session.user)
            {
                (session.user as any).role = dbUser.role;
            }
            return session;
        }
    }
}
);

export { handler as GET, handler as POST };