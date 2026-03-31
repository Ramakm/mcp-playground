/**
 * Safety rules for command generation
 */

const UNSAFE_PATTERNS = [
  /rm\s+-rf/i,
  /sudo\s+/i,
  /shutdown/i,
  /reboot/i,
  /mkfs/i,
  /\bdd\b/i,
  /:\(\){.*:\|:&.*};:/i, // fork bomb
];

const UNSAFE_KEYWORDS = [
  "rm -rf",
  "sudo",
  "shutdown",
  "reboot",
  "mkfs",
  "dd",
];

/**
 * Validate if a command is safe to execute
 */
export function isSafeCommand(command: string): boolean {
  // Check against unsafe patterns
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(command)) {
      return false;
    }
  }

  // Check for unsafe keywords
  for (const keyword of UNSAFE_KEYWORDS) {
    if (command.includes(keyword)) {
      return false;
    }
  }

  // Check for interactive prompts (reject commands with flags that trigger them)
  if (command.includes("-i") && command.includes("rm")) {
    return false;
  }

  // Check for background processes in dangerous commands
  if (command.includes("&") && (command.includes("rm") || command.includes("sudo"))) {
    return false;
  }

  return true;
}

/**
 * Validate command format
 */
export function isValidCommandFormat(command: string): boolean {
  // Command must not be empty
  if (!command || command.trim().length === 0) {
    return false;
  }

  // Command must be plain text (no markdown, code blocks, explanations)
  if (command.includes("```") || command.includes("```")) {
    return false;
  }

  return true;
}

/**
 * Sanitize command output for display
 */
export function sanitizeOutput(output: string): string {
  return output
    .trim()
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");
}
