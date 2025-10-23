import { routes, typedRedirect } from "@/lib/routes";

export default function Home() {
  typedRedirect(routes.projects.list)
}
