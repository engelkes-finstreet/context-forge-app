import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectService } from '@/lib/services/project-service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, ArrowLeft } from 'lucide-react';

interface ProjectDetailPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = await ProjectService.getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-2">{project.description}</p>
            )}
          </div>
          <Link href={`/projects/${projectId}/tasks/new`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        {project.tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <Link href={`/projects/${projectId}/tasks/new`}>
                <Button>Create Your First Task</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {project.tasks.map((task) => (
              <Link key={task.id} href={`/projects/${projectId}/tasks/${task.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>{task.name}</CardTitle>
                    <CardDescription>
                      {task._count.subtasks}{' '}
                      {task._count.subtasks === 1 ? 'subtask' : 'subtasks'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
