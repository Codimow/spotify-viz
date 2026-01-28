"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
    return (
        <button
            onClick={() => signIn("spotify")}
            className="px-8 py-3 rounded-full bg-[#1DB954] text-white font-bold text-lg hover:scale-105 transition transform shadow-[0_0_20px_rgba(29,185,84,0.5)] hover:shadow-[0_0_30px_rgba(29,185,84,0.8)]"
        >
            Connect Spotify
        </button>
    );
}
