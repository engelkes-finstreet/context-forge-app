import { SignUpCard } from '@/features/auth/components/cards/sign-up-card';
import type { Metadata } from 'next';
import { TypedLink, routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-subtle">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Get started</h1>
          <p className="text-muted-foreground">
            Create your account to begin your journey
          </p>
        </div>

        <SignUpCard />

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <TypedLink
            params={{}}
            route={routes.auth.signIn}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </TypedLink>
        </div>
      </div>
    </div>
  );
}
