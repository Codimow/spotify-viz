import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginButton from "@/components/LoginButton";
import GraphWrapper from "@/components/GraphWrapper";
import { getMusicGraphData } from "@/lib/spotify-data";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#050505] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-[#050505] to-[#050505] opacity-50"></div>
        <div className="z-10 text-center flex flex-col items-center">
          <h1 className="text-6xl font-black mb-6 tracking-tighter bg-gradient-to-br from-green-400 to-emerald-600 text-transparent bg-clip-text drop-shadow-2xl">
            Music Verse
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-md mx-auto">
            Visualize your Spotify music taste as an <span className="text-green-400">interactive nebula</span>.
          </p>
          <LoginButton />
        </div>
      </main>
    );
  }

  const graphData = await getMusicGraphData();

  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505] text-red-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>Could not load data. Please try signing in again.</p>
          <div className="mt-4">
            <LoginButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#050505] overflow-hidden relative">
      <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-none select-none">
        <h2 className="text-white font-bold text-sm">Your Universe</h2>
        <p className="text-xs text-gray-400">{graphData.nodes.length} Artists • {graphData.links.length} Connections</p>
      </div>
      <div className="w-full h-full absolute inset-0">
        <GraphWrapper data={graphData} />
      </div>
    </main>
  );
}
