import { Film } from 'lucide-react';

export function Header() {
  return (
    <header className="p-4 border-b bg-card shadow-sm">
      <div className="container mx-auto flex items-center gap-2">
        <Film className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline text-primary">Animatify</h1>
      </div>
    </header>
  );
}
