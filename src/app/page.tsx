import { Header } from "@/components/animatify/Header";
import { AnimatifyLayout } from "@/components/animatify/AnimatifyLayout";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow flex flex-col">
        <AnimatifyLayout />
      </main>
    </div>
  );
}
