import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

export default function Home() {
  redirect(routes.projects.list.path({}));
}
