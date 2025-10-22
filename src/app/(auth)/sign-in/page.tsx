import { SignInCard } from '@/features/auth/components/cards/sign-in-card';
import { PageTransition } from '@/components/ui/page-transition';
import type { Metadata } from 'next';
import { TypedLink, routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-subtle">
      <PageTransition className="w-full max-w-lg space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to continue to your account
          </p>
        </div>

        <SignInCard />

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <TypedLink
            route={routes.auth.signUp}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </TypedLink>
        </div>
      </PageTransition>
    </div>
  );
}
