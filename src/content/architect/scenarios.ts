import type { ScenarioSim, Decision } from '../types'
import { sampleQuestions } from './sampleQuestions'
import { examScenarios } from './examTrack'

// Turn an official sample question into a scenario decision point (verbatim).
function decisionFromQuestion(qid: string): Decision {
  const q = sampleQuestions.find((x) => x.id === qid)!
  return {
    id: `dec-${qid}`,
    prompt: q.question,
    options: q.options,
    correct: q.correct,
    reveal: q.explanation,
    fromOfficialQuestion: qid,
  }
}

function ctx(num: number): string {
  return examScenarios.find((s) => s.num === num)!.context
}

export const scenarioSims: ScenarioSim[] = [
  {
    id: 's1',
    num: 1,
    title: 'Customer Support Resolution Agent',
    context: ctx(1),
    primaryDomains: ['d1', 'd2', 'd5'],
    decisions: [
      decisionFromQuestion('q1'),
      decisionFromQuestion('q2'),
      decisionFromQuestion('q3'),
    ],
  },
  {
    id: 's2',
    num: 2,
    title: 'Code Generation with Claude Code',
    context: ctx(2),
    primaryDomains: ['d3', 'd5'],
    decisions: [
      decisionFromQuestion('q4'),
      decisionFromQuestion('q5'),
      decisionFromQuestion('q6'),
    ],
  },
  {
    id: 's3',
    num: 3,
    title: 'Multi-Agent Research System',
    context: ctx(3),
    primaryDomains: ['d1', 'd2', 'd5'],
    decisions: [
      decisionFromQuestion('q7'),
      decisionFromQuestion('q8'),
      decisionFromQuestion('q9'),
    ],
  },
  {
    id: 's4',
    num: 4,
    title: 'Developer Productivity with Claude',
    context: ctx(4),
    primaryDomains: ['d2', 'd3', 'd1'],
    // No official sample questions for this scenario — these decisions are authored
    // ("Practice — not from the official guide") and grounded in the task statements.
    decisions: [
      {
        id: 's4-d1',
        prompt:
          'Practice — not from the official guide. An engineer asks the agent to "find every caller of the deprecated formatLegacyDate function across this large codebase." What is the most effective first move?',
        options: [
          { key: 'A', text: 'Use Grep to search file contents for "formatLegacyDate" across the codebase, then Read the hits to follow usage.' },
          { key: 'B', text: 'Use Glob to list every *.ts file, then Read all of them in full to look for the function.' },
          { key: 'C', text: 'Use Edit to rename the function and let the type checker surface every call site.' },
          { key: 'D', text: 'Read the entire repository into context up front, then reason about callers.' },
        ],
        correct: 'A',
        reveal:
          'Grep searches file contents for patterns like function names — exactly the tool for finding callers — and you follow hits incrementally with Read rather than loading everything up front. Glob matches file paths, not contents (B); editing/renaming first (C) is destructive and premature; reading the whole repo (D) exhausts context. Build understanding incrementally: Grep to entry points, then Read to trace.',
      },
      {
        id: 's4-d2',
        prompt:
          'Practice — not from the official guide. The agent keeps preferring the built-in Grep over a more capable custom MCP code-intelligence tool that returns symbol references with types. How do you steer it toward the MCP tool?',
        options: [
          { key: 'A', text: 'Enhance the MCP tool’s description to explain its capabilities and richer outputs in detail.' },
          { key: 'B', text: 'Remove the built-in Grep tool entirely so only the MCP tool remains.' },
          { key: 'C', text: 'Add a system-prompt rule: "always use MCP tools, never built-ins."' },
          { key: 'D', text: 'Lower the temperature so the model picks tools more deterministically.' },
        ],
        correct: 'A',
        reveal:
          'Tool selection is driven by descriptions; a richly described MCP tool will be preferred over a built-in when it’s genuinely more capable. Stripping built-ins (B) removes useful general tools; a blunt system-prompt rule (C) is brittle and can misroute; temperature (D) doesn’t address selection quality.',
      },
      {
        id: 's4-d3',
        prompt:
          'Practice — not from the official guide. An engineer wants the agent to "add comprehensive tests to a large legacy module" — an open-ended task with unknown structure. Which decomposition strategy fits best?',
        options: [
          { key: 'A', text: 'Dynamic/adaptive decomposition: map structure first, identify high-impact areas, then build a prioritized plan that adapts as dependencies surface.' },
          { key: 'B', text: 'A fixed sequential pipeline written in full before any exploration.' },
          { key: 'C', text: 'Generate one giant test file in a single pass to maximize coverage quickly.' },
          { key: 'D', text: 'Skip planning and let direct execution reveal what to test.' },
        ],
        correct: 'A',
        reveal:
          'Open-ended tasks call for adaptive decomposition: map structure, find high-impact areas, then plan in a way that adapts as dependencies are discovered. A rigid fixed pipeline (B) assumes knowledge you don’t yet have; a single giant pass (C) dilutes attention; skipping planning (D) risks rework on a large legacy module.',
      },
    ],
  },
  {
    id: 's5',
    num: 5,
    title: 'Claude Code for Continuous Integration',
    context: ctx(5),
    primaryDomains: ['d3', 'd4'],
    decisions: [
      decisionFromQuestion('q10'),
      decisionFromQuestion('q11'),
      decisionFromQuestion('q12'),
    ],
  },
  {
    id: 's6',
    num: 6,
    title: 'Structured Data Extraction',
    context: ctx(6),
    primaryDomains: ['d4', 'd5'],
    // No official sample questions for this scenario — authored, source-grounded.
    decisions: [
      {
        id: 's6-d1',
        prompt:
          'Practice — not from the official guide. You need guaranteed schema-compliant output and the document type is unknown, so you have several candidate extraction schemas. Which configuration best guarantees structured output?',
        options: [
          { key: 'A', text: 'Provide all extraction tools and set tool_choice: "any" so the model must call one of them.' },
          { key: 'B', text: 'Set tool_choice: "auto" and hope the model picks a tool.' },
          { key: 'C', text: 'Force one specific schema with tool_choice: {"type":"tool","name":...} regardless of document type.' },
          { key: 'D', text: 'Ask for JSON in the prompt and parse it with json.loads.' },
        ],
        correct: 'A',
        reveal:
          'tool_choice: "any" forces the model to call some tool — guaranteeing structured output when multiple schemas exist and the document type is unknown. "auto" (B) may return plain text; forcing one specific schema (C) is wrong when the type is unknown; and prompt-only JSON (D) doesn’t guarantee schema compliance.',
      },
      {
        id: 's6-d2',
        prompt:
          'Practice — not from the official guide. A validation step flags that the extracted line items don’t sum to the stated total. The tool_use schema already guarantees valid JSON syntax. What kind of error is this, and what’s the right response?',
        options: [
          { key: 'A', text: 'A semantic error — extract calculated_total alongside stated_total and flag the discrepancy (and/or retry with the specific error fed back).' },
          { key: 'B', text: 'A JSON syntax error — switch from tool_use to prompt-based JSON.' },
          { key: 'C', text: 'A transport error — retry the request unchanged a few times.' },
          { key: 'D', text: 'A schema error — mark every numeric field as required.' },
        ],
        correct: 'A',
        reveal:
          'Tool_use eliminates JSON syntax errors but not semantic ones like values that don’t sum. Capture calculated_total alongside stated_total to surface the discrepancy, and retry with the specific validation error fed back. It isn’t a syntax (B), transport (C), or required-field (D) problem.',
      },
      {
        id: 's6-d3',
        prompt:
          'Practice — not from the official guide. A required "supplier_tax_id" is missing because the value simply isn’t present in the source document. Will a validation-retry loop fix it?',
        options: [
          { key: 'A', text: 'No — retries fix format/structural errors, but cannot conjure information absent from the source; make the field nullable and/or route to human review.' },
          { key: 'B', text: 'Yes — retry with higher temperature until the model finds it.' },
          { key: 'C', text: 'Yes — retries always succeed eventually if you append the error each time.' },
          { key: 'D', text: 'No — but switching to a larger model will extract the missing value.' },
        ],
        correct: 'A',
        reveal:
          'Retries help with format mismatches and structural output errors, but they cannot produce information that isn’t in the source. The right move is to make the field nullable so the model returns null honestly, and route such cases to human review — not to retry endlessly (B, C) or assume a bigger model can read data that isn’t there (D).',
      },
    ],
  },
]

export function scenarioById(id: string): ScenarioSim | undefined {
  return scenarioSims.find((s) => s.id === id)
}
