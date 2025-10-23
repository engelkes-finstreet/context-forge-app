import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageContent } from '@/components/ui/page-content';
import { CreateProjectForm } from '@/features/projects/components/forms/create-project/create-project-form';

export default function NewProjectPage() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title
          title="Create New Project"
          subtitle="Set up a new project to organize your tasks and contexts"
        />
      </PageHeader>

      <PageContent>
        <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Enter the basic information for your new project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProjectForm />
        </CardContent>
      </Card>
      </PageContent>
    </>
  );
}
