export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
            <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin mb-4"></div>
                <p className="text-white/50 text-sm animate-pulse tracking-widest font-bold">LOADING UNIVERSE</p>
            </div>
        </div>
    );
}
