import { Header } from '@/components/header';
import { ResumeTailorForm } from '@/components/resume-tailor-form';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ResumeTailorForm />
      </main>
    </div>
  );
}
