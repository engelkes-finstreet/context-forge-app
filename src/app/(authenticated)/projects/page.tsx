import { TypedLink, routes } from '@/lib/routes';
import { ProjectService } from '@/lib/services/project-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default async function ProjectsPage() {
  const projects = await ProjectService.getAllProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Context Forge projects
          </p>
        </div>
        <TypedLink route={routes.projects.new}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </TypedLink>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <TypedLink route={routes.projects.new}>
              <Button>Create Your First Project</Button>
            </TypedLink>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <TypedLink key={project.id} route={routes.projects.detail} params={{ projectId: project.id }}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  {project.description && (
                    <CardDescription>{project.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {project._count.tasks} {project._count.tasks === 1 ? 'task' : 'tasks'}
                  </div>
                </CardContent>
              </Card>
            </TypedLink>
          ))}
        </div>
      )}
    </div>
  );
}
