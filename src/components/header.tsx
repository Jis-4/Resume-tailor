import { FileSignature } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center px-4">
        <FileSignature className="h-7 w-7 mr-3 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          ResumeTailor AI
        </h1>
      </div>
    </header>
  );
}
