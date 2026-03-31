import { generateCommand } from "../src/generator.js";
import { isSafeCommand } from "../src/safety.js";

/**
 * Test suite for Smart CLI Agent
 */

interface TestCase {
  input: string;
  expectedCommand: string | null;
  description: string;
}

const testCases: TestCase[] = [
  {
    input: "create a react app",
    expectedCommand: "npx create-react-app my-app",
    description: "Create React app command",
  },
  {
    input: "install express",
    expectedCommand: "npm init -y && npm install express",
    description: "Install Express command",
  },
  {
    input: "list files",
    expectedCommand: "ls -la",
    description: "List files command",
  },
  {
    input: "initialize git repo and first commit",
    expectedCommand: "git init && git add . && git commit -m 'initial commit'",
    description: "Git init with commit command",
  },
  {
    input: "create next.js app",
    expectedCommand: "npx create-next-app@latest my-app",
    description: "Create Next.js app command",
  },
  {
    input: "build project",
    expectedCommand: "npm run build",
    description: "Build project command",
  },
];

const unsafeCommands = [
  "rm -rf /",
  "sudo rm -rf /",
  "dd if=/dev/zero of=/dev/sda",
  "shutdown -h now",
  "reboot",
  "mkfs.ext4 /dev/sda1",
];

/**
 * Run all tests
 */
export function runTests(): void {
  console.log("🧪 Running Smart CLI Agent Tests\n");

  let passed = 0;
  let failed = 0;

  // Test command generation
  console.log("📝 Command Generation Tests:");
  testCases.forEach((testCase) => {
    const result = generateCommand(testCase.input);

    if (result.command === testCase.expectedCommand) {
      console.log(`✅ ${testCase.description}`);
      passed++;
    } else {
      console.log(`❌ ${testCase.description}`);
      console.log(
        `   Expected: ${testCase.expectedCommand}`
      );
      console.log(`   Got: ${result.command}`);
      failed++;
    }
  });

  // Test safety validation
  console.log("\n🔐 Safety Validation Tests:");
  unsafeCommands.forEach((cmd) => {
    const isSafe = isSafeCommand(cmd);

    if (!isSafe) {
      console.log(`✅ Correctly rejected unsafe command: "${cmd}"`);
      passed++;
    } else {
      console.log(`❌ Failed to reject unsafe command: "${cmd}"`);
      failed++;
    }
  });

  // Summary
  console.log(`\n📊 Test Summary:`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}
