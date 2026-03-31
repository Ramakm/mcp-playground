import * as readline from "readline";

/**
 * Create readline interface for user input
 */
export function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompt user for confirmation (y/n)
 */
export async function askForConfirmation(
  rl: readline.Interface,
  message: string
): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(message, (answer: string) => {
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Prompt user for input
 */
export async function askForInput(
  rl: readline.Interface,
  message: string
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(message, (answer: string) => {
      resolve(answer);
    });
  });
}

/**
 * Display a formatted section
 */
export function displaySection(title: string): void {
  console.log("\n" + "=".repeat(50));
  console.log(title);
  console.log("=".repeat(50));
}

/**
 * Display success message
 */
export function displaySuccess(message: string): void {
  console.log(`✅ ${message}`);
}

/**
 * Display error message
 */
export function displayError(message: string): void {
  console.log(`❌ ${message}`);
}

/**
 * Display warning message
 */
export function displayWarning(message: string): void {
  console.log(`⚠️  ${message}`);
}

/**
 * Display command for review
 */
export function displayCommand(command: string): void {
  console.log("\n📋 Generated Command:");
  console.log(`   ${command}`);
}
