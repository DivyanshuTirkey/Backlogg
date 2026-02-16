"use client";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Chrome } from "lucide-react";

export function LoginPage() {
    const { signInWithGoogle, loading } = useAuth();

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            console.error("CRITICAL: NEXT_PUBLIC_FIREBASE_API_KEY is missing!");
            alert("CRITICAL ERROR: Firebase API Key is missing in this build. Please check Vercel Environment Variables.");
        } else {
            console.log("Firebase API Key is present (characters: " + process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length + ")");
        }
    }, []);

    if (loading) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter">Backlogg</h1>
                    <p className="text-zinc-500">Your smart productivity hub for getting things done.</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl backdrop-blur-sm">
                    <Button
                        onClick={signInWithGoogle}
                        className="w-full bg-white text-black hover:bg-zinc-200 gap-2 h-12 text-base font-medium"
                    >
                        <Chrome size={20} />
                        Continue with Google
                    </Button>
                    <p className="mt-4 text-xs text-zinc-600">
                        By continuing, you verify that you are authorized to access this production environment.
                    </p>
                </div>
            </div>
        </div>
    );
}
