import { generateCommand } from "./generator.js";
import { executeShell, listFiles } from "./tools.js";
import {
  createReadlineInterface,
  askForConfirmation,
  askForInput,
  displaySection,
  displaySuccess,
  displayError,
  displayWarning,
  displayCommand,
} from "./ui.js";

/**
 * Main CLI Agent - Orchestrates command generation, validation, and execution
 */
async function main(): Promise<void> {
  const rl = createReadlineInterface();

  displaySection("🧠 Smart CLI Assistant");
  console.log("Convert natural language to shell commands safely.\n");
  console.log("Type 'exit' to quit, 'help' for examples.\n");

  // Agent loop
  let running = true;
  while (running) {
    try {
      const userInput = await askForInput(rl, "You: ");

      if (userInput.toLowerCase() === "exit") {
        displaySuccess("Goodbye!");
        running = false;
        break;
      }

      if (userInput.toLowerCase() === "help") {
        showExamples();
        continue;
      }

      // Generate command from natural language
      const result = generateCommand(userInput);

      if (!result.command) {
        displayWarning(result.reason || "Could not generate command");
        continue;
      }

      // Display generated command
      displayCommand(result.command);

      // Ask for user confirmation
      const approved = await askForConfirmation(
        rl,
        "\nExecute this command? (y/n): "
      );

      if (!approved) {
        console.log("Command cancelled.");
        continue;
      }

      // Execute command
      console.log("\n⏳ Executing...\n");
      const execResult = await executeShell(result.command);

      if (execResult.success) {
        displaySuccess("Command executed successfully");
        if (execResult.output) {
          console.log("\n📤 Output:");
          console.log(execResult.output);
        }
      } else {
        displayError("Command execution failed");
        if (execResult.error) {
          console.log(`Error: ${execResult.error}`);
        }
      }
    } catch (error) {
      displayError(`Unexpected error: ${error}`);
    }
  }

  rl.close();
}

/**
 * Display usage examples
 */
function showExamples(): void {
  displaySection("📚 Examples");
  const examples = [
    {
      input: "create a react app",
      output: "npx create-react-app my-app",
    },
    {
      input: "install express",
      output: "npm init -y && npm install express",
    },
    {
      input: "list files",
      output: "ls -la",
    },
    {
      input: "initialize git repo and first commit",
      output: "git init && git add . && git commit -m 'initial commit'",
    },
    {
      input: "create next.js app with tailwind",
      output: "npx create-next-app@latest my-app",
    },
    {
      input: "start dev server",
      output: "npm run dev || npm start",
    },
  ];

  examples.forEach((ex, idx) => {
    console.log(`\n${idx + 1}. Input: "${ex.input}"`);
    console.log(`   → ${ex.output}`);
  });
  console.log("\n");
}

// Run agent
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
