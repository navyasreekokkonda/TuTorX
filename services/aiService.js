import { executeAIGateway } from "@/shared/lib/ai/Gateway";
import { logger } from "@/shared/lib/logger";

/**
 * Generates DSA problems using AI Gateway based on pattern and difficulty.
 * @param {string} pattern - DSA pattern (e.g., "Sliding Window")
 * @param {number} count - Number of problems (1-10)
 * @param {string} difficulty - Difficulty level (Easy, Medium, Hard)
 * @returns {Promise<Array>} - Array of generated problems
 */
export async function generateDSAProblems(pattern, count, difficulty) {
  const prompt = `
Generate ${count} LeetCode-style coding problems for the DSA pattern: "${pattern}".
Difficulty Level: ${difficulty}

For each problem, provide:
1. Title
2. Description (clear and concise)
3. Constraints
4. Input format and Output format
5. Sample input and Sample output
6. 5 test cases (including edge cases)
7. Starter code in JavaScript, Java, and Python.

STRICT INSTRUCTIONS:
- Return ONLY a valid JSON array of objects.
- Do NOT include markdown code blocks, pre-amble, or post-amble.
- Structure for each object:
  {
    "title": "Problem Title",
    "description": "Full problem description",
    "constraints": "Constraints text",
    "input_format": "Input format description",
    "output_format": "Output format description",
    "sample_input": "Input for example",
    "sample_output": "Output for example",
    "test_cases": [
      { "input": "input string", "expected_output": "output string" }
    ],
    "method_name": "actualMethodName",
    "runner_logic": {
        "javascript": "// Logic to parse stdin string (could be JSON array) and call solution()",
        "python": "# Logic to parse stdin string (json.loads if array) and call Solution().method()",
        "java": "// Logic to parse stdin (e.g., String to int[]) and call sol.method()"
    },
    "starter_code": {
        "javascript": "function solution(nums) {\\n\\n}",
        "java": "class Solution {\\n    public int methodName(int[] nums) {\\n\\n    }\\n}",
        "python": "class Solution:\\n    def methodName(self, nums: List[int]) -> int:\\n"
    }
  }

STRICT PARSING RULES:
- The input from STDIN could be a JSON array (e.g., "[1,2,3]") OR a raw string (e.g., "0P" or " ").
- YOU MUST HANDLE BOTH GRACEFULLY using try-catch or safe parsing.
- In JavaScript: \`let input; try { input = JSON.parse(str); } catch { input = str; }\`
- In Python: \`import json; try: input_data = json.loads(str) except: input_data = str\`
- In Java: Check if the string starts with '[' before parsing as an array, otherwise treat as a String.
- THE RUNNER LOGIC MUST EXPLICITLY PRINT THE RESULT TO STDOUT.
- THE STARTER CODE MUST BE AN EMPTY SKELETON ONLY. DO NOT PROVIDE THE SOLUTION, ONLY THE METHOD SIGNATURE AND CLASS STRUCTURE.
`;

  try {
    const raw = await executeAIGateway({
      prompt,
      provider: "gemini",
      model: "models/gemini-flash-latest",
      temperature: 0.3,
      maxTokens: 6000,
      jsonMode: true,
    });

    function extractJSON(text) {
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("No JSON array returned from AI Gateway");
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        const braceMatch = text.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          const parsed = JSON.parse(braceMatch[0]);
          return Array.isArray(parsed)
            ? parsed
            : parsed.problems || (parsed.count ? [parsed] : []);
        }
        throw e;
      }
    }

    return extractJSON(raw);
  } catch (error) {
    logger.error("AI Gateway Problem Generation Error", { error: error.message });
    throw new Error("Failed to generate problems: " + error.message);
  }
}
