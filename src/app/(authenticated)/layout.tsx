import { headers } from 'next/headers';
import { typedRedirect, routes } from '@/lib/routes';
import { auth } from '@/lib/auth';
import { MainNav } from '@/components/main-nav';

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
    <>
      <MainNav />
      <main className="container mx-auto pt-8 px-4 pb-16 min-h-screen bg-gradient-subtle">{children}</main>
    </>
  );
}
