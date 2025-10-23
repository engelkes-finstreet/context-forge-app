import { notFound } from 'next/navigation';
import { TypedLink, routes } from '@/lib/routes';
import { ProjectService } from '@/lib/services/project-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageContent } from '@/components/ui/page-content';
import { EditProjectForm } from '@/features/projects/components/forms/edit-project/edit-project-form';
import { ArrowLeft } from 'lucide-react';

interface EditProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { projectId } = await params;
  const project = await ProjectService.getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <>
      <TypedLink route={routes.projects.detail} params={{ projectId }} data-transition-ignore>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {project.name}
        </Button>
      </TypedLink>

      <PageHeader>
        <PageHeader.Title
          title="Edit Project"
          subtitle={`Update project details for ${project.name}`}
        />
      </PageHeader>

      <PageContent>
        <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Update the project information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditProjectForm
            projectId={projectId}
            defaultValues={{
              name: project.name,
              description: project.description,
              githubRepo: project.githubRepo,
              swaggerPath: project.swaggerPath,
            }}
          />
        </CardContent>
      </Card>
      </PageContent>
    </>
  );
}
