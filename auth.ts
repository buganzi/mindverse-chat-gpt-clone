import NextAuth, { User, Session } from "next-auth";
import Google from "next-auth/providers/google";
import {createUser, getUser} from "@/db/queries";

interface ExtendedSession extends Session {
    user: User;
}

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers: [Google],
    callbacks: {
        async session({
                          session,
                      }: {
            session: ExtendedSession;
            token: any;
        }) {
            if (session.user) {
                const user  =  await getUser(session.user.email as string);
                if (user.length === 0){
                    user[0] = await createUser(session.user.email as string, session.user.name as string);
                }
                session.user.id = user[0]._id.toString();
            }

            return session;
        },
    },
});
