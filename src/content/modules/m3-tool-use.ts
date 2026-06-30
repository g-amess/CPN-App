import type { BuildModule } from '../types'

export const m3: BuildModule = {
  id: 'm3',
  title: 'Tool Use',
  blurb:
    'Give Claude access to the outside world: define tools, send schemas, handle the multi-block messages and tool_result loop, and chain multiple tools — the foundation of every agent.',
  lessons: [
    {
      id: 'introducing-tool-use',
      moduleId: 'm3',
      title: 'Introducing Tool Use',
      summary: 'The 5-step loop that lets Claude fetch external/current information.',
      body: `By default Claude only knows what was in its training data — it lacks current and real-time information. **Tool use** is the method that lets Claude reach beyond that by asking your code to fetch data.

## The tool-use flow

1. Send the initial request **plus instructions for accessing external data** (the tool schemas).
2. Claude evaluates whether it needs external data and, if so, **requests specific information**.
3. Your server runs code to **fetch** the requested data from the external source.
4. You send a **follow-up request** with the retrieved data.
5. Claude generates the **final response** using the original prompt + the external data.

Weather example: user asks the current weather → Claude requests weather data → your server calls a weather API → Claude receives it → Claude answers with live information.

The key idea: tools let Claude **orchestrate external data retrieval** between its own requests. This loop is the literal basis of the **agentic loop** the Architect exam centers on.`,
      keyTakeaways: [
        'Tools let Claude access information beyond its training data.',
        'Five steps: request+schemas → Claude asks → you fetch → follow-up with data → final answer.',
        'This loop is the foundation of agents.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'The tool-use loop',
          code: `sequenceDiagram
  participant U as User
  participant S as Your server
  participant Cl as Claude
  participant Ext as External source
  U->>S: Question
  S->>Cl: Prompt + tool schemas
  Cl->>S: tool_use request (name + input)
  S->>Ext: Run tool / fetch data
  Ext->>S: Data
  S->>Cl: Follow-up with tool_result
  Cl->>S: Final answer (end_turn)
  S->>U: Display`,
        },
      ],
      examRelevance: [{ domainId: 'd1', taskId: 't1.1', label: 'This is the agentic loop' }],
    },
    {
      id: 'reminder-project',
      moduleId: 'm3',
      title: 'Project Overview: The Reminder Agent',
      summary: 'Three problems that motivate three tools — the running tool-use example.',
      body: `The module's running project teaches Claude to set **time-based reminders**. Target interaction:

> User: "Set a reminder for my doctor's appointment, a week from Thursday." → Claude: "I'll remind you at that time."

Three problems make this impossible without tools:

1. **Time knowledge gap** — Claude knows the current date but not the exact current time.
2. **Time calculation errors** — Claude sometimes miscalculates date arithmetic (e.g. 379 days from January 13th, 1973).
3. **No reminder mechanism** — Claude understands the concept but can't actually set a reminder.

Three tools solve them:

1. **Current datetime tool** — gets the current date + time.
2. **Duration addition tool** — adds a duration to a datetime (e.g. current date + 20 days).
3. **Reminder setting tool** — actually sets the reminder.

The approach is to build one tool at a time, working up to multi-tool coordination. This mirrors the exam's **abstract, composable tools** principle — small general tools combine to solve many tasks.`,
      keyTakeaways: [
        'Three gaps motivate three tools: current time, duration math, set reminder.',
        'Tools fill knowledge gaps, fix unreliable computation, and enable real actions.',
        'Build incrementally toward multi-tool coordination.',
      ],
    },
    {
      id: 'tool-functions',
      moduleId: 'm3',
      title: 'Tool Functions',
      summary: 'Tools are ordinary Python functions with good names, validation, and clear errors.',
      body: `A **tool function** is a plain Python function that Claude can have executed when it needs extra information. Three best practices make them reliable:

1. **Well-named functions and arguments** — descriptive names help Claude (and you).
2. **Input validation with immediate errors** — raise on invalid input right away.
3. **Meaningful error messages** — error text is **visible to Claude**, so a good message lets it retry with corrected parameters.

That last point is important: the error message becomes part of the feedback loop. Claude identifies a need → calls the tool → receives a result *or* an error → and may retry with corrections if it errored.

The exam extends this idea into **structured error metadata** (errorCategory, isRetryable) so the agent can decide *whether* a retry is even worthwhile.`,
      keyTakeaways: [
        'Tools are normal functions; name them and their args descriptively.',
        'Validate inputs and raise immediately with meaningful messages.',
        'Error messages are visible to Claude and enable self-correction.',
      ],
      code: [
        {
          lang: 'python',
          title: 'A validated tool function',
          code: `from datetime import datetime

def get_current_datetime(date_format="%Y-%m-%d %H:%M:%S"):
    if not date_format:
        raise ValueError("date_format cannot be empty")
    return datetime.now().strftime(date_format)`,
        },
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.2', label: 'Structured error responses build on this' }],
    },
    {
      id: 'tool-schemas',
      moduleId: 'm3',
      title: 'Tool Schemas',
      summary: 'JSON-schema specs that tell Claude what a tool does and what it accepts.',
      body: `A **tool schema** is a JSON-schema spec describing a tool function and its parameters so the model can use it. (JSON Schema is a general data-validation standard the ML community adopted for tool calling.)

## Structure

- **\`name\`** — the tool identifier.
- **\`description\`** — 3–4 sentences explaining what the tool does, **when to use it**, and what it returns.
- **\`input_schema\`** — a JSON schema describing the arguments with types and descriptions.

The **description is the single most important field** — it's the primary signal Claude uses to pick the right tool. (The exam hammers this: minimal descriptions cause misrouting between similar tools.)

A handy generation trick: paste your function into Claude.ai, ask it to "write a valid JSON schema spec for tool calling for this function, following the attached docs," and attach the Anthropic tool-use documentation. In code, name schemas \`[function_name]_schema\` and wrap the dict in \`ToolParam()\` (from \`anthropic.types\`) to avoid type errors.`,
      keyTakeaways: [
        'A schema has name, description, and input_schema.',
        'The description (when/why/what-it-returns) is what Claude uses to select tools.',
        'Wrap schemas in ToolParam() and name them [function_name]_schema.',
      ],
      code: [
        {
          lang: 'python',
          title: 'A tool schema',
          code: `from anthropic.types import ToolParam

get_current_datetime_schema = ToolParam({
    "name": "get_current_datetime",
    "description": (
        "Returns the current date and time. Use this whenever you need to "
        "know the present moment, e.g. before computing a future date. "
        "Returns a formatted datetime string."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "date_format": {"type": "string",
                "description": "strftime format, e.g. %Y-%m-%d %H:%M:%S"}
        },
    },
})`,
        },
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.1', label: 'Descriptions are the primary tool-selection mechanism' }],
    },
    {
      id: 'message-blocks',
      moduleId: 'm3',
      title: 'Handling Message Blocks',
      summary: 'With tools, messages contain multiple content blocks — append them all.',
      body: `To make a tool-enabled request, include the schemas via the \`tools\` keyword argument alongside the user message.

The big structural change: responses now contain **multiple content blocks** instead of just text. A tool-using assistant message has:

- a **text block** — a user-facing explanation, and
- a **tool_use block** — the function name + arguments to execute.

Because Claude stores nothing, you must **manually maintain conversation history** — and you must append the **entire \`response.content\`** (all blocks), not just the text. That means your \`add_user_message\` / \`add_assistant_message\` helpers have to support **multiple blocks**, not single strings.

The flow: user message → assistant response with a tool_use block → you execute the tool → you respond with the full history including the result.`,
      keyTakeaways: [
        'Pass schemas via the tools argument.',
        'Tool responses contain multiple blocks (text + tool_use).',
        'Append the whole response.content to history; helpers must handle multi-block messages.',
      ],
    },
    {
      id: 'sending-tool-results',
      moduleId: 'm3',
      title: 'Sending Tool Results',
      summary: 'Return a tool_result block matched to the tool_use_id, in a user message.',
      body: `After executing the tool Claude requested, you send the output back in a **tool_result block**. Its structure:

- **\`tool_use_id\`** — must match the id from the original tool_use block. This pairing is what links a result to its request, which matters when Claude issues **several tool calls at once**.
- **\`content\`** — the tool's output as a string (usually JSON).
- **\`is_error\`** — a boolean flag for execution errors (default false).

Critical details:
- The tool_result block goes in a **user message**, not an assistant message.
- The follow-up request must include the **complete history** (original user message + assistant tool_use message + new user message with the result).
- You must still include the **original tool schemas**, even if no more tools will be used.

The full cycle: user request → assistant (text + tool_use) → server executes → user message with tool_result → Claude's final response integrating the result.

The **\`is_error\`** flag is the builder seed of the exam's MCP **\`isError\`** pattern and structured error metadata.`,
      keyTakeaways: [
        'tool_result needs tool_use_id, content (stringified), and is_error.',
        'tool_use_id pairs results to requests for simultaneous calls.',
        'Results live in a user message; resend full history + original schemas.',
      ],
      code: [
        {
          lang: 'python',
          title: 'A tool_result block',
          code: `tool_result = {
    "role": "user",
    "content": [
        {
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,   # must match the request
            "content": json.dumps(output),
            "is_error": False,
        }
    ],
}`,
        },
      ],
      examRelevance: [
        { domainId: 'd2', taskId: 't2.2', label: 'isError → structured MCP error metadata' },
        { domainId: 'd5', taskId: 't5.3', label: 'Error propagation across agents' },
      ],
    },
    {
      id: 'multi-turn-tools',
      moduleId: 'm3',
      title: 'Multi-Turn Conversations with Tools',
      summary: 'Tool chaining: Claude may need several tools in sequence for one query.',
      body: `A single user query may require **several tools used in sequence**. Tool chaining looks like: user asks → Claude requests tool 1 → result returned → Claude requests tool 2 → result returned → Claude gives the final answer.

Example: "What day is 103 days from today?" → Claude calls \`get_current_datetime\`, then calls \`add_duration_to_datetime\`, then answers.

You can't predict how many tools a query needs, so the system must handle **arbitrary chains automatically** — typically a **while loop** that keeps calling Claude until it stops requesting tools.

The \`run_conversation\` function takes initial messages, loops through Claude calls, executes requested tools, adds results to the conversation, and continues until a final response. Supporting refactors:
- \`add_user_message\` / \`add_assistant_message\` handle multiple blocks.
- \`chat\` accepts a \`tools\` parameter and returns the **entire message**, not just the first text block.
- a \`text_from_message\` helper extracts all text blocks from a multi-block message.`,
      keyTakeaways: [
        'One query can require a chain of tools you can\'t predict in advance.',
        'A while loop calls Claude until it stops requesting tools.',
        'Helpers must handle multi-block messages and a tools parameter.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Multi-tool chaining',
          code: `flowchart TD
  Q["What day is 103 days from today?"] --> C1[Claude]
  C1 -->|tool_use| T1[get_current_datetime]
  T1 -->|result| C2[Claude]
  C2 -->|tool_use| T2[add_duration_to_datetime]
  T2 -->|result| C3[Claude]
  C3 -->|end_turn| A[Final answer]`,
        },
      ],
      examRelevance: [{ domainId: 'd1', taskId: 't1.1', label: 'Arbitrary tool chains; loop on stop_reason' }],
    },
    {
      id: 'implementing-multiple-turns',
      moduleId: 'm3',
      title: 'Implementing Multiple Turns',
      summary: 'The run_conversation loop keyed on stop_reason — the canonical agentic loop.',
      body: `This is the heart of the module — and the exam. To keep calling Claude until it stops requesting tools, you key the loop on the **\`stop_reason\`** field, which says *why* Claude stopped.

- \`stop_reason == "tool_use"\` → Claude wants to call a tool.
- otherwise → Claude is done; break.

## run_conversation

1. Call Claude with messages + available tools.
2. Append the assistant response to history.
3. Check \`stop_reason\` — if **not** \`"tool_use"\`, break.
4. If \`tool_use\`, call \`run_tools\`.
5. Add the tool results as a **user** message.
6. Repeat.

## run_tools

Filters \`message.content\` for blocks with \`type == "tool_use"\`, runs each via \`run_tool\`, and builds \`tool_result\` blocks (\`type="tool_result"\`, \`tool_use_id\`, \`content\`=JSON output, \`is_error\`).

## run_tool

A dispatcher: matches \`tool_name\` to the right function with if-statements and executes it. Wrap execution in try/except — success → \`is_error=False\`; failure → \`is_error=True\` with the error message.

**Exam anti-patterns to avoid:** never decide completion by scanning assistant text for "done", and never use an arbitrary iteration cap as the *primary* stop. The reliable signal is \`stop_reason\`.`,
      keyTakeaways: [
        'Loop on stop_reason: "tool_use" → run tools and continue; else → stop.',
        'run_tools builds tool_result blocks; run_tool dispatches by name.',
        'Anti-patterns: parsing text for completion, or capping iterations as the main stop.',
      ],
      code: [
        {
          lang: 'python',
          title: 'The agentic loop',
          code: `def run_conversation(messages):
    while True:
        response = chat(messages, tools=all_tools)
        add_assistant_message(messages, response.content)
        if response.stop_reason != "tool_use":
            break                       # end_turn → done
        results = run_tools(response)    # execute every tool_use block
        add_user_message(messages, results)
    return messages

def run_tool(name, tool_input):
    if name == "get_current_datetime":
        return get_current_datetime(**tool_input)
    if name == "add_duration_to_datetime":
        return add_duration_to_datetime(**tool_input)
    raise ValueError(f"Unknown tool: {name}")`,
        },
      ],
      examRelevance: [
        { domainId: 'd1', taskId: 't1.1', label: 'The canonical agentic loop (stop_reason control flow)' },
      ],
    },
    {
      id: 'using-multiple-tools',
      moduleId: 'm3',
      title: 'Using Multiple Tools',
      summary: 'Adding a tool = schema + routing case + implementation.',
      body: `Once the framework exists, adding a tool is a simple, repeatable 3-step pattern:

1. **Add the tool schema** to the \`tools\` list in \`run_conversation\` (so Claude knows it exists).
2. **Add a conditional case** in \`run_tool\` to route the new tool name.
3. **Implement** the actual tool function.

For the reminder project this adds \`add_duration_to_datetime\` and \`set_reminder\` (a mock that prints a confirmation). With several tools available, Claude can **chain them** — calculate a date first, then set a reminder with the result — all within one conversation, where assistant messages may carry multiple blocks (text + several tool_use).

The exam's counterpoint: more tools aren't always better. Past ~4–5, extra tools **degrade selection reliability**, so scope each agent's toolset to its role.`,
      keyTakeaways: [
        'Add a tool with three steps: schema → routing case → implementation.',
        'Multiple tools enable chaining within one conversation.',
        'But too many tools hurts selection — scope per role (exam).',
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.3', label: 'Tool distribution & scoping' }],
    },
    {
      id: 'batch-tool',
      moduleId: 'm3',
      title: 'The Batch Tool',
      summary: 'A meta-tool that nudges Claude into parallel tool execution.',
      body: `Claude *can* emit multiple tool_use blocks in one message, but in practice it rarely does — leading to unnecessary sequential calls. The **batch tool** is a higher-level abstraction that encourages parallel execution.

The batch tool's schema takes a **list of invocations**, each with a tool name + arguments. Instead of calling tools directly, Claude calls the batch tool with an **array** of desired executions. Your \`run_batch\` function iterates the invocations, extracts each tool name and JSON-parsed args, calls \`run_tool\` for each, and returns a \`batch_output\` list with all results.

The effect: a **single request-response cycle** instead of multiple sequential rounds for tasks that can run in parallel. It "tricks" Claude into the parallelism that multiple tool_use blocks would achieve automatically.

> Note: this is the **builder's batch tool** — distinct from the exam's **Message Batches API** (a cost-saving asynchronous bulk-processing API). Don't confuse the two.`,
      keyTakeaways: [
        'The batch tool takes a list of invocations to run in one cycle.',
        'run_batch iterates and dispatches each to run_tool.',
        'Different from the Message Batches API (async bulk, 50% cheaper).',
      ],
      examRelevance: [{ domainId: 'd4', taskId: 't4.5', label: 'Contrast with the Message Batches API' }],
    },
    {
      id: 'tools-for-structured-data',
      moduleId: 'm3',
      title: 'Tools for Structured Data',
      summary: 'Force a tool call with tool_choice to extract reliable structured JSON.',
      body: `Tools offer a **more reliable** way to extract structured JSON than the prefill + stop-sequence trick. The trade-off: more reliable output, but more complex setup, and it requires a JSON schema.

## The process

1. Define a JSON schema for a tool whose **inputs are the desired data structure**.
2. Send the prompt + schema to Claude.
3. Claude calls the tool with structured arguments matching the schema.
4. Read the JSON straight from the tool_use block — **no tool_result needed** (you just want the arguments).

## The critical requirement: force the tool call

Use **\`tool_choice\`** to make Claude always call your tool:

\`\`\`
tool_choice = {"type": "tool", "name": "your_tool_name"}
\`\`\`

Pass \`tool_choice\` through to \`client.messages.create()\` and read the data from \`response.content[0].input\`.

Use tools when reliability matters more than simplicity; the prompt-based method is fine for quick extractions. This is exactly the exam's recommended path for **guaranteed schema-compliant output**, and \`tool_choice\` (auto / any / forced) is a tested concept.`,
      keyTakeaways: [
        'Define a tool whose input schema IS your desired structure.',
        'Force the call with tool_choice={"type":"tool","name":...}; read response.content[0].input.',
        'Most reliable structured-output path — the exam\'s recommendation.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Forced tool call for extraction',
          code: `resp = client.messages.create(
    model=model, max_tokens=1000, messages=messages,
    tools=[extract_article_schema],
    tool_choice={"type": "tool", "name": "extract_article"},
)
data = resp.content[0].input   # structured dict matching the schema`,
        },
      ],
      examRelevance: [
        { domainId: 'd4', taskId: 't4.3', label: 'tool_use + JSON schema; tool_choice modes' },
        { domainId: 'd2', taskId: 't2.3', label: 'tool_choice configuration' },
      ],
    },
    {
      id: 'fine-grained-tool-calling',
      moduleId: 'm3',
      title: 'Fine-Grained Tool Calling',
      summary: 'Stream tool arguments immediately by disabling API-side JSON validation.',
      body: `When streaming with tools, you also get **\`input_json_delta\`** events carrying \`partial_json\` (a chunk) and a \`snapshot\` (cumulative sum) of the tool arguments.

By default, the API **buffers** tool-argument chunks until a complete top-level key/value pair is generated and validated against the schema — producing delays followed by a burst of chunks.

**Fine-grained tool calling** (\`fine_grained: true\`) **disables API-side JSON validation** and sends chunks immediately as generated, giving a traditional streaming feel — but you must handle invalid JSON client-side.

Trade-offs:
- **Default** — slower, but validated JSON.
- **Fine-grained** — faster streaming, but potentially invalid JSON (e.g. \`undefined\` instead of \`null\`).

Use fine-grained when you want immediate UI updates or early processing of tool arguments; the default is fine when validation delay is acceptable.`,
      keyTakeaways: [
        'Tool streaming adds input_json_delta events (partial_json + snapshot).',
        'Default buffers + validates; fine_grained sends chunks immediately.',
        'Fine-grained trades validation for speed — handle invalid JSON yourself.',
      ],
    },
    {
      id: 'text-edit-tool',
      moduleId: 'm3',
      title: 'The Text Edit Tool',
      summary: 'A built-in schema for file operations — you supply the implementation.',
      body: `The **text editor tool** is a built-in Claude tool for file/text operations: view, string-replace, create files, and so on. Two things make it special:

- It's one of the few tools whose **JSON schema is built into Claude** — you send a minimal **schema stub** (name + a version-specific type string) and Claude auto-expands it to the full schema internally. The type string varies by model version (3.5 vs 3.7 use different dates).
- The **implementation is still yours.** Claude sends tool_use requests; your custom code performs the actual file-system operations and returns results.

Workflow: send the stub → Claude expands it → Claude sends tool_use requests → your implementation executes view/replace/create → results go back to Claude.

This lets Claude act as a software engineer "out of the box" — it's essentially how an AI code editor works, approximated through API calls. It connects directly to the exam's built-in **Read/Write/Edit** tools and the "Edit needs a unique anchor; fall back to Read+Write" rule.`,
      keyTakeaways: [
        'Built-in schema (send a stub; Claude expands it) but you implement the file ops.',
        'The type string is model-version-specific.',
        'Conceptual basis for Claude Code\'s Read/Write/Edit tools.',
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.5', label: 'Built-in Read/Write/Edit tools' }],
    },
    {
      id: 'web-search-tool',
      moduleId: 'm3',
      title: 'The Web Search Tool',
      summary: 'A fully server-side built-in tool with citations and domain restriction.',
      body: `The **web search tool** is a built-in tool that searches the web for up-to-date or specialized information. Unlike custom tools, **no implementation is needed** — Claude executes the searches automatically.

## Schema

- \`type: "web_search_20250305"\`
- \`name: "web_search"\`
- \`max_uses\` — caps total searches (default 5)
- \`allowed_domains\` — optional list to restrict search to specific domains

## Response structure

- **Text blocks** — Claude's explanatory text.
- **Tool use blocks** — the search queries Claude ran.
- **Web search result blocks** — found pages (title, URL).
- **Citation blocks** — the specific text supporting Claude's statements.

UI pattern: render text normally, show search results as a reference list, and highlight citations with source attribution (domain, title, URL, quoted text). Domain restriction is great for quality control — e.g. limiting to NIH.gov for medical advice ensures scientifically-backed sources.`,
      keyTakeaways: [
        'Built-in and fully server-side — no implementation required.',
        'Configure max_uses and allowed_domains; responses include citations.',
        'Domain restriction improves source quality.',
      ],
    },
  ],
}
