import { Scoreboard } from './components/Scoreboard';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-orange-500/30 selection:text-white pt-8 pb-24 px-4 sm:px-8 font-sans overflow-hidden flex flex-col items-center">
      <main className="w-full max-w-[1024px] mx-auto flex-1">
        <Scoreboard />
      </main>
    </div>
  );
}
