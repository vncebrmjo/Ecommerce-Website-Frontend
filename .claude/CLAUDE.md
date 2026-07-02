
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

# C# / ASP.NET Core Best Practices

You are an expert in C# 14, .NET 10, and ASP.NET Core. Write modern, idiomatic, production-ready code.

## Stack
- C# 14 / .NET 10, NRTs on, warnings as errors, file-scoped namespaces
- ASP.NET Core Minimal APIs, EF Core 10, xUnit v3 + FluentAssertions

## C# Language
- Enable nullable reference types (NRTs); never use `!` to suppress warnings
- Use `record` for DTOs, requests, responses, and domain events
- Use `class` for entities with identity and behavior (EF Core aggregates)
- Use primary constructors for simple types
- Use collection expressions (`[1, 2, 3]`) over `new List<T> { }`
- Use the `field` keyword instead of manual backing fields
- Use extension members (C# 14) instead of static extension method classes
- Prefer switch expressions and pattern matching over `if`/`else` chains
- Use `is not null` over `!= null`

## Async / Threading
- `async`/`await` only — never `.Result`, `.Wait()`, or `async void` (except event handlers)
- Every async I/O method must accept and propagate `CancellationToken`
- Let `OperationCanceledException` bubble; do not swallow it

## ASP.NET Core
- Use Minimal APIs with `TypedResults` for all responses
- Use `MapGroup` + `IEndpointFilter` for shared cross-cutting concerns
- Keep endpoints thin — no business logic
- Use `IOptions<T>` for config; never inject `IConfiguration` directly into services
- Use built-in OpenAPI support (no Swashbuckle needed in .NET 10)

## Dependency Injection
- Constructor injection only — no service locator, no static state
- Register services with appropriate lifetimes

## Entity Framework Core 10
- Use async EF methods (`ToListAsync`, `FirstOrDefaultAsync`, etc.) always
- Apply `AsNoTracking()` for all read-only queries
- Do NOT wrap EF Core in a repository abstraction layer — use DbContext directly
- Materialize LINQ queries once at layer boundaries
- Use `ExecuteUpdateAsync`/`ExecuteDeleteAsync` for bulk ops

## Time
- Use `TimeProvider` (injected) instead of `DateTime.Now` or `DateTimeOffset.UtcNow`

## Error Handling
- Catch specific exceptions; rethrow with `throw;` to preserve stack trace
- Use global exception handler middleware for unhandled exceptions

## NuGet Packages
- Never hardcode package versions from memory — training data has stale 8.x/9.x versions
- Run `dotnet add package <name>` without `--version` to get the latest stable release
- Microsoft.* packages targeting .NET 10 use 10.x versions

## Testing
- xUnit v3 + FluentAssertions
- Name tests: `MethodName_Scenario_ExpectedResult`
- Prefer Testcontainers for integration tests over heavy mocking
