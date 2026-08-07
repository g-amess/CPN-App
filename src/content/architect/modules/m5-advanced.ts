import type { BuildModule } from '../../types'

export const m5: BuildModule = {
  id: 'm5',
  title: 'Advanced Capabilities',
  blurb:
    'Extended thinking, vision and PDF input, citations, prompt caching, and the Files API + code execution. Several of these are out of scope for the exam — clearly marked.',
  lessons: [
    {
      id: 'extended-thinking',
      moduleId: 'm5',
      title: 'Extended Thinking',
      summary: 'Give Claude a reasoning budget before the final answer — for accuracy on hard tasks.',
      body: `**Extended thinking** lets Claude reason before producing its final response, improving accuracy on complex tasks at the cost of more tokens and latency.

## Mechanics

- A separate **thinking process** is visible to users.
- You're charged for **thinking tokens**, and latency rises.
- The **thinking budget** has a minimum of **1024 tokens**, and \`max_tokens\` must exceed the budget (budget 1024 → \`max_tokens\` ≥ 1025).

## When to use it

Enable it **after** prompt optimization fails to reach the accuracy you need — and use prompt evals to decide whether it's actually necessary.

## Response structure

- **Thinking block** — reasoning text plus a cryptographic **signature** that prevents tampering with the thinking text (a safety measure).
- **Text block** — the final response.
- **Redacted thinking blocks** — encrypted thinking flagged by safety systems, still provided so a conversation can continue without losing context.

The exam's relevant counterpoint (Domain 4): an **independent review instance** is *more* effective at catching subtle issues than self-review or even extended thinking — so don't reach for extended thinking as a substitute for a fresh reviewing instance.`,
      keyTakeaways: [
        'Extended thinking adds a reasoning budget (min 1024 tokens; max_tokens must exceed it).',
        'Use it only after prompt optimization; verify need with evals.',
        'Thinking blocks carry a signature; redacted blocks preserve continuity.',
      ],
      examRelevance: [{ domainId: 'd4', taskId: 't4.6', label: 'Independent review can beat extended thinking' }],
    },
    {
      id: 'image-support',
      moduleId: 'm5',
      title: 'Image Support (Vision)',
      summary: 'Claude can analyze images in user messages — with strong prompting.',
      outOfScope: true,
      outOfScopeNote: 'Vision/image analysis is explicitly OUT of scope for the Architect exam.',
      body: `Claude's **vision** capability processes images inside user messages for analysis, comparison, counting, and description.

## Limits

- Max **100 images** per request; size/dimension restrictions apply.
- Images consume **tokens** (charged based on pixel height × width).

## Image blocks

A special block type in user messages holds either raw **base64** image data or a **URL** reference. Multiple image blocks are allowed per message.

## The key success factor: prompting

Accuracy depends **entirely on prompt sophistication**, not just image quality. Simple prompts often fail. Effective techniques: step-by-step analysis instructions, one-shot/multi-shot examples (alternating image and text pairs), clear guidelines and verification steps, and structured analysis frameworks.

Example use case: automated fire-risk assessment from satellite imagery — analyzing tree density, property access, roof overhang, and assigning numerical risk scores.`,
      keyTakeaways: [
        'Up to 100 images/request; images cost tokens by pixel area.',
        'Image blocks carry base64 data or a URL.',
        'Accuracy hinges on strong prompting, not image quality.',
      ],
    },
    {
      id: 'pdf-support',
      moduleId: 'm5',
      title: 'PDF Support',
      summary: 'Read PDFs (text, images, charts, tables) much like images.',
      body: `Claude can read PDF files directly, using code very similar to image processing. The implementation changes are small:

- File type = **\`"document"\`** (instead of \`"image"\`).
- Media type = **\`"application/pdf"\`** (instead of \`"image/png"\`).
- Variable naming = \`file_bytes\` instead of \`image_bytes\`.

Claude's PDF capabilities cover **text + images + charts + tables + mixed content** extraction, making it a one-stop solution for comprehensive document analysis. The usage pattern matches image input but with document-specific parameters.`,
      keyTakeaways: [
        'PDFs use type "document" and media type "application/pdf".',
        'Claude extracts text, images, charts, and tables from PDFs.',
        'Otherwise the pattern mirrors image input.',
      ],
      code: [
        {
          lang: 'python',
          title: 'A PDF document block',
          code: `import base64
file_bytes = base64.standard_b64encode(open("report.pdf", "rb").read()).decode()
message = {
    "role": "user",
    "content": [
        {"type": "document", "source": {
            "type": "base64", "media_type": "application/pdf", "data": file_bytes}},
        {"type": "text", "text": "Summarize the key findings."},
    ],
}`,
        },
      ],
    },
    {
      id: 'citations',
      moduleId: 'm5',
      title: 'Citations',
      summary: 'Let Claude reference exactly where in a source its statements come from.',
      body: `**Citations** let Claude reference source documents and show where information comes from — building trust and verifiability.

## Citation types

- **\`citation_page_location\`** — for PDFs: document index/title/start page/end page/cited text.
- **\`citation_char_location\`** — for plain text: character position within the text block.

## Implementation

- Add \`"citations": {"enabled": true}\` to the request.
- Add a \`"title"\` field to identify the source document.
- Works with both PDFs and plain text.

The response \`content\` becomes a list of text blocks, some carrying **citations arrays** with location data. This enables citation popups/overlays that show the source, page numbers, and exact quoted text on hover — so users can verify how Claude built its response rather than trusting it to "speak from memory."

This is the builder analogue of the exam's **provenance** theme: preserve claim-source mappings so attribution survives downstream.`,
      keyTakeaways: [
        'Enable with citations: {enabled: true} and a source title.',
        'Page-location (PDF) vs char-location (plain text).',
        'Responses carry citation arrays linking statements to exact sources.',
      ],
      examRelevance: [{ domainId: 'd5', taskId: 't5.6', label: 'Preserving information provenance' }],
    },
    {
      id: 'prompt-caching',
      moduleId: 'm5',
      title: 'Prompt Caching',
      summary: 'Reuse the processing of repeated input to cut cost and latency.',
      outOfScope: true,
      outOfScopeNote:
        'Prompt-caching internals are OUT of scope for the exam — you only need to know it exists. (Covered here for builders across three lessons.)',
      body: `**Prompt caching** speeds up responses and reduces cost by **reusing computational work** from previous requests.

Normally: a request comes in → Claude processes the input (builds internal data structures, runs calculations) → generates output → **discards all that processing work**. If a follow-up request contains identical input, Claude would have to redo all that discarded work — wasteful.

Prompt caching instead **stores the results of input processing** in a temporary cache. When identical input appears again, Claude retrieves the cached work rather than reprocessing — dramatically speeding up generation for repeated content.

> For the exam you only need to know prompt caching *exists*; the rules and implementation in the next two lessons are builder depth, marked out of scope.`,
      keyTakeaways: [
        'Caching reuses the processing of repeated input to cut cost and latency.',
        'Without it, identical input is reprocessed from scratch every time.',
        'Exam: just know it exists.',
      ],
    },
    {
      id: 'prompt-caching-rules',
      moduleId: 'm5',
      title: 'Rules of Prompt Caching',
      summary: 'Breakpoints, ordering, the 1024-token minimum, and invalidation.',
      outOfScope: true,
      outOfScopeNote: 'Prompt-caching internals are OUT of scope for the exam.',
      body: `The rules that govern prompt caching:

- **Cache duration** — up to 1 hour.
- **Manual breakpoints** — caching requires adding a **cache breakpoint** to message blocks; everything up to and including the breakpoint gets cached.
- **Text block format** — shorthand \`content = "string"\` can't take cache control; you need the **longhand** form: \`[{"type": "text", "text": "...", "cache_control": {...}}]\`.
- **Processing order** — \`tools → system prompt → messages\` (joined together).
- **Invalidation** — any change to content *before* a breakpoint invalidates the entire cache.
- **Breakpoint placement** — tool schemas, system prompts, or message blocks.
- **Maximum breakpoints** — 4 per request; multiple breakpoints create layered caches with partial hits possible if only later content changes.
- **Minimum threshold** — content must be ≥ **1024 tokens** to be cached.

Best use cases: repeated identical content — system prompts, tool definitions, static message prefixes.`,
      keyTakeaways: [
        'Order: tools → system → messages; cache covers up to a breakpoint.',
        'Up to 4 breakpoints; 1024-token minimum; 1-hour duration.',
        'Any change before a breakpoint invalidates the whole cache.',
      ],
    },
    {
      id: 'prompt-caching-in-action',
      moduleId: 'm5',
      title: 'Prompt Caching in Action',
      summary: 'Caching tool schemas and system prompts; reading the usage counters.',
      outOfScope: true,
      outOfScopeNote: 'Prompt-caching internals are OUT of scope for the exam.',
      body: `Putting caching to work, typically by enabling it for **tool schemas** and **system prompts** by default in your \`chat\` function.

- **Tool schema caching** — add a \`cache_control\` field of type \`"ephemeral"\` to the **last** tool in the list. Best practice: copy the tools list, clone the last schema, add cache control, and overwrite — so you never mutate the originals.
- **System prompt caching** — wrap the system prompt in a text-block dict with \`cache_control\` type \`"ephemeral"\`.
- **Multiple breakpoints** — you can cache both tools and the system prompt in one request.

## Usage counters

- **\`cache_creation_input_tokens\`** — tokens written to cache on first use.
- **\`cache_read_input_tokens\`** — tokens read from cache on later identical requests.
- Partial reads occur when only some content matches.

Any change to cached content invalidates the cache and forces a new cache creation.`,
      keyTakeaways: [
        'Add cache_control "ephemeral" to the last tool and/or wrap the system prompt.',
        'Clone before mutating so originals stay intact.',
        'Watch cache_creation_input_tokens vs cache_read_input_tokens.',
      ],
    },
    {
      id: 'files-api-code-execution',
      moduleId: 'm5',
      title: 'Code Execution and the Files API',
      summary: 'Upload files once and let Claude run Python on them in a sandbox.',
      body: `Two complementary features.

## Files API

Upload files ahead of time and reference them later by **file ID** instead of including raw data in each request. Upload a file → get a metadata object with an ID → use that ID in future requests.

## Code execution

A server-based tool where Claude executes **Python in isolated Docker containers**. No implementation needed — just include the predefined tool schema. Claude can run code multiple times, interpret results, and produce a final response. Key constraint: containers have **no network access**, so data in/out relies on Files API integration.

## Combined workflow

Upload a file via the Files API → get the ID → include it in a **container upload block** → ask Claude to analyze → Claude writes and runs code with access to the file → returns analysis and results. Claude can even **generate files** (plots, reports) inside the container, downloadable via file IDs in the response.

Use cases: data analysis, file processing, automated code generation for complex tasks.`,
      keyTakeaways: [
        'Files API: upload once, reference by file ID.',
        'Code execution runs Python in a network-isolated Docker sandbox.',
        'Combine them: upload → container block → Claude runs code → results/files back.',
      ],
    },
  ],
}
