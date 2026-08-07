import type { Domain, ExamScenario, Exercise } from '../types'

// Exam metadata from Claude Certified Developer – Foundations Exam Guide
// Version 1.0 · Effective July 2026 · Exam code: CCDV-F
export const examMeta = {
  title: 'Claude Certified Developer – Foundations',
  format:
    'Multiple-choice and multiple-response items; each item states how many responses to select.',
  scoring:
    'Scaled score 100–1,000. Minimum passing score is 720. Pass/fail designation against a standard set by subject-matter experts. Unanswered questions are scored as incorrect; there is no penalty for guessing. Score report includes percent-correct by domain.',
  scenarioNote:
    'Unlike the Architect exam, Developer Foundations does not use a fixed scenario bank. Items stand alone; some may include short vignettes within the question stem.',
  version: 'Version 1.0 — Effective July 2026 · Exam code CCDV-F',
}

export const domains: Domain[] = [
  {
    id: 'd1',
    num: 1,
    title: 'Agents and Workflows',
    weight: 14.7,
    blurb:
      'Agent and workflow architecture, constructing Claude agents (Agent SDK, custom loops, hosted vs self-hosted), and common agent patterns and frameworks.',
    tasks: [
      {
        id: 't1.1',
        title: 'Agent Architecture',
        knowledge: [
          'Principles, patterns, and tradeoffs of agent and workflow architecture',
          'Decision criteria for using a workflow versus an agent',
          'Structure of manager/supervisor hierarchies',
          'Role of subagents in improving task execution',
        ],
        skills: [
          'Choosing workflow vs agent architectures for a given task',
          'Designing manager/supervisor hierarchies and subagent roles',
        ],
        explanation:
          'Skill weight ~4.5% of the overall exam. Focus on when a deterministic workflow beats an open-ended agent, how supervisor hierarchies route work, and why isolated subagents improve focus and context hygiene.',
      },
      {
        id: 't1.2',
        title: 'Agent Construction with Claude',
        knowledge: [
          'Claude Agent SDK capabilities for constructing agents',
          'Custom agent loops and harnesses',
          'Managed agent deployment models (self-hosted vs Anthropic-hosted)',
          'Hooks for deterministic actions',
        ],
        skills: [
          'Building agents with the Claude Agent SDK or a custom harness',
          'Selecting self-hosted versus hosted deployment models',
          'Using hooks for deterministic guardrails and side effects',
        ],
        explanation:
          'Skill weight ~5.3%. Know how to assemble an agent (SDK or custom loop), when to host with Anthropic vs yourself, and how hooks provide deterministic behavior prompts cannot guarantee.',
      },
      {
        id: 't1.3',
        title: 'Agent Patterns and Frameworks',
        knowledge: [
          'Common agent design patterns: tool-use loops, sub-agents, memory, context-window management',
          'Agentic abstraction frameworks (e.g., Strands, LangGraph, PydanticAI) for multi-step tasks',
        ],
        skills: [
          'Applying tool-use loops, subagents, memory, and context-window patterns',
          'Selecting an agentic framework appropriate to the problem',
        ],
        explanation:
          'Skill weight ~4.9%. Map classic patterns (tool loop, subagents, memory, compaction) onto frameworks when they help — without treating any one framework as mandatory.',
      },
    ],
  },
  {
    id: 'd2',
    num: 2,
    title: 'Applications and Integration',
    weight: 33.1,
    blurb:
      'The largest domain. Requirements, systems life cycle, Claude API mechanics, software engineering foundations, application design across interfaces, and configuration management.',
    tasks: [
      {
        id: 't2.1',
        title: 'Understanding Requirements',
        knowledge: [
          'Functional and infrastructure requirements derived from business requirements and solution architecture',
        ],
        skills: [
          'Translating business needs into Claude application and infrastructure requirements',
        ],
        explanation: 'Skill weight ~3.4%. Bridge product requirements to concrete Claude integration choices.',
      },
      {
        id: 't2.2',
        title: 'Systems Life Cycle',
        knowledge: [
          'Systems life cycle management concepts and frameworks used to develop, implement, operate, and maintain IT systems',
        ],
        skills: [
          'Placing Claude features correctly across build, deploy, operate, and maintain phases',
        ],
        explanation: 'Skill weight ~2.8%. Treat Claude apps as production systems with a full life cycle, not one-off scripts.',
      },
      {
        id: 't2.3',
        title: 'Claude API Mechanics',
        knowledge: [
          'Messages, tools, streaming, vision, thinking, and caching behavior',
          'Invoking Claude through third-party vendors',
          'Messages API data access patterns',
          'Batch API use and tradeoffs between realtime and batch selection',
        ],
        skills: [
          'Choosing Messages vs Message Batches based on latency and cost',
          'Using streaming, tools, thinking, vision, and caching appropriately',
        ],
        explanation:
          'Skill weight ~6.8%. Core API surface area — especially the realtime vs Batch tradeoff tested in official Sample 1.',
      },
      {
        id: 't2.4',
        title: 'Software Engineering Foundations',
        knowledge: [
          'REST APIs, JSON, asynchronous programming, version control',
          'SDLC integration, code review, and small- and large-scale refactoring',
        ],
        skills: [
          'Integrating Claude calls into production codebases with sound engineering practice',
        ],
        explanation: 'Skill weight ~7.4%. Ordinary software craft applied to LLM integrations.',
      },
      {
        id: 't2.5',
        title: 'Claude Application Design',
        knowledge: [
          'How Claude interprets instructions across interfaces (Claude Code, Desktop, claude.ai, API, SDKs)',
          'Content boundaries, schema design, session hygiene, and plugin management',
        ],
        skills: [
          'Designing instruction placement, schemas, and session hygiene across Claude surfaces',
        ],
        explanation: 'Skill weight ~8.6%. Largest skill under Applications — design for the interface you ship on.',
      },
      {
        id: 't2.6',
        title: 'Configuration Management',
        knowledge: [
          'CLAUDE.md files, settings.json, model version pinning',
          'Prompt versioning and plugin dependencies',
        ],
        skills: [
          'Managing Claude configuration as versioned, reviewable artifacts',
        ],
        explanation: 'Skill weight ~4.1%. Pin models, version prompts, and treat CLAUDE.md / settings as config-as-code.',
      },
    ],
  },
  {
    id: 'd3',
    num: 3,
    title: 'Claude Code',
    weight: 3.1,
    blurb:
      'Operating Claude Code: Rules, Skills, Commands, Agents, Agent Memory, session management, headless/streaming/auto modes, CLAUDE.md hierarchy, repo init, and settings.json.',
    tasks: [
      {
        id: 't3.1',
        title: 'Claude Code Operation',
        knowledge: [
          'Core components: Rules, Skills, Commands, Agents, Agent Memory',
          'Features: session management, built-in and custom slash commands, headless mode, streaming mode, auto-mode',
          'CLAUDE.md hierarchy, repository initialization, and settings.json configuration',
        ],
        skills: [
          'Configuring and operating Claude Code for development workflows',
        ],
        explanation:
          'Entire domain is one skill (~3.1%). Know components and modes; remember Claude Code is a small slice of CCDV-F compared with Applications and Integration.',
      },
    ],
  },
  {
    id: 'd4',
    num: 4,
    title: 'Eval, Testing, and Debugging',
    weight: 2.6,
    blurb:
      'Debugging and error handling for Claude apps: error types, recovery strategies, trace analysis, and isolating failures between integration layer and model output.',
    tasks: [
      {
        id: 't4.1',
        title: 'Debugging and Error Handling',
        knowledge: [
          'Error type identification and recovery strategy selection',
          'Trace analysis to identify failure modes',
          'Problem origin isolation between the integration layer and model output',
        ],
        skills: [
          'Debugging Claude applications with traces and structured error handling',
        ],
        explanation: 'Skill weight ~2.6%. Separate “bad glue code” from “bad model output” before changing prompts or models.',
      },
    ],
  },
  {
    id: 'd5',
    num: 5,
    title: 'Model Selection and Optimization',
    weight: 16.8,
    blurb:
      'LLM fundamentals, technical foundations for SDK/API work, Opus/Sonnet/Haiku tradeoffs, and token/cost management including caching.',
    tasks: [
      {
        id: 't5.1',
        title: 'LLM Fundamentals',
        knowledge: [
          'Tokens, context windows, sampling, non-determinism, next-token generation',
          'Model options: fast mode, extended thinking, adaptive thinking, effort levels',
          'Fundamental prompting techniques: zero-shot, single-shot, multi-shot',
        ],
        skills: [
          'Explaining LLM behavior and selecting prompting modes for a task',
        ],
        explanation: 'Skill weight ~5.2%. Grounding for every other domain.',
      },
      {
        id: 't5.2',
        title: 'Technical Fundamentals',
        knowledge: [
          'Integrating with SDKs that wrap REST APIs and websockets',
          'Foundational engineering practices supporting AI application development',
        ],
        skills: [
          'Working with Claude client SDKs and underlying HTTP/streaming transports',
        ],
        explanation: 'Skill weight ~6.1%. SDK-over-REST fluency for production integrations.',
      },
      {
        id: 't5.3',
        title: 'Model Selection and Tradeoffs',
        knowledge: [
          'Claude model capabilities (Opus vs Sonnet vs Haiku use cases, adaptive thinking support)',
          'Tradeoffs across quality/latency/cost parameters',
          'Breaking behavior changes across model releases',
        ],
        skills: [
          'Selecting models for tasks given quality, latency, and cost constraints',
        ],
        explanation: 'Skill weight ~2.7%. Match tier to job; watch for release breaking changes.',
      },
      {
        id: 't5.4',
        title: 'Cost and Token Management',
        knowledge: [
          'Token usage tracking and cost modeling',
          'Caching techniques (prompt caching, cache check-pointing) for cost optimization',
        ],
        skills: [
          'Budgeting tokens and applying caching/batch patterns to control cost',
        ],
        explanation: 'Skill weight ~2.8%. Measure usage; use caching and batch where latency allows.',
      },
    ],
  },
  {
    id: 'd6',
    num: 6,
    title: 'Prompt and Context Engineering',
    weight: 11.0,
    blurb:
      'Context/memory management, prompt engineering principles, and patterns for producing and validating structured output.',
    tasks: [
      {
        id: 't6.1',
        title: 'Context Engineering',
        knowledge: [
          'Context window management',
          'Prevention of context drift and bloat (tool output pruning, compaction)',
          'Context isolation through subagents or multi-step agentic workflows',
        ],
        skills: [
          'Keeping context lean and isolating noisy work into subagents',
        ],
        explanation: 'Skill weight ~3.8%. Prune tool output, compact, and isolate — don’t dump everything into one window.',
      },
      {
        id: 't6.2',
        title: 'Prompt Engineering',
        knowledge: [
          'Instruction clarity, few-shot examples, system versus user placement',
          'Output constraints, prompt placement across components, iterative refinement',
          'Input sanitization when writing and iterating on prompts',
        ],
        skills: [
          'Writing and iterating prompts with clear instructions and appropriate examples',
        ],
        explanation: 'Skill weight ~4.6%. Classic prompt craft plus where instructions live across the stack.',
      },
      {
        id: 't6.3',
        title: 'Output Handling',
        knowledge: [
          'Structured output patterns, response validation, defensive parsing',
          'Skepticism toward confident but incorrect output',
        ],
        skills: [
          'Validating and defensively consuming Claude outputs before downstream use',
        ],
        explanation: 'Skill weight ~2.6%. Never trust free-form JSON blindly — validate, parse defensively, verify.',
      },
    ],
  },
  {
    id: 'd7',
    num: 7,
    title: 'Security and Safety',
    weight: 8.1,
    blurb:
      'Prompt injection and data protection, guardrails and secure-by-design deployment, Claude hooks for safety, and secrets/key management.',
    tasks: [
      {
        id: 't7.1',
        title: 'AI Application Security',
        knowledge: [
          'Prompt injection awareness and mitigation, jailbreak defense',
          'Untrusted input handling, data leakage prevention, PII handling',
          'Authentication, authorization, confidentiality, privacy, and integrity',
        ],
        skills: [
          'Isolating untrusted content and defending against injection and data leakage',
        ],
        explanation:
          'Skill weight ~3.2%. Official Sample 2: treat retrieved user content as untrusted and enforce least-privilege controls.',
      },
      {
        id: 't7.2',
        title: 'Guardrails and Safe Deployment',
        knowledge: [
          'Content policy and guardrail layering',
          'Secure-by-design principles: privacy, identity and access management, least privilege',
        ],
        skills: [
          'Layering guardrails for safe production deployment',
        ],
        explanation: 'Skill weight ~2.3%. Defense in depth — policy + technical controls + least privilege.',
      },
      {
        id: 't7.3',
        title: 'Claude Hooks',
        knowledge: [
          'Using hooks for guardrails and safety controls to prevent destructive actions',
        ],
        skills: [
          'Implementing hooks that block or redirect unsafe tool calls',
        ],
        explanation: 'Skill weight ~1.0%. Hooks give deterministic safety prompts cannot.',
      },
      {
        id: 't7.4',
        title: 'Identity, Secrets, and Key Management',
        knowledge: [
          'Managing secrets, credentials, and API keys across development and production',
          'Identity validation, access approval, and authorized access monitoring',
        ],
        skills: [
          'Handling Claude credentials and identity safely across environments',
        ],
        explanation: 'Skill weight ~1.6%. Keys and identity are part of the security domain, not an afterthought.',
      },
    ],
  },
  {
    id: 'd8',
    num: 8,
    title: 'Tools and MCPs',
    weight: 10.6,
    blurb:
      'Tool implementation and function calling, MCP server development, and tradeoffs among built-in tools, custom tools, Skills, and MCPs.',
    tasks: [
      {
        id: 't8.1',
        title: 'Tool Implementation',
        knowledge: [
          'Tool use and function calling, configuration for external system interaction',
          'Tool description writing, error handling',
          'Usage patterns: agentic harness dispatch, client-side vs server-side tools, approval patterns',
          'Tool set construction best practices',
        ],
        skills: [
          'Designing and implementing tools Claude can call reliably',
        ],
        explanation: 'Skill weight ~4.4%. Descriptions, errors, and approval patterns drive tool reliability.',
      },
      {
        id: 't8.2',
        title: 'MCP Server Development',
        knowledge: [
          'Server authoring, deployment, and integration with Claude applications',
          'MCP resources, tools, and prompts',
          'Communication patterns (stdio, sockets, client vs server)',
        ],
        skills: [
          'Building MCP servers that expose reusable tools and resources',
        ],
        explanation:
          'Skill weight ~2.1%. Official Sample 3: MCP servers make internal APIs reusable across Claude apps.',
      },
      {
        id: 't8.3',
        title: 'Agentic Customization',
        knowledge: [
          'Tradeoffs among built-in Tools, custom Tools, Skills, and MCPs',
        ],
        skills: [
          'Selecting built-in tools vs custom tools vs Skills vs MCP for a use case',
        ],
        explanation: 'Skill weight ~4.1%. Pick the lightest mechanism that meets reuse and maintenance needs.',
      },
    ],
  },
]

/** Developer exam has no official scenario bank. */
export const examScenarios: ExamScenario[] = []

export const exercises: Exercise[] = [
  {
    id: 'e1',
    num: 1,
    title: 'Ship a Batch + Realtime Integration',
    objective:
      'Practice choosing Message Batches vs realtime Messages API and wiring both into application code.',
    steps: [
      'Define a workload that must finish overnight at minimum cost (large document set, non-urgent analytics).',
      'Implement submission via the Message Batches API with custom_id correlation and polling for completion.',
      'Contrast with a realtime path for interactive user requests; document when each path applies.',
      'Add basic cost/token logging for both paths.',
    ],
    domains: ['d2', 'd5'],
  },
  {
    id: 'e2',
    num: 2,
    title: 'Defend Against Prompt Injection',
    objective:
      'Practice isolating untrusted content and enforcing least-privilege tool access.',
    steps: [
      'Build a summarizer that accepts user-submitted URLs or pasted page text.',
      'Keep retrieved content separate from system instructions; never concatenate untrusted text into the system prompt.',
      'Add a hook or guardrail that blocks sensitive tools when the only trigger is untrusted content.',
      'Test with a page that contains hidden “ignore previous instructions” text and verify the system prompt is not revealed and tools are not abused.',
    ],
    domains: ['d7'],
  },
  {
    id: 'e3',
    num: 3,
    title: 'Expose an Internal API via MCP',
    objective:
      'Practice packaging a REST service as a reusable MCP server for multiple Claude apps.',
    steps: [
      'Pick a simple internal REST API (inventory, tickets, or docs search).',
      'Author an MCP server that exposes operations as tools with clear descriptions and structured errors.',
      'Connect two different Claude clients/apps to the same server.',
      'Document why MCP beats hard-coding logic into each system prompt or pasting static data into context.',
    ],
    domains: ['d8', 'd2'],
  },
]

export const reference = {
  technologies: [
    {
      name: 'Claude API / Messages API',
      detail:
        'Messages, tools, streaming, vision, thinking, caching; realtime vs Message Batches tradeoffs; third-party vendor invocation',
    },
    {
      name: 'Message Batches API',
      detail: 'Latency-tolerant high-volume workloads, reduced cost, ~24-hour processing window, custom_id correlation',
    },
    {
      name: 'Claude Agent SDK',
      detail: 'Agent construction, custom loops/harnesses, hooks, managed vs self-hosted deployment',
    },
    {
      name: 'Claude Code',
      detail:
        'Rules, Skills, Commands, Agents, Agent Memory, CLAUDE.md hierarchy, settings.json, headless/streaming/auto modes, slash commands',
    },
    {
      name: 'Model Context Protocol (MCP)',
      detail: 'Servers exposing tools/resources/prompts; stdio and socket transports; reusable across Claude applications',
    },
    {
      name: 'Prompt & context engineering',
      detail: 'Instruction placement, few-shot, compaction, tool-output pruning, subagent isolation, structured output validation',
    },
    {
      name: 'Security controls',
      detail: 'Untrusted input isolation, prompt-injection defense, guardrail layering, hooks, secrets and key management',
    },
  ],
  inScope: [
    'Building agents and workflows with the Claude Agent SDK, custom loops, and agentic frameworks',
    'Integrating Claude via API/SDKs including streaming, tools, batch, caching, and multi-format input',
    'Operating Claude Code (Rules, Skills, Commands, Agents, CLAUDE.md, settings.json)',
    'Prompt and context engineering to control behavior and prevent context drift/bloat',
    'Designing evals, debugging via traces, validating structured output, monitoring quality',
    'Model tier selection and token/cost optimization (including prompt caching)',
    'Secure-by-design practices, injection defense, hooks, and secrets management',
    'Custom tools, function schemas, MCP servers, and tradeoffs vs built-in tools and Skills',
  ],
  outOfScope: [
    'Fine-tuning Claude or training custom models',
    'Non-technical / casual Claude usage without application development responsibility',
    'Roles limited solely to prompt writing without broader integration ownership',
    'Exam content from other credentials (Associate, Architect Foundations/Professional) beyond shared fundamentals',
  ],
}
