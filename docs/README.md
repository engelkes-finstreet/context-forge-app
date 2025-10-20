# Context Forge Documentation

Welcome to the Context Forge documentation. This directory contains comprehensive guides, references, and best practices for developing with Context Forge.

## Overview

Context Forge is a full-stack Next.js application designed to manage AI agent tasks and contexts. It provides a structured way to organize projects, tasks, and subtasks with shared contexts that can be accessed and modified by Claude Code through an integrated MCP (Model Context Protocol) server.

## Documentation Structure

### Architecture

Learn about the system design and organization:

- **[Overview](./architecture/overview.md)** - Tech stack and architectural layers
- **[File Structure](./architecture/file-structure.md)** - Directory layout and naming conventions

### Database

Understand the data model and database operations:

- **[Schema](./database/schema.md)** - Database models and relationships
- **[Setup](./database/setup.md)** - Database configuration and migrations

### Features

Explore the core features of Context Forge:

- **[Projects](./features/projects.md)** - Project management
- **[Tasks](./features/tasks.md)** - Task management with shared context
- **[Subtasks](./features/subtasks.md)** - Individual work items
- **[Typed Subtasks](./features/typed-subtasks.md)** - Advanced subtask type system

### Patterns

Learn the coding patterns used throughout the application:

- **[Forms](./patterns/forms.md)** - Form configuration and validation
- **[Services](./patterns/services.md)** - Business logic layer
- **[Server Actions](./patterns/server-actions.md)** - Form submission handling
- **[Validation](./patterns/validation.md)** - Zod schema patterns

### Integrations

Connect Context Forge with external tools:

- **[MCP Server](./integrations/mcp-server.md)** - Model Context Protocol server for Claude Code

### Guides

Practical guides for development:

- **[Development Setup](./guides/development-setup.md)** - Getting started with development
- **[Next.js 15 Patterns](./guides/nextjs-15-patterns.md)** - Next.js 15 specific patterns
- **[Best Practices](./guides/best-practices.md)** - Recommended approaches
- **[Troubleshooting](./guides/troubleshooting.md)** - Common issues and solutions

### Planning

Future directions and enhancements:

- **[Future Enhancements](./planning/future-enhancements.md)** - Planned features and improvements

## Quick Links

### Getting Started

1. [Development Setup](./guides/development-setup.md) - Set up your development environment
2. [Architecture Overview](./architecture/overview.md) - Understand the system architecture
3. [Database Schema](./database/schema.md) - Learn the data model

### Common Tasks

- [Create a new feature](./patterns/forms.md#form-structure) - Follow the form pattern
- [Add a new subtask type](./features/typed-subtasks.md#how-to-add-a-new-subtask-type) - Extend the type system
- [Database migration](./database/setup.md#database-migrations) - Manage schema changes
- [Troubleshoot issues](./guides/troubleshooting.md) - Fix common problems

### Key Concepts

- **Shared Context**: Tasks have a shared context accessible by all subtasks
- **Typed Subtasks**: Different subtask types with specialized behavior
- **Service Layer**: Business logic encapsulation
- **Server Actions**: Type-safe form submissions
- **MCP Integration**: Programmatic access for Claude Code

## Resources

### External Documentation

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

### Contributing

When adding new features or fixing bugs:

1. Follow the established patterns
2. Update relevant documentation
3. Add tests if applicable
4. Update CLAUDE.md if needed

## License

[Your License Here]
