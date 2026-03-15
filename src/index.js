const core = require('@actions/core');
const fs = require('fs');
const PROMPT = `You are a Code Complexity Analyzer. Your task is to analyze code snippets and calculate their cyclomatic complexity, highlighting areas that could benefit from simplification.

**Input:**

{code}

**Instructions:**

1.  **Language Identification:** Identify the programming language of the input code.
2.  **Cyclomatic Complexity Calculation:** Calculate the cyclomatic complexity of the code. This can be done by counting the number of linearly independent paths through the code.  Consider the following control flow statements as contributing to complexity:
    *   'if', 'else if', 'else'
    *   'for', 'while', 'do-while'
    *   'switch', 'case', 'default'
    *   'catch', 'finally'
    *   Boolean operators ('&&', '||', '!')
    *   Ternary operators ('? :')
    *   'goto' (if present and relevant to the language)
3.  **Report Generation:** Generate a report that includes:
    *   **Language:** The identified programming language.
    *   **Cyclomatic Complexity:** The calculated cyclomatic complexity score.
    *   **Analysis:** A breakdown of the code, highlighting specific areas (lines or code blocks) that contribute significantly to the complexity. Explain *why* these areas are complex (e.g., deeply nested 'if' statements, long chains of boolean operators).
    *   **Recommendations:** Provide specific recommendations for simplifying the code. This might include:
        *   Refactoring complex conditional statements.
        *   Breaking down large functions into smaller, more manageable functions.
        *   Using design patterns to reduce complexity.
        *   Simplifying boolean expressions.
        *   Removing redundant code.
4.  **Output Format:** Present the report in a clear and organized manner. Use headings and bullet points to improve readability.

**Example Output Format:**

## Code Complexity Analysis

**Language:** {programming_language}

**Cyclomatic Complexity:** {complexity_score}

**Analysis:**

*   **Line(s) {line_numbers}:** This section `;
async function run() {
  try {
    const key = core.getInput('gemini_api_key');
    const token = core.getInput('service_token');
    const ctx = { repoName: process.env.GITHUB_REPOSITORY || '', event: process.env.GITHUB_EVENT_NAME || '' };
    try { Object.assign(ctx, JSON.parse(fs.readFileSync('package.json', 'utf8'))); } catch {}
    let prompt = PROMPT;
    for (const [k, v] of Object.entries(ctx)) prompt = prompt.replace(new RegExp('{' + k + '}', 'g'), String(v || ''));
    let result;
    if (key) {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 2000 } })
      });
      result = (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (token) {
      const r = await fetch('https://action-factory.walshd1.workers.dev/generate/code-complexity-analyzer', {
        method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(ctx)
      });
      result = (await r.json()).content || '';
    } else throw new Error('Need gemini_api_key or service_token');
    console.log(result);
    core.setOutput('result', result);
  } catch (e) { core.setFailed(e.message); }
}
run();
