import type { BuildModule } from '../../types'

export const m6: BuildModule = {
  id: 'm6',
  title: 'Model Context Protocol (MCP)',
  blurb:
    'A standard way to package tools, resources, and prompts behind a server so you stop hand-writing integration code. Build both a client and a server, debug with the inspector, and learn the three primitives.',
  lessons: [
    {
      id: 'mcp-intro',
      moduleId: 'm6',
      title: 'Introducing MCP',
      summary: 'A communication layer that shifts the burden of writing tools to the server author.',
      body: `**MCP** (Model Context Protocol) is a communication layer that provides Claude with context and tools **without you writing tedious integration code**.

## Architecture

An **MCP client** connects to an **MCP server**. The server contains **tools, resources, and prompts** as its internal components.

## The problem it solves

Traditionally, integrating a service means hand-authoring tool schemas and functions for every feature. A GitHub chatbot would need tools for repositories, pull requests, issues, projects — a serious maintenance burden.

MCP shifts tool definition and execution from *your* server to a **dedicated MCP server** that wraps a service's functionality into ready-to-use tools.

## Common questions

- **Who creates MCP servers?** Anyone — but often service providers ship official implementations (AWS, etc.).
- **vs direct API calls?** MCP saves you from authoring/maintaining schemas yourself.
- **vs tool use?** They're **complementary** — MCP changes *who does the work* of creating tools; both still involve tools.

Core value: it moves the integration burden from application developers to MCP server maintainers.`,
      keyTakeaways: [
        'MCP = a standard layer exposing tools, resources, and prompts via a server.',
        'It removes the burden of hand-writing schemas/functions for each service.',
        'Complementary to tool use — it changes who authors the tools.',
      ],
    },
    {
      id: 'mcp-clients',
      moduleId: 'm6',
      title: 'MCP Clients',
      summary: 'The transport-agnostic intermediary between your server and an MCP server.',
      body: `An **MCP client** is the communication interface between your server and an MCP server, giving you access to the server's tools.

It's **transport agnostic** — client and server can talk over stdio, HTTP, WebSockets, etc. A common setup runs both on the same machine over standard input/output.

## Key message types (defined by the MCP spec)

- **list tools request / result** — the client asks for available tools; the server responds with the list.
- **call tool request / result** — the client asks the server to run a tool with arguments; the server returns the result.

## Typical flow

1. User queries your server.
2. Your server asks the MCP client for tools.
3. The client sends a **list tools request** to the MCP server.
4. The server returns the tool list.
5. Your server sends the query + tools to Claude.
6. Claude requests a tool execution.
7. Your server asks the MCP client to run it.
8. The client sends a **call tool request** to the MCP server.
9. The MCP server executes the tool (e.g. a GitHub API call).
10. Results flow back through the chain: MCP server → client → your server → Claude → user.

The client is an **intermediary** — it doesn't execute tools itself; it facilitates communication with the MCP server that does.`,
      keyTakeaways: [
        'The client is a transport-agnostic intermediary, not the executor.',
        'Two core message pairs: list tools and call tool (request/result).',
        'Results flow back through client → your server → Claude → user.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'MCP client ↔ server message sequence',
          code: `sequenceDiagram
  participant Srv as Your server
  participant Cli as MCP client
  participant MCP as MCP server
  participant Cl as Claude
  Srv->>Cli: Need tools
  Cli->>MCP: list tools request
  MCP->>Cli: list tools result
  Cli->>Srv: tool list
  Srv->>Cl: query + tools
  Cl->>Srv: call tool request
  Srv->>Cli: run tool
  Cli->>MCP: call tool request
  MCP->>Cli: call tool result
  Cli->>Srv: result
  Srv->>Cl: tool_result
  Cl->>Srv: final answer`,
        },
      ],
    },
    {
      id: 'mcp-project-setup',
      moduleId: 'm6',
      title: 'Project Setup',
      summary: 'A CLI chatbot that implements BOTH a client and a server for learning.',
      body: `The learning project is a **CLI-based chatbot** that implements **both** an MCP client and an MCP server — unusual in the real world (you normally build one or the other), but useful for seeing the whole picture.

Components:
- **MCP client** — connects to the custom MCP server.
- **MCP server** — provides two tools: read document, update document.
- **Document collection** — fake documents stored **in memory only** (no persistence).

Setup steps:
1. Download \`CLI_project.zip\`, extract, open in an editor.
2. Follow \`readme.md\`.
3. Add your API key to \`.env\`.
4. Install dependencies (with or without **UV**).
5. Run with \`uv run main.py\` or \`python main.py\`.
6. Test with a chat prompt (e.g. "what's one plus one").

Expected outcome: a working chat interface ready for MCP feature additions.`,
      keyTakeaways: [
        'The project builds both client and server for educational completeness.',
        'Two starter tools: read document, update document; docs live in memory.',
        'Run via uv run main.py or python main.py after adding your API key.',
      ],
    },
    {
      id: 'mcp-defining-tools',
      moduleId: 'm6',
      title: 'Defining Tools with MCP',
      summary: 'The @mcp.tool decorator auto-generates schemas from typed functions.',
      body: `The MCP Python SDK creates tools through **decorators** instead of hand-written JSON schemas. The \`@mcp.tool\` decorator **auto-generates** the tool's JSON schema from the function's signature and type hints.

Syntax: \`@mcp.tool(name=..., description=...)\` on a function with typed parameters, using **\`Field()\`** (from pydantic) for argument descriptions.

The project's two tools:
1. **\`read_doc_contents\`** — takes a \`doc_id\` string, returns the document content from an in-memory \`docs\` dictionary.
2. **\`edit_document\`** — takes \`doc_id\`, \`old_string\`, \`new_string\`; performs find/replace on the content.

**Error handling** — check whether \`doc_id\` exists; raise \`ValueError\` if not.

The big advantage: the SDK eliminates manual schema writing, generating schemas automatically from the function definition. The pattern is: decorator → function signature (typed params with Field descriptions) → validation → core logic.`,
      keyTakeaways: [
        '@mcp.tool auto-generates the JSON schema from typed function signatures.',
        'Use Field() (pydantic) for argument descriptions.',
        'Validate inputs (e.g. doc exists) and raise ValueError otherwise.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Defining MCP tools',
          code: `from pydantic import Field

@mcp.tool(name="read_doc_contents", description="Read the contents of a document by its id.")
def read_doc_contents(doc_id: str = Field(description="The id of the document to read")):
    if doc_id not in docs:
        raise ValueError(f"No document with id {doc_id}")
    return docs[doc_id]`,
        },
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.1', label: 'Designing MCP tool interfaces' }],
    },
    {
      id: 'mcp-server-inspector',
      moduleId: 'm6',
      title: 'The Server Inspector',
      summary: 'An in-browser debugger to test MCP servers without a full app.',
      body: `The **MCP Inspector** is an in-browser debugger for testing MCP servers without connecting them to a real application.

**Access:** run \`mcp dev [server_file.py]\` in a terminal with your Python environment activated → it opens the server on a port → visit the provided localhost address.

**Interface:** a left sidebar with a **Connect** button → a top nav showing **Resources / Prompts / Tools** → the Tools section lists tools → click a tool to open a right panel for manual testing.

**Workflow:** connect → navigate to Tools → select a tool → input parameters (like a document ID) → click **Run Tool** → verify the output/success. You can chain operations (read, then edit, then read again) to verify changes.

It's actively developed (the UI may change), but the core value is constant: live development testing and manual tool invocation before any application integration.`,
      keyTakeaways: [
        'Launch with mcp dev [server_file.py]; test in the browser.',
        'Connect → Tools → fill parameters → Run Tool → verify.',
        'Lets you debug servers without wiring up a full app.',
      ],
    },
    {
      id: 'mcp-implementing-client',
      moduleId: 'm6',
      title: 'Implementing a Client',
      summary: 'A wrapper class around the SDK ClientSession with list_tools/call_tool.',
      body: `An **MCP client** here is a wrapper class around a **client session** that manages the connection and resource cleanup.

- **Client session** — the actual connection to the MCP server from the MCP Python SDK; it needs cleanup on close (handled by connect / cleanup / async-enter / async-exit methods).
- **Purpose** — exposes MCP server functionality to the rest of your codebase.

## Key functions

- **\`list_tools()\`** → \`await self.session.list_tools()\`, return \`result.tools\`.
- **\`call_tool()\`** → \`await self.session.call_tool(tool_name, tool_input)\`.

## Usage flow

1. Your app requests the tool list for Claude.
2. The client calls \`list_tools()\`.
3. Claude selects a tool and provides parameters.
4. The client calls \`call_tool()\` to execute it on the server.
5. Results return to Claude.

The common practice is wrapping the session in a larger class (rather than using it directly) for better resource management. You can run the client file directly with a test harness to verify the connection.`,
      keyTakeaways: [
        'Wrap the SDK ClientSession in a class for connection + cleanup.',
        'list_tools() and call_tool(name, input) are the core methods.',
        'The client exposes server tools to the rest of your app.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Client wrapper methods',
          code: `class MCPClient:
    async def list_tools(self):
        result = await self.session.list_tools()
        return result.tools

    async def call_tool(self, tool_name, tool_input):
        return await self.session.call_tool(tool_name, tool_input)`,
        },
      ],
    },
    {
      id: 'mcp-defining-resources',
      moduleId: 'm6',
      title: 'Defining Resources',
      summary: 'Expose data to clients via @mcp.resource — direct or templated URIs.',
      body: `**Resources** are an MCP server feature that exposes **data** to clients for read operations.

## Two types

- **Direct/static** — a static URI, e.g. \`docs://documents\`.
- **Templated** — a parameterized URI, e.g. \`docs://documents/{doc_id}\`.

A **URI** is the address/identifier for a resource, defined when you create it.

## Flow

Client sends a **read resource request** with a URI → the server matches the URI to a function → executes it → returns data in a **read resource result**.

## Implementation

Use the **\`@mcp.resource\`** decorator with a URI and a **MIME type** (a hint about the data format: \`application/json\`, \`text/plain\`). For templated resources, URI parameters are auto-parsed and passed as keyword arguments. The SDK auto-serializes returned data to strings; the client deserializes.

## Resources vs tools

- **Resources** provide data **proactively** (fetch document contents when @-mentioned) — *app-controlled*.
- **Tools** perform actions **reactively** (when Claude decides to call them) — *model-controlled*.

The exam uses resources as **content catalogs** (issue lists, schemas, doc trees) to reduce exploratory tool calls.`,
      keyTakeaways: [
        'Resources expose data via @mcp.resource with a URI + MIME type.',
        'Direct (static URI) vs templated (parameterized URI → kwargs).',
        'Resources are app-controlled/proactive; tools are model-controlled/reactive.',
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.4', label: 'MCP resources as content catalogs' }],
    },
    {
      id: 'mcp-accessing-resources',
      moduleId: 'm6',
      title: 'Accessing Resources',
      summary: 'Client-side read_resource that parses by MIME type.',
      body: `On the client side, a **\`read_resource\`** function requests and parses resources from the MCP server.

- Import \`json\` and **\`AnyUrl\`** from pydantic.
- Call \`await self.session.read_resource(AnyUrl(uri))\`.
- Extract the first element: \`result.contents[0]\`.
- Inspect \`resource.mime_type\` to decide parsing.

## Parsing logic

- If \`mime_type == "application/json"\` → return \`json.loads(resource.text)\`.
- Otherwise → return \`resource.text\` (plain text).

The server response is a \`result.contents\` list whose first element carries type/mime-type metadata. These client functions are called by other parts of your app — enabling, for instance, a CLI where you select a document (arrow keys + space) and its contents are automatically included in the Claude prompt, **without any tool call** needed to read it.`,
      keyTakeaways: [
        'read_resource(AnyUrl(uri)) → result.contents[0].',
        'Branch on mime_type: JSON → json.loads, else plain text.',
        'Lets selected documents flow into prompts without a tool call.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Reading a resource',
          code: `import json
from pydantic import AnyUrl

async def read_resource(self, uri):
    result = await self.session.read_resource(AnyUrl(uri))
    resource = result.contents[0]
    if resource.mimeType == "application/json":
        return json.loads(resource.text)
    return resource.text`,
        },
      ],
    },
    {
      id: 'mcp-defining-prompts',
      moduleId: 'm6',
      title: 'Defining Prompts',
      summary: 'Server-authored, pre-tested prompt templates exposed to clients.',
      body: `**MCP prompts** are pre-written, tested prompt templates that a server exposes to clients for specialized tasks. Instead of users writing ad-hoc prompts, server authors create high-quality, evaluated prompts tailored to the server's domain.

## Implementation

Use the **\`@mcp.prompt\`** decorator with a name and description. The function receives arguments (e.g. a document ID) and returns a **list of messages** (user/assistant) that can be sent straight to Claude. Messages are built with \`base.UserMessage\` objects containing the formatted prompt text with interpolated parameters.

## Example

A "format" prompt takes a document ID and instructs Claude to read the document with tools, reformat it to markdown, and save the changes.

## Client integration

Prompts appear as **autocomplete options / slash commands** in client apps. The user picks one (e.g. \`/format\`), supplies required parameters, and the pre-built workflow runs.

Benefits: server-specific expertise, pre-tested quality, reusability, and better results than user-generated prompts. This is the conceptual ancestor of Claude Code **skills/commands**.`,
      keyTakeaways: [
        'Prompts are server-authored, tested templates returning ready messages.',
        'Defined with @mcp.prompt; surfaced to users as slash commands.',
        'They encapsulate domain prompt-engineering expertise.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Defining an MCP prompt',
          code: `from mcp.server.fastmcp.prompts import base

@mcp.prompt(name="format", description="Rewrites a document in markdown")
def format_document(doc_id: str) -> list[base.Message]:
    return [base.UserMessage(
        f"Read document '{doc_id}', reformat it to markdown, and save the changes."
    )]`,
        },
      ],
    },
    {
      id: 'mcp-prompts-in-client',
      moduleId: 'm6',
      title: 'Prompts in the Client',
      summary: 'list_prompts and get_prompt feed server templates into Claude.',
      body: `On the client side, two functions complete the prompts story:

- **List prompts** — \`await self.session.list_prompts()\`, return \`result.prompts\`.
- **Get prompt** — \`await self.session.get_prompt(prompt_name, arguments)\`, return \`result.messages\`.

## Workflow

1. The server defines a prompt with expected arguments (e.g. \`document_id\`).
2. The client calls \`get_prompt\` with the name + an **arguments dictionary**.
3. Arguments are passed as keyword arguments to the prompt function.
4. The function interpolates them into the prompt text.
5. It returns a **messages array** to feed directly to the LLM.

CLI usage: \`/format\` → select a document → the prompt (with the document ID) is sent to Claude → Claude uses tools to fetch/reformat/save → returns the result.

The key concept: prompts are **server-defined templates** the client invokes with parameters — reusable AI instructions with dynamic content insertion.`,
      keyTakeaways: [
        'list_prompts() and get_prompt(name, args) retrieve server prompts.',
        'Arguments flow: client dict → prompt function kwargs → interpolated text → LLM.',
        'Returns a messages array ready to send to Claude.',
      ],
    },
    {
      id: 'mcp-review',
      moduleId: 'm6',
      title: 'The 3-Primitive Review',
      summary: 'Tools (model-controlled), resources (app-controlled), prompts (user-controlled).',
      body: `MCP servers expose **three primitives**, distinguished by *who controls them*:

- **Tools** — **model-controlled**. Claude decides when to execute them. Used to add capabilities (e.g. JavaScript execution for calculations). **They serve the model.**
- **Resources** — **app-controlled**. Your application code decides when to fetch data. Used to get data into apps for UI display or prompt augmentation (autocomplete options, document listings from Google Drive). **They serve the app.**
- **Prompts** — **user-controlled**. Triggered by user actions like button clicks or slash commands. Used for predefined workflows (chat-starter buttons in the Claude interface). **They serve users.**

The control pattern tells you which to reach for:

> Need a Claude **capability** → tool. Need **app data** → resource. Need a **user workflow** → prompt.

Real examples: Claude's chat-starter buttons use **prompts**; Google Drive document selection uses **resources**; code execution uses **tools**.`,
      keyTakeaways: [
        'Tools = model-controlled; resources = app-controlled; prompts = user-controlled.',
        'Capability → tool; app data → resource; user workflow → prompt.',
        'The "who controls it" lens disambiguates the three primitives.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'The three MCP primitives by controller',
          code: `flowchart TD
  M[Model controls] --> Tools[Tools — add capabilities]
  A[App controls] --> Res[Resources — provide data]
  U[User controls] --> Pr[Prompts — predefined workflows]`,
        },
      ],
      examRelevance: [{ domainId: 'd2', taskId: 't2.4', label: 'Tools for actions, resources for catalogs' }],
    },
  ],
}
