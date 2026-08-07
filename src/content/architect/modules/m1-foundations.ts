import type { BuildModule } from '../../types'

export const m1: BuildModule = {
  id: 'm1',
  title: 'Foundations',
  blurb:
    'How Claude generates text and how you talk to it through the API: model families, the request flow, multi-turn conversations, system prompts, temperature, streaming, and shaping the output.',
  lessons: [
    {
      id: 'overview-of-models',
      moduleId: 'm1',
      title: 'Overview of Claude Models',
      summary: 'The three Claude model families — Opus, Sonnet, Haiku — and how to choose between them.',
      body: `Claude comes in three model families, each optimized for a different priority. They share the same core capabilities — text generation, coding, image analysis — and differ mainly in where they sit on the intelligence/speed/cost curve.

## The three families

- **Opus** — the highest-intelligence model, built for complex, multi-step tasks that need deep reasoning and planning. The trade-off is higher cost and latency.
- **Sonnet** — the balanced model: strong intelligence, good speed, sensible cost. It has particularly strong coding ability and precise code editing, which makes it the default for most practical use cases.
- **Haiku** — the fastest, most cost-efficient model, tuned for speed and high-volume throughput. Best for real-time user interactions and large batch jobs.

## A simple selection framework

> Intelligence is the priority → **Opus**. Speed is the priority → **Haiku**. Balanced requirements → **Sonnet**.

A common production pattern is to use **multiple models in the same application**, picking the right one per task rather than committing to a single model everywhere. For example, a fast model can generate a test dataset or do a first-pass classification, while a stronger model handles the hard reasoning step.`,
      keyTakeaways: [
        'Opus = max intelligence (higher cost/latency); Sonnet = balanced default with strong coding; Haiku = fastest and cheapest.',
        'All three share core capabilities — the difference is optimization focus.',
        'Mixing models within one app, chosen per task, is a common and effective pattern.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Model selection by priority',
          code: `flowchart TD
  Start([What matters most?]) --> Intel{Need deep<br/>reasoning?}
  Intel -- Yes --> Opus[Opus]
  Intel -- No --> Speed{Need speed /<br/>high volume?}
  Speed -- Yes --> Haiku[Haiku]
  Speed -- No --> Sonnet[Sonnet — balanced default]`,
        },
      ],
      examRelevance: [
        { domainId: 'd1', label: 'Choosing the right model per agent/subagent role' },
      ],
    },
    {
      id: 'accessing-the-api',
      moduleId: 'm1',
      title: 'Accessing the API',
      summary: 'The 5-step flow from user input to displayed response, and the four stages of text generation.',
      body: `Accessing the Claude API is a **5-step flow** from a user's input to a displayed response. The golden rule: **never call the Anthropic API directly from a client app** — that would expose your API key. Calls go through your own server.

## The 5 steps

1. **Client → your server.** The client sends the user's text to your developer server.
2. **Your server → Anthropic API.** Your server makes the request using an SDK (Python, TypeScript/JavaScript, Go, Ruby) or plain HTTP. The required ingredients are: **API key + model name + messages list + max_tokens**.
3. **Text generation** happens (four stages, below).
4. **Stopping.** The model stops when it hits \`max_tokens\` or generates a special end-of-sequence token.
5. **API → server → client.** The response comes back with the generated text plus **usage counts** and a **stop_reason**; your server relays it to the client.

## The four stages of text generation

- **Tokenization** — break the input into tokens (words, word-parts, symbols, spaces).
- **Embedding** — convert each token into a list of numbers representing all its possible meanings.
- **Contextualization** — adjust those embeddings based on neighboring tokens to pin down precise meaning.
- **Generation** — the output layer produces a probability for each possible next token; the model selects one using probability + randomness, appends it, and repeats.

This mental model pays off later: **temperature** tunes the randomness in the generation stage, and **stop_reason** is the field your agentic loops depend on.`,
      keyTakeaways: [
        'Always route API calls through your server — never expose the API key in a client.',
        'Required request ingredients: API key, model, messages, max_tokens.',
        'Text generation = tokenization → embedding → contextualization → generation (predict next token, repeat).',
        'Responses carry generated text, usage counts, and stop_reason.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'The 5-step API request flow',
          code: `sequenceDiagram
  participant C as Client app
  participant S as Your server
  participant A as Anthropic API
  C->>S: 1. User text
  S->>A: 2. Request (key + model + messages + max_tokens)
  A->>A: 3. Generate text (4 stages)
  A->>A: 4. Stop (max_tokens or end-of-sequence)
  A->>S: 5. Response (text + usage + stop_reason)
  S->>C: Display response`,
        },
        {
          kind: 'mermaid',
          title: 'Four stages of text generation',
          code: `flowchart LR
  In[Input text] --> T[Tokenization]
  T --> E[Embedding]
  E --> Ctx[Contextualization]
  Ctx --> G[Generation<br/>predict next token]
  G -->|append + repeat| G
  G --> Out[Output text]`,
        },
        { kind: 'tokenstream', title: 'A token stream', caption: 'Text is generated one token at a time.' },
      ],
      examRelevance: [{ domainId: 'd1', label: 'stop_reason drives the agentic loop' }],
    },
    {
      id: 'making-a-request',
      moduleId: 'm1',
      title: 'Making a Request',
      summary: 'Setting up the client and the structure of a messages.create() call.',
      body: `Making a request involves a little setup and an understanding of the message structure.

## Setup (4 steps)

1. **Install packages** — \`pip install anthropic python-dotenv\`.
2. **Store the API key** — create a \`.env\` file with \`ANTHROPIC_API_KEY="your_key"\` and keep it out of version control.
3. **Load the environment variable** — use python-dotenv to load the key securely.
4. **Create the client** — initialize the Anthropic client and define a model variable.

## The request

The core function is \`client.messages.create()\`. Its required arguments are **model**, **max_tokens**, and **messages**.

- **model** — which Claude model to use.
- **max_tokens** — a *safety limit* on generation length, **not a target length**.
- **messages** — a list of conversation exchanges.

Each message is a dictionary with a \`role\` and \`content\`. A **user** message looks like \`{"role": "user", "content": "your text"}\`. The model's reply comes back as an **assistant** message.

To pull just the text out of the response, read \`message.content[0].text\` — the full response object also carries metadata and a nested structure.`,
      keyTakeaways: [
        'Required args: model, max_tokens, messages.',
        'max_tokens is a safety ceiling, not a target length.',
        'Messages are {role, content} dicts; extract text with message.content[0].text.',
        'Keep the API key in .env, out of version control.',
      ],
      code: [
        {
          lang: 'python',
          title: 'A minimal request',
          code: `from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic()  # reads ANTHROPIC_API_KEY from env
model = "claude-sonnet-4-5"

message = client.messages.create(
    model=model,
    max_tokens=1000,
    messages=[
        {"role": "user", "content": "What is quantum computing?"}
    ],
)

print(message.content[0].text)`,
        },
      ],
    },
    {
      id: 'multi-turn-conversations',
      moduleId: 'm1',
      title: 'Multi-Turn Conversations',
      summary: 'The API is stateless — you maintain history and resend it on every request.',
      body: `A multi-turn conversation maintains context across several back-and-forth exchanges. The key limitation to internalize: **the Anthropic API stores no messages.** Every request is independent and has no memory of previous exchanges.

So *you* maintain the conversation:

1. Keep the message list in your own code.
2. Send the **entire conversation history** with every follow-up request.

## The flow

- Send the initial user message.
- Receive the assistant response.
- **Append** the assistant response to your history.
- Add the next user message to the history.
- Send the **complete** history for a context-aware follow-up.

Tiny helper functions keep this tidy: \`add_user_message(messages, text)\`, \`add_assistant_message(messages, text)\`, and \`chat(messages)\` to send the history and return the response. Without history, replies lack continuity; with the full history, Claude stays coherent across turns.

This statelessness is foundational for the exam too: passing complete conversation history is what preserves coherence, and it is why **subagents don't automatically inherit a coordinator's context** — there is no shared memory unless you pass it.`,
      keyTakeaways: [
        'The API is stateless — it remembers nothing between requests.',
        'You maintain the message list and resend the full history every time.',
        'Append each assistant reply before adding the next user message.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Maintaining conversation history',
          code: `flowchart TD
  U1[User msg 1] --> H[(Your message list)]
  H --> API1[Send full history]
  API1 --> A1[Assistant reply 1]
  A1 --> H
  U2[User msg 2] --> H
  H --> API2[Send full history again]
  API2 --> A2[Assistant reply 2]`,
        },
      ],
      examRelevance: [
        { domainId: 'd1', label: 'Subagents do not inherit context — pass it explicitly' },
        { domainId: 'd5', label: 'Passing complete history preserves coherence' },
      ],
    },
    {
      id: 'system-prompts',
      moduleId: 'm1',
      title: 'System Prompts',
      summary: 'Steer how Claude responds (role, tone, behavior) via the system parameter.',
      body: `A **system prompt** customizes Claude's response *style and behavior* by assigning it a role or behavior pattern. You pass it as a plain string via the \`system\` keyword argument.

The crucial distinction: system prompts control **how** Claude responds, not **what** it responds. A "patient math tutor" system prompt makes Claude give hints and encourage thinking rather than handing over the final answer — the same question gets different *treatment* depending on the assigned role.

A typical system prompt opens by assigning the role ("You are a patient math tutor") and follows with specific behavioral instructions.

Implementation note: build a \`params\` dictionary, conditionally add the \`system\` key only if a prompt is provided, and pass it with \`**\` unpacking — so the \`system\` parameter is simply excluded when there is none.`,
      keyTakeaways: [
        'System prompts shape how Claude responds (role/tone/behavior), not the content of the answer.',
        'Passed as a plain string via the system keyword argument.',
        'Conditionally include the system key so a None case omits it cleanly.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Conditionally adding a system prompt',
          code: `def chat(messages, system=None):
    params = {"model": model, "max_tokens": 1000, "messages": messages}
    if system:
        params["system"] = system
    return client.messages.create(**params)

chat(messages, system="You are a patient math tutor. Give hints, not full answers.")`,
        },
      ],
      examRelevance: [{ domainId: 'd2', label: 'System prompt wording can override tool descriptions' }],
    },
    {
      id: 'temperature',
      moduleId: 'm1',
      title: 'Temperature',
      summary: 'A 0–1 dial on randomness in next-token selection.',
      body: `**Temperature** is a parameter from 0 to 1 that controls randomness in generation by reshaping the probability distribution over the next token.

Recall the generation loop: input → tokenize → assign probabilities to possible next tokens → select one → repeat. Temperature tunes that selection:

- **Temperature 0** — deterministic: always pick the highest-probability token.
- **Higher temperature** — raises the chance of selecting lower-probability tokens, producing more creative or unexpected output.

## Guidelines

- **Low (near 0)** — data extraction and factual tasks that need consistency.
- **High (near 1)** — creative tasks: brainstorming, writing, jokes, marketing.

A subtlety: a higher temperature doesn't *guarantee* different output — it only increases the *probability* of variation. The diagram below shows how temperature flattens or sharpens the distribution.`,
      keyTakeaways: [
        'Temperature (0–1) controls randomness in next-token selection.',
        '0 = deterministic (always the top token); higher = more varied/creative.',
        'Low temp for extraction/factual; high temp for creative work.',
      ],
      diagrams: [
        { kind: 'temperature', title: 'Temperature reshapes the next-token distribution', caption: 'Drag the slider to see low vs high temperature.' },
      ],
      outOfScope: false,
    },
    {
      id: 'response-streaming',
      moduleId: 'm1',
      title: 'Response Streaming',
      summary: 'Display the response chunk-by-chunk as it is generated.',
      outOfScope: true,
      outOfScopeNote:
        'Streaming API implementation / server-sent events are explicitly out of scope for the Architect exam. Learn it as a builder, but you will not be tested on it.',
      body: `**Response streaming** displays the response chunk-by-chunk as it is generated, instead of waiting for the whole thing. Since responses can take 10–30 seconds, streaming gives users immediate feedback rather than a spinner.

## How it works

1. Your server sends the user message to Claude.
2. Claude immediately sends an initial acknowledgment (no text yet).
3. A stream of events follows, each carrying a text chunk.
4. Your server forwards chunks to the frontend for real-time display.

## Event types

- \`message_start\` — initial acknowledgment.
- \`content_block_start\` — text generation begins.
- \`content_block_delta\` — the actual text chunks (the important one).
- \`content_block_stop\` / \`message_stop\` — generation complete.

## Implementation

- Basic: \`client.messages.create(stream=True)\` returns an event iterator.
- Simplified: \`client.messages.stream()\` with a \`text_stream\` property that yields just the text.
- Final message: \`stream.get_final_message()\` assembles all chunks for storage.`,
      keyTakeaways: [
        'Streaming shows text as it generates, improving perceived latency.',
        'content_block_delta carries the actual text chunks.',
        'Use stream.get_final_message() to capture the complete message for storage.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Simplified streaming',
          code: `with client.messages.stream(
    model=model, max_tokens=1000,
    messages=[{"role": "user", "content": "Tell me a story"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()  # full message for storage`,
        },
      ],
    },
    {
      id: 'controlling-output',
      moduleId: 'm1',
      title: 'Controlling Model Output',
      summary: 'Two precise levers: prefilling assistant messages and stop sequences.',
      body: `Beyond editing the prompt, two techniques give precise control over Claude's output.

## 1. Prefilling assistant messages

You can add an **assistant** message at the end of the conversation yourself. Claude treats it as content it already authored and **continues from the exact end** of your prefill.

- Assemble the messages list with your user prompt **plus** a manual assistant message.
- Claude continues from the precise endpoint of the prefill (not necessarily a clean sentence boundary), so you must stitch prefill + generated text together.

Example: prefill \`"Coffee is better because"\` → Claude continues with justification for coffee.

## 2. Stop sequences

A **stop sequence** forces generation to halt the moment a specific string appears. The generated stop string itself is **not** included in the output.

Example: prompt "count 1 to 10" with stop sequence \`"five"\` → output stops at "four, ". Refine to \`", five"\` and you get clean output: "one, two, three, four".

Together, prefilling steers *direction* and stop sequences control *length/termination* — without touching the core prompt. These two combine into the structured-data trick in the next lesson.`,
      keyTakeaways: [
        'Prefilling an assistant message steers Claude to continue from your exact text.',
        'Claude continues from the precise endpoint — stitch prefill + output together.',
        'Stop sequences halt generation at a string; that string is excluded from output.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Prefill + stop sequence',
          code: `messages = [
    {"role": "user", "content": "Count from 1 to 10."},
    {"role": "assistant", "content": "one, two, three, four"},  # prefill
]
client.messages.create(
    model=model, max_tokens=100, messages=messages,
    stop_sequences=[", five"],  # halt cleanly before five
)`,
        },
      ],
    },
    {
      id: 'structured-data',
      moduleId: 'm1',
      title: 'Structured Data',
      summary: 'Combine prefill + stop sequence to get raw JSON/code with no commentary.',
      body: `Claude tends to wrap structured output in markdown, headers, and commentary. When you want **just the raw data** to copy or parse, combine the two control techniques from the previous lesson.

## The pattern

1. **User message** — request the structured data.
2. **Assistant prefill** — the opening delimiter, e.g. \\\`\\\`\\\`json.
3. **Stop sequence** — the closing delimiter, e.g. \\\`\\\`\\\`.

Claude sees the prefilled opening, assumes it already began the response, generates only the requested content, and stops when it hits the closing delimiter. The result is clean, parseable output with no explanatory text.

This works for **any** structured type — JSON, Python, lists, regex — not just JSON. It's the lightweight, prompt-only path to structured output. (The more *reliable* path, using **tool_use + a JSON schema**, is covered in the Tool Use module and is what the exam recommends when guarantees matter.)`,
      keyTakeaways: [
        'Prefill the opening delimiter and set the closing delimiter as a stop sequence to get raw structured output.',
        'Works for JSON, code, lists, regex — anything delimited.',
        'For guaranteed schema-compliance, prefer tool_use + JSON schema instead.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Raw JSON via prefill + stop',
          code: `messages = [
    {"role": "user", "content": "Give me 3 sci-fi book recommendations as JSON."},
    {"role": "assistant", "content": "\`\`\`json"},   # prefill opening delimiter
]
resp = client.messages.create(
    model=model, max_tokens=1000, messages=messages,
    stop_sequences=["\`\`\`"],                          # stop at closing delimiter
)
# resp.content[0].text is clean JSON, ready to json.loads()`,
        },
      ],
      examRelevance: [
        { domainId: 'd4', taskId: 't4.3', label: 'Structured output (tool_use is the reliable upgrade)' },
      ],
    },
  ],
}
