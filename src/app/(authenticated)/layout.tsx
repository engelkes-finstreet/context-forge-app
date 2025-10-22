import { headers } from 'next/headers';
import { typedRedirect, routes } from '@/lib/routes';
import { auth } from '@/lib/auth';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    typedRedirect(routes.auth.signIn);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-subtle">
      <MainNav />
      <main className="flex-1 container mx-auto pt-8 px-4 pb-8">
        <div className="space-y-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
