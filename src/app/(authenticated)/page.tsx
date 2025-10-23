import { SwaggerEndpointTester } from "@/features/swagger/components/swagger-endpoint-tester";
import { SwaggerFormDemo } from "@/features/swagger/components/swagger-form-demo";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Context Forge</h1>
        <p className="text-muted-foreground">
          Welcome to Context Forge - Your AI agent task management system
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Standalone Selector Demo</h2>
          <p className="text-muted-foreground mb-4">
            This demonstrates the standalone SwaggerEndpointSelector component without form integration.
            Select a project to see all available endpoints with full details.
          </p>
          <SwaggerEndpointTester />
        </section>
      </div>
    </div>
  );
}
