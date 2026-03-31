import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface ToolResult {
  success: boolean;
  output?: string;
  error?: string;
}

/**
 * Execute a shell command safely
 */
export async function executeShell(command: string): Promise<ToolResult> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      shell: "/bin/bash",
      timeout: 30000,
    });
    return {
      success: true,
      output: stdout || stderr,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

/**
 * List files in current directory
 */
export async function listFiles(): Promise<ToolResult> {
  try {
    const { stdout } = await execAsync("ls -la");
    return {
      success: true,
      output: stdout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}
