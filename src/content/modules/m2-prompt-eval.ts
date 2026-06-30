import type { BuildModule } from '../types'

export const m2: BuildModule = {
  id: 'm2',
  title: 'Prompt Engineering & Evaluation',
  blurb:
    'Treat prompts like code: measure them with evals, then improve them systematically with clear instructions, specificity, XML structure, and examples.',
  lessons: [
    {
      id: 'prompt-evaluation',
      moduleId: 'm2',
      title: 'Prompt Evaluation',
      summary: 'Why you should score prompts objectively instead of eyeballing a couple of outputs.',
      body: `**Prompt engineering** is the craft of writing and editing prompts so Claude understands the request and produces the response you want. **Prompt evaluation** is the automated testing of those prompts using objective metrics.

After writing a prompt, there are three paths:

1. Test it once or twice, then ship it. *(a trap)*
2. Test with a few custom inputs, tweak for corner cases. *(still a trap)*
3. Run it through an **evaluation pipeline** for objective scoring. *(recommended)*

The takeaway: engineers chronically **under-test** prompts. An eval pipeline gives you an objective performance score *before* you iterate and deploy, so improvements are measured rather than guessed.

This mindset maps directly to the exam's emphasis on reducing false positives and validating extraction quality with measured criteria rather than vibes.`,
      keyTakeaways: [
        'Prompt evaluation = objective, automated scoring of prompts.',
        'Eyeballing a couple of outputs is the common trap; use a pipeline instead.',
        'Objective scores let you iterate with evidence, not guesswork.',
      ],
      examRelevance: [{ domainId: 'd4', taskId: 't4.6', label: 'Measured evaluation underpins review architectures' }],
    },
    {
      id: 'eval-workflow',
      moduleId: 'm2',
      title: 'A Typical Eval Workflow',
      summary: 'The 6-step loop: draft → dataset → variations → responses → grade → iterate.',
      body: `A typical eval workflow is a **6-step iterative loop** for improving a prompt.

1. **Write an initial prompt draft** — a baseline to optimize.
2. **Create an evaluation dataset** — a collection of test inputs. It can be 3 examples or thousands; hand-written or LLM-generated.
3. **Generate prompt variations** — interpolate each dataset input into your prompt template.
4. **Get LLM responses** — feed each variation to Claude and collect outputs.
5. **Grade responses** — score each output with a grader (e.g. 1–10), then average for an overall prompt score.
6. **Iterate** — modify the prompt based on scores and repeat, comparing versions.

There's **no single standard methodology** — many open-source and paid tools exist, but you can start simple with a custom implementation. The point is that objective scoring enables systematic A/B comparison between prompt versions.`,
      keyTakeaways: [
        'Six steps: draft → dataset → variations → responses → grade → iterate.',
        'Datasets can be tiny or huge, hand-written or generated.',
        'Averaged scores enable A/B comparison across prompt versions.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'The eval loop',
          code: `flowchart LR
  A[1. Draft prompt] --> B[2. Build dataset]
  B --> C[3. Generate variations]
  C --> D[4. Get responses]
  D --> E[5. Grade]
  E --> F[6. Iterate]
  F -->|new version| C`,
        },
      ],
      examRelevance: [{ domainId: 'd5', taskId: 't5.5', label: 'Labeled validation sets calibrate review thresholds' }],
    },
    {
      id: 'generating-datasets',
      moduleId: 'm2',
      title: 'Generating Test Datasets',
      summary: 'Build test cases by hand or have a fast model generate them.',
      body: `A custom evaluation needs a **test dataset**. You can assemble it manually or generate it automatically with Claude — and for generation, prefer a **faster, cheaper model like Haiku**.

A dataset is an array of JSON objects, each with a \`task\` property describing a user request. The generation process reuses the structured-data trick from the Foundations module:

1. Prompt Claude to create test cases.
2. Prefill the assistant message with \\\`\\\`\\\`json.
3. Set the stop sequence to \\\`\\\`\\\`.
4. Parse the response as JSON.
5. Save it to a \`dataset.json\` file.

A \`generate_dataset()\` function wraps this up: it sends the generation prompt, gets back structured JSON test tasks, and writes them to disk for later evaluation runs. The dataset then lets you measure performance consistency across many input scenarios.`,
      keyTakeaways: [
        'Datasets are arrays of JSON task objects.',
        'Generate them with a fast model (Haiku) using prefill + stop-sequence JSON.',
        'Persist to dataset.json for repeatable eval runs.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Generating a dataset',
          code: `def generate_dataset():
    messages = [
        {"role": "user", "content": "Generate 10 test tasks for an AWS code assistant as JSON."},
        {"role": "assistant", "content": "\`\`\`json"},
    ]
    resp = client.messages.create(model="claude-haiku-4-5",
        max_tokens=2000, messages=messages, stop_sequences=["\`\`\`"])
    dataset = json.loads(resp.content[0].text)
    with open("dataset.json", "w") as f:
        json.dump(dataset, f, indent=2)`,
        },
      ],
    },
    {
      id: 'running-the-eval',
      moduleId: 'm2',
      title: 'Running the Eval',
      summary: 'Three functions: run_prompt, run_test_case, run_eval.',
      body: `Running the eval means merging each test case with your prompt, sending it to Claude, and grading the output. A **test case** is one record from the dataset.

Three core functions structure this:

- **\`run_prompt\`** — merges a test case with the prompt, sends it to Claude, returns the output.
- **\`run_test_case\`** — calls \`run_prompt\`, grades the result, returns a summary dictionary.
- **\`run_eval\`** — loops through the dataset, calls \`run_test_case\` for each, and assembles all results.

A v1 prompt can be as basic as *"Please solve the following task: [task]"*. Early limitations are expected: no output-format instructions, a hardcoded score (e.g. \`score = 10\`), and verbose Claude responses. The output is an array of objects, each containing Claude's output, the original test case, and a score. The next step is to replace that hardcoded score with a real grading system.`,
      keyTakeaways: [
        'run_prompt → run_test_case → run_eval compose the pipeline.',
        'Start simple; a hardcoded score is a placeholder until grading exists.',
        'Output: per-case objects with the response, the test case, and a score.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Eval pipeline skeleton',
          code: `def run_prompt(test_case):
    prompt = f"Please solve the following task: {test_case['task']}"
    return chat([{"role": "user", "content": prompt}])

def run_test_case(test_case):
    output = run_prompt(test_case)
    score = grade(output, test_case)   # real grader replaces hardcoded 10
    return {"output": output, "test_case": test_case, "score": score}

def run_eval(dataset):
    return [run_test_case(tc) for tc in dataset]`,
        },
      ],
    },
    {
      id: 'model-based-grading',
      moduleId: 'm2',
      title: 'Model Based Grading',
      summary: 'Use a second Claude call to score outputs — flexible but needs structure.',
      body: `Grading turns model outputs into an objective signal — usually a numerical score (1–10, 10 = best). There are three grader types:

- **Code graders** — programmatic checks (length, word presence, syntax validation, readability).
- **Model graders** — an *additional* API call that evaluates the original output. Highly flexible for quality and instruction-following.
- **Human graders** — most flexible, but slow and tedious.

## Implementing a model grader

The important trick: **don't ask only for a score.** A bare "rate this 1–10" tends to default to middling numbers. Instead, prompt the grader to produce **strengths, weaknesses, reasoning, *and* a score**, returned as JSON (using the prefill + stop-sequence pattern). Parse out the score and reasoning, then average scores across test cases for your final metric.

Model graders are flexible but can be inconsistent — yet they still give an objective baseline for comparing prompt versions. This is the builder-side root of the exam's **independent review** idea: a separate evaluating call catches things the original generation misses.`,
      keyTakeaways: [
        'Three grader types: code, model, human.',
        'Ask the model grader for reasoning + score, not a bare number, to avoid middling defaults.',
        'Return JSON via prefill + stop sequence; average scores across cases.',
      ],
      examRelevance: [{ domainId: 'd4', taskId: 't4.6', label: 'Independent review beats self-review' }],
    },
    {
      id: 'code-based-grading',
      moduleId: 'm2',
      title: 'Code Based Grading',
      summary: 'Programmatic syntax validation for JSON, Python, and regex outputs.',
      body: `Code-based grading is automated validation for outputs that contain code, JSON, or regex. Three validators do the work:

- **\`validate_json()\`** — try to parse; return 10 if valid, 0 on error.
- **\`validate_python()\`** — try AST parsing; 10 if valid, 0 on error.
- **\`validate_regex()\`** — try to compile; 10 if valid, 0 on error.

To pick the right validator, the dataset must include a **\`format\`** key (JSON / Python / RegEx). You also tell the model to respond with **only** raw code/JSON/regex — no comments or commentary — using the prefill + stop-sequence pattern to extract clean output.

## Combining signals

A robust final score blends semantic and syntactic checks:

> **final = (model_score + syntax_score) / 2**

This measures both correctness (model grader) and technical validity (code grader). The limitation: code grading needs a *known expected format* to select the right validator. This is the conceptual seed of the exam's distinction between **schema syntax errors** (eliminated by validation/tool_use) and **semantic errors** (which syntax checks can't catch).`,
      keyTakeaways: [
        'Validators return 10/0 for valid/invalid JSON, Python, or regex.',
        'Dataset needs a format key to choose the validator.',
        'Blend model + syntax scores: (model_score + syntax_score) / 2.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Syntax validators',
          code: `import json, ast, re

def validate_json(text):
    try: json.loads(text); return 10
    except Exception: return 0

def validate_python(text):
    try: ast.parse(text); return 10
    except Exception: return 0

def validate_regex(text):
    try: re.compile(text); return 10
    except Exception: return 0`,
        },
      ],
      examRelevance: [{ domainId: 'd4', taskId: 't4.4', label: 'Syntax vs semantic validation errors' }],
    },
    {
      id: 'prompt-engineering',
      moduleId: 'm2',
      title: 'Prompt Engineering',
      summary: 'Apply techniques one at a time and re-measure after each.',
      body: `This is the hub lesson for the engineering techniques that follow. The method: start with a deliberately weak prompt, apply techniques **step by step**, and **re-evaluate after each** so you can see the gains.

The running example is generating a one-day meal plan for an athlete given height, weight, physical goal, and dietary restrictions. The eval pipeline is upgraded into a flexible evaluator class that supports concurrency (tune \`max_concurrent_tasks\` to your rate limits), a \`generate_dataset()\` method, and a \`run_prompt()\` that processes each case.

Key components:
- **\`prompt_input_spec\`** — defines the required prompt inputs.
- **\`extra_criteria\`** — additional requirements the model grader checks.
- **\`output.html\`** — a formatted report of per-case results and scores.

Expect a **poor initial score** (the lesson shows ~2.32 with a basic prompt on a weaker model). The next lessons — clear & direct, being specific, XML tags, examples — each push it higher.`,
      keyTakeaways: [
        'Apply one technique at a time and re-measure to attribute gains.',
        'A flexible evaluator class with concurrency speeds iteration.',
        'Initial scores are low by design; techniques improve them.',
      ],
    },
    {
      id: 'clear-and-direct',
      moduleId: 'm2',
      title: 'Being Clear and Direct',
      summary: 'Lead with an action verb and a precise task in the first line.',
      body: `**Being clear and direct** means using simple, direct language with an **action verb in the first line** to specify the exact task. The first line is the most important part of the prompt — it sets the foundation for the response.

The structure: **action verb + clear task description + output specification.**

Examples:
- "**Write** three paragraphs about how solar panels work"
- "**Identify** three countries that use geothermal energy and for each include generation stats"
- "**Generate** a one-day meal plan for an athlete that meets their dietary restrictions"

In the running meal-plan eval, simply making the instruction clear and direct moved the score from **2.32 to 3.92** — a meaningful jump from a tiny change.`,
      keyTakeaways: [
        'Start with an action verb; state the task and expected output explicitly.',
        'The first line carries the most weight.',
        'Clarity alone produced a measurable score gain (2.32 → 3.92).',
      ],
    },
    {
      id: 'being-specific',
      moduleId: 'm2',
      title: 'Being Specific',
      summary: 'Add attribute guidelines (Type A) and/or reasoning steps (Type B).',
      body: `**Being specific** means adding guidelines that direct the output. There are two types:

- **Type A — Attributes.** List the qualities you want in the output: length, structure, format. *Controls what the output looks like.*
- **Type B — Steps.** Provide specific steps for the model to follow in its reasoning. *Controls how the model arrives at the answer.*

When to use each:
- **Type A** — recommended for almost every prompt.
- **Type B** — for complex problems where you want the model to consider broader perspectives or viewpoints it might not naturally reach.

The two are often combined in professional prompts. In the running eval, adding guidelines jumped the score from **3.92 to 7.86** — the single biggest gain in the sequence, showing how much specificity matters.

On the exam this resurfaces as **explicit categorical criteria** beating vague instructions like "be conservative" for reducing false positives.`,
      keyTakeaways: [
        'Type A = attribute guidelines (what the output should be).',
        'Type B = step guidelines (how to reason).',
        'Type A almost always; Type B for complex reasoning. Combined: 3.92 → 7.86.',
      ],
      examRelevance: [{ domainId: 'd4', taskId: 't4.1', label: 'Explicit criteria reduce false positives' }],
    },
    {
      id: 'xml-tags',
      moduleId: 'm2',
      title: 'Structure with XML Tags',
      summary: 'Wrap interpolated content in descriptive XML tags so Claude knows its boundaries.',
      body: `**XML tags** organize and delineate different content sections within a prompt. When you interpolate large amounts of content, tags help the model distinguish between types of information and understand how text is grouped.

Wrap content in **descriptive, specific** tags — \`<sales_records>\`, \`<my_code>\`, \`<docs>\` — rather than dumping unstructured text or using a vague tag like \`<data>\`. For example, a debugging prompt that mixes code and documentation becomes far clearer when separated into \`<my_code>\` and \`<docs>\`.

The benefits: the structure becomes obvious to the model, content boundaries are unambiguous, and output quality improves — even for short content blocks. You can wrap even brief interpolated content (like \`<athlete_information>\`) to clarify that it's external input to consider.`,
      keyTakeaways: [
        'Use descriptive XML tags to mark content boundaries in prompts.',
        'Specific tag names beat generic ones (sales_records > data).',
        'Helps even for short content; reduces confusion about boundaries.',
      ],
      code: [
        {
          lang: 'text',
          title: 'Tagging interpolated content',
          code: `Debug the issue described in the docs using my code.

<my_code>
{code_here}
</my_code>

<docs>
{docs_here}
</docs>`,
        },
      ],
    },
    {
      id: 'providing-examples',
      moduleId: 'm2',
      title: 'Providing Examples',
      summary: 'One-shot / multi-shot prompting to lock in format and handle corner cases.',
      body: `**One-shot** prompting provides a single example; **multi-shot** provides several. Examples guide the model's behavior and are often the most effective technique when instructions alone produce inconsistent results.

## How to do it well

- Structure each example with **XML tags** containing a sample input and the ideal output, clearly separated from the actual prompt content.
- Add context for **corner cases** ("be especially careful with sarcasm").
- Include **reasoning** that explains *why* the output is ideal — this reinforces the desired characteristics.
- Use your **highest-scoring eval examples** as templates.
- Place examples **after** the main instructions/guidelines.

Common uses: corner-case handling (sarcasm detection), complex output formatting (specific JSON structures), and clarifying expected quality/style.

This is the most exam-relevant prompt technique: the guide repeatedly cites **2–4 targeted few-shot examples** that *show the reasoning* as the way to handle ambiguous cases, demonstrate output format, and reduce false positives while still generalizing to novel patterns.`,
      keyTakeaways: [
        'Few-shot examples lock in format and handle corner cases.',
        'Wrap examples in XML; include reasoning about why each is ideal.',
        'Place examples after instructions; reuse your best eval cases.',
      ],
      examRelevance: [
        { domainId: 'd4', taskId: 't4.2', label: 'Few-shot prompting for consistency & generalization' },
        { domainId: 'd3', taskId: 't3.5', label: 'Concrete examples communicate transformations' },
        { domainId: 'd5', taskId: 't5.2', label: 'Few-shot escalation examples' },
      ],
    },
  ],
}
