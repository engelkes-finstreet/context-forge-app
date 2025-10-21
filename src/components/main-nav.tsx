'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { TypedLink, useTypedRouter, routes } from '@/lib/routes';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { ModeToggle } from '@/components/mode-toggle';

export function MainNav() {
  const pathname = usePathname();
  const router = useTypedRouter();

//   const routes = [
//     {
//       href: '/projects',
//       label: 'Projects',
//       active: pathname.startsWith('/projects'),
//     },
//     {
//       href: '/developers',
//       label: 'Developers',
//       active: pathname.startsWith('/developers'),
//     },
//   ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push(routes.auth.signIn);
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-6">
          <TypedLink route={routes.projects.list} className="font-semibold">
            Context Forge
          </TypedLink>
          <nav className="flex items-center gap-4">
            {/* {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'hover:text-primary text-sm font-medium transition-colors',
                  route.active ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {route.label}
              </Link>
            ))} */}
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <ThemeSwitcher />
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
