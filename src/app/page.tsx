import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

interface HomePageProps {
  searchParams: Record<string, string>;
}

export default function Home({ searchParams }: HomePageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-4 pb-8 pt-24 text-center md:pb-12 md:pt-32 lg:pb-16 lg:pt-48">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Manage Your Code Snippets
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            A powerful code snippet manager that helps you organize, share, and
            access your code snippets from anywhere.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/api/auth/signin">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">View Demo</Link>
            </Button>
          </div>
        </section>
        <section className="container grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <h3 className="text-lg font-semibold">Organize</h3>
            <p className="text-muted-foreground">
              Keep your code snippets organized with tags and categories.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <h3 className="text-lg font-semibold">Share</h3>
            <p className="text-muted-foreground">
              Share your snippets with team members or make them public.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <h3 className="text-lg font-semibold">Access</h3>
            <p className="text-muted-foreground">
              Access your snippets from anywhere, anytime.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
