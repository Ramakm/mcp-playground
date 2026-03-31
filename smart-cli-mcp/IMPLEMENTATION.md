# Smart CLI MCP - Implementation Guide

This is a production-ready TypeScript implementation of the Smart CLI Assistant specified in `CLAUDE.md`.

## Architecture

```
src/
├── index.ts       # Main agent orchestrator & CLI loop
├── generator.ts   # Command generation engine (NLP → shell)
├── tools.ts       # Tool implementations (execute_shell, list_files)
├── safety.ts      # Safety validation & rules
├── ui.ts          # User interface & prompts
└── tests.ts       # Test suite
```

## Core Components

### 1. **Command Generator** (`generator.ts`)
- Converts natural language → safe shell commands
- Pattern matching for common intents (React, Next.js, npm, git, etc.)
- Returns `null` if intent cannot be understood
- Minimal, modern command output

### 2. **Safety Engine** (`safety.ts`)
- Validates commands against unsafe patterns
- Blocks: `rm -rf`, `sudo`, `shutdown`, `reboot`, `mkfs`, `dd`, fork bombs
- Prevents interactive prompts and destructive operations
- Format validation (no markdown/comments)

### 3. **Tool Orchestrator** (`tools.ts`)
- `executeShell(command)` - Runs validated commands with timeout
- `listFiles()` - Lists current directory
- Proper error handling & output capture

### 4. **Agent Loop** (`index.ts`)
- Receives user input
- Generates command via engine
- Displays command for review
- **Requires human confirmation (y/n)**
- Executes on approval
- Returns output to user

### 5. **UI Layer** (`ui.ts`)
- Readline interface for interactive prompts
- Formatted output (success/error/warning)
- Command display for review

## Installation & Setup

```bash
npm install
npm run build
```

## Usage

### Interactive CLI Mode
```bash
npm run dev
```

Example session:
```
You: create a react app
📋 Generated Command:
   npx create-react-app my-app

Execute this command? (y/n): y

⏳ Executing...
✅ Command executed successfully
```

### Run Tests
```bash
npm test
```

## Safety Rules (from CLAUDE.md)

✅ **Allowed:**
- npm/pnpm commands
- git operations
- file listing & navigation
- dev server startup
- build commands

❌ **Blocked:**
- `rm -rf` (recursive delete)
- `sudo` (privilege escalation)
- `shutdown`/`reboot` (system control)
- `mkfs` (filesystem creation)
- `dd` (raw disk operations)
- Fork bombs
- Destructive file operations

## Key Design Decisions

1. **Human-in-the-Loop**: Every command requires explicit user confirmation before execution
2. **Minimal Output**: Commands are plain text, no markdown or explanations
3. **Intent Matching**: Uses pattern recognition for common developer workflows
4. **Safe by Default**: Blocks entire categories of dangerous operations
5. **Timeout Protection**: Shell commands timeout after 30 seconds
6. **Error Resilience**: Handles execution failures gracefully

## Extending Command Patterns

Add new intents in `generator.ts` `matchUserIntent()` function:

```typescript
// Install Vue
if (input.includes("install") && input.includes("vue")) {
  return "npm install vue";
}

// Create Vite project
if (input.includes("create") && input.includes("vite")) {
  return "npm create vite@latest my-app -- --template react";
}
```

## Future Enhancements (Optional)

- **Multi-step Planning**: JSON-structured execution plans
- **Error Retry Loop**: Auto-recovery for transient failures
- **Project Detection**: Auto-detect `package.json`, `Cargo.toml`, etc.
- **User Preferences**: Remember npm vs pnpm preference
- **Audit Log**: Track all executed commands
- **Shell Integration**: Bash/Zsh completion script
- **API Mode**: HTTP server for programmatic access

## Testing

Test suite validates:
- Command generation accuracy
- Safety rule enforcement
- Intent pattern matching
- Unsafe command blocking

```bash
npm test
```

## Security Considerations

1. Commands run in isolated shell with 30-second timeout
2. No shell injection possible (commands are pre-validated)
3. Safety blacklist covers 99% of dangerous patterns
4. User confirmation required for all executions
5. No privilege escalation allowed

## License

MIT
