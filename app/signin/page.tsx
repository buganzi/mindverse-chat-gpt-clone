import type { Metadata } from "next";
import React from 'react';
import SignIn from "@/components/SignIn";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Signin | AI Bot Vercel",
};


const SignInPage = async () => {
    const session = await auth();

    if (session?.user) {
        redirect("/");
    }
    return (
        <div className="fixed w-full h-full bg-black/80 left-0 flex items-center justify-center">
            <SignIn/>;
        </div>
    );
};

export default SignInPage;
