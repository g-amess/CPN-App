import type { PracticeQuestion } from '../types'

/**
 * Seed practice items grounded in module checkpoints / quiz stems.
 * Official sample questions live in sampleQuestions.ts.
 */
export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'dp1',
    source: 'practice',
    track: 'build',
    domainId: 'd5',
    question:
      'A teammate says two identical prompts must return identical text. What is the most accurate response?',
    options: [
      { key: 'A', text: 'That is true — the model is deterministic.' },
      {
        key: 'B',
        text: 'Not necessarily — the model samples each next token, so wording can vary even when both answers are correct.',
      },
      { key: 'C', text: 'That is only true if streaming is off.' },
      { key: 'D', text: 'That is only true on the largest model.' },
    ],
    correct: 'B',
    explanation:
      'Generation samples from a probability distribution. Even temperature 0 improves repeatability without guaranteeing identical strings. Assert on properties or use evals.',
  },
  {
    id: 'dp2',
    source: 'practice',
    track: 'build',
    domainId: 'd5',
    question: 'Which statement best separates model choice from reasoning mode?',
    options: [
      { key: 'A', text: 'They are the same setting.' },
      { key: 'B', text: 'Extended thinking is a different model.' },
      {
        key: 'C',
        text: 'Model choice picks which family member runs; reasoning/thinking is a per-call setting on supporting models.',
      },
      { key: 'D', text: 'Reasoning mode is fixed per account.' },
    ],
    correct: 'C',
    explanation:
      'Pick the model for cost/latency/capability. Separately enable and calibrate thinking per request. The two levers compose.',
  },
  {
    id: 'dp3',
    source: 'practice',
    track: 'build',
    domainId: 'd6',
    question:
      'A short, well-specified classification task returns the right answer zero-shot. What does adding three examples most likely do?',
    options: [
      { key: 'A', text: 'Improve accuracy substantially.' },
      { key: 'B', text: 'Add token cost on every call for little or no gain.' },
      { key: 'C', text: 'Change the model being used.' },
      { key: 'D', text: 'Disable sampling.' },
    ],
    correct: 'B',
    explanation:
      'Examples cost tokens on every call. If zero-shot already meets the eval, extra shots usually buy cost without quality.',
  },
  {
    id: 'dp4',
    source: 'practice',
    track: 'build',
    domainId: 'd2',
    question: 'You must process thousands of inputs offline at the lowest cost. Which shape fits?',
    options: [
      { key: 'A', text: 'Synchronous calls in a loop.' },
      { key: 'B', text: 'Streaming.' },
      { key: 'C', text: 'Batch submission with polling.' },
      { key: 'D', text: 'A larger context window.' },
    ],
    correct: 'C',
    explanation:
      'Message Batches are for bulk offline workloads: submit, poll, accept longer latency for lower per-token cost. Streaming helps interactive UX, not overnight bulk.',
  },
  {
    id: 'dp5',
    source: 'practice',
    track: 'build',
    domainId: 'd6',
    question:
      'A long multi-turn agent session keeps failing after it worked in testing. What is the most likely budget at fault?',
    options: [
      { key: 'A', text: 'Temperature — lower it as the session grows.' },
      {
        key: 'B',
        text: 'The context window — history and tool results fill a fixed token budget until input is rejected or output truncates with model_context_window_exceeded.',
      },
      { key: 'C', text: 'There is no fixed budget; the window expands automatically.' },
      { key: 'D', text: 'The model silently drops oldest turns, so no application action is needed.' },
    ],
    correct: 'B',
    explanation:
      'The application must trim or summarize. The model does not auto-expand the window or silently drop history without consequence.',
  },
  {
    id: 'dp6',
    source: 'practice',
    track: 'exam',
    domainId: 'd8',
    question:
      'Claude keeps calling the wrong tool even though both tools are listed. What should you fix first?',
    options: [
      { key: 'A', text: 'Raise temperature so the model explores more tools.' },
      {
        key: 'B',
        text: 'Rewrite the tool descriptions so each one’s purpose and when-to-use criteria are unambiguous.',
      },
      { key: 'C', text: 'Remove stop_reason handling from the loop.' },
      { key: 'D', text: 'Switch to Message Batches for every tool call.' },
    ],
    correct: 'B',
    explanation:
      'The description is the primary selection signal. Overlapping or vague descriptions cause mis-routing; sampling and batch APIs do not fix schema clarity.',
  },
  {
    id: 'dp7',
    source: 'practice',
    track: 'exam',
    domainId: 'd7',
    question:
      'An agent fetches a web page and then tries to exfiltrate secrets from the system prompt. What is the primary mitigation?',
    options: [
      { key: 'A', text: 'Trust fetched content because it came from HTTPS.' },
      {
        key: 'B',
        text: 'Treat fetched content as untrusted data (not instructions), scope tools, and gate dangerous actions.',
      },
      { key: 'C', text: 'Disable evals so the judge cannot be poisoned.' },
      { key: 'D', text: 'Pin a model alias instead of a full model ID.' },
    ],
    correct: 'B',
    explanation:
      'Prompt injection arrives inside untrusted content. Defend with data-vs-instructions separation, least-privilege tools, and HITL on consequential actions.',
  },
  {
    id: 'dp8',
    source: 'practice',
    track: 'exam',
    domainId: 'd2',
    question:
      'Production broke overnight after “no code changes.” Logs show the model string still says sonnet. What likely happened?',
    options: [
      { key: 'A', text: 'Streaming was enabled by default.' },
      {
        key: 'B',
        text: 'An alias resolved to a new recommended model version — pin a full model ID and keep the prior version for rollback.',
      },
      { key: 'C', text: 'Temperature 0 guarantees identical outputs forever.' },
      { key: 'D', text: 'Message Batches automatically upgraded the model.' },
    ],
    correct: 'B',
    explanation:
      'Aliases move. Pinning a specific model version makes upgrades deliberate and preserves a rollback path.',
  },
]
