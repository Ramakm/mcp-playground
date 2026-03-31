import { isSafeCommand, isValidCommandFormat } from "./safety.js";

/**
 * Command generation engine
 * Converts natural language intent into safe shell commands
 */

interface CommandGenerationResult {
  command: string | null;
  reason?: string;
}

/**
 * Generate shell command from natural language input
 * 
 * Rules:
 * - Output ONLY valid shell commands
 * - No explanations, markdown, or comments
 * - Combine multiple steps with &&
 * - Use modern developer tooling (npx, npm, git)
 * - Assume Unix-like environment
 * - Prefer minimal commands
 */
export function generateCommand(
  userInput: string
): CommandGenerationResult {
  const input = userInput.toLowerCase().trim();

  // Validate input
  if (!input || input.length === 0) {
    return {
      command: null,
      reason: "Empty input provided",
    };
  }

  // Pattern matching for common intents
  const command = matchUserIntent(input);

  if (!command) {
    return {
      command: null,
      reason: "Could not understand intent or request appears unsafe",
    };
  }

  // Validate command format
  if (!isValidCommandFormat(command)) {
    return {
      command: null,
      reason: "Generated command has invalid format",
    };
  }

  // Validate command safety
  if (!isSafeCommand(command)) {
    return {
      command: null,
      reason: "Generated command violates safety rules",
    };
  }

  return {
    command,
  };
}

/**
 * Match user intent and generate appropriate command
 */
function matchUserIntent(input: string): string | null {
  // Create React app
  if (input.includes("create") && input.includes("react")) {
    return "npx create-react-app my-app";
  }

  // Create Next.js app
  if (input.includes("create") && input.includes("next")) {
    return "npx create-next-app@latest my-app";
  }

  // Install Express
  if (input.includes("install") && input.includes("express")) {
    return "npm init -y && npm install express";
  }

  // Install Tailwind
  if (input.includes("install") && input.includes("tailwind")) {
    return "npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p";
  }

  // List files
  if (
    input.includes("list") &&
    (input.includes("file") || input.includes("dir"))
  ) {
    return "ls -la";
  }

  // Initialize git
  if (input.includes("git") && input.includes("init")) {
    return "git init";
  }

  // Git add and commit
  if (
    input.includes("git") &&
    (input.includes("add") || input.includes("commit"))
  ) {
    return "git add . && git commit -m 'initial commit'";
  }

  // Initialize git + first commit
  if (
    input.includes("initialize") &&
    input.includes("git") &&
    input.includes("commit")
  ) {
    return "git init && git add . && git commit -m 'initial commit'";
  }

  // Show current directory
  if (input.includes("pwd") || input.includes("current dir")) {
    return "pwd";
  }

  // Change directory (generic)
  if (input.includes("cd ")) {
    const match = input.match(/cd\s+(.+)/);
    if (match && match[1]) {
      return `cd ${match[1]}`;
    }
  }

  // Install Node dependencies
  if (input.includes("install") && input.includes("dependenc")) {
    return "npm install";
  }

  // Update Node dependencies
  if (input.includes("update") && input.includes("dependenc")) {
    return "npm update";
  }

  // Start dev server
  if (input.includes("start") || input.includes("dev") || input.includes("server")) {
    return "npm run dev || npm start";
  }

  // Build project
  if (input.includes("build")) {
    return "npm run build";
  }

  // No matching intent
  return null;
}
