import Hero from "@/components/Hero";
import GuessingGame from "@/components/GuessingGame";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      <Hero />
      <div id="guess-section">
        <GuessingGame />
      </div>
    </main>
  );
}
