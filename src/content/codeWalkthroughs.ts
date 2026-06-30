import type { Walkthrough } from './types'

// Step-by-step annotated code walkthroughs for code-heavy Build-track topics.
// Each step reveals one stage with commentary.

export const walkthroughs: Walkthrough[] = [
  {
    id: 'tool-use-loop',
    title: 'The Tool-Use Loop',
    intro:
      'Build the agentic loop from scratch: define a tool, send its schema, detect a tool_use request, run the tool, return the result, and continue until Claude is done. This is the pattern the Architect exam centers on.',
    steps: [
      {
        lang: 'python',
        commentary:
          'Start with a plain Python tool function. Validate inputs and raise meaningful errors — the message is visible to Claude and lets it self-correct.',
        code: `from datetime import datetime

def get_current_datetime(date_format="%Y-%m-%d %H:%M:%S"):
    if not date_format:
        raise ValueError("date_format cannot be empty")
    return datetime.now().strftime(date_format)`,
      },
      {
        lang: 'python',
        commentary:
          'Describe the tool with a JSON schema. The description is the primary signal Claude uses to decide when to call it — be specific about what it does, when to use it, and what it returns.',
        code: `get_current_datetime_schema = {
    "name": "get_current_datetime",
    "description": (
        "Returns the current date and time. Use before computing any future "
        "date. Returns a formatted datetime string."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "date_format": {"type": "string",
                "description": "strftime format string"}
        },
    },
}`,
      },
      {
        lang: 'python',
        commentary:
          'Send the request WITH the tools. The response now contains multiple content blocks (text and/or tool_use), and stop_reason tells you what happened.',
        code: `messages = [{"role": "user", "content": "What is the date and time right now?"}]

response = client.messages.create(
    model=model, max_tokens=1000,
    messages=messages, tools=[get_current_datetime_schema],
)
print(response.stop_reason)   # -> "tool_use"`,
      },
      {
        lang: 'python',
        commentary:
          'Append the assistant message (ALL blocks), then find each tool_use block. tool_use_id is what pairs a result to its request — essential when several tools are called at once.',
        code: `messages.append({"role": "assistant", "content": response.content})

tool_results = []
for block in response.content:
    if block.type == "tool_use":
        output = run_tool(block.name, block.input)   # dispatch by name
        tool_results.append({
            "type": "tool_result",
            "tool_use_id": block.id,          # match the request
            "content": str(output),
            "is_error": False,
        })`,
      },
      {
        lang: 'python',
        commentary:
          'Send results back in a USER message (with the full history and the original schemas). Claude integrates them and produces its next response.',
        code: `messages.append({"role": "user", "content": tool_results})

response = client.messages.create(
    model=model, max_tokens=1000,
    messages=messages, tools=[get_current_datetime_schema],
)`,
      },
      {
        lang: 'python',
        commentary:
          'Wrap it in a loop keyed on stop_reason. Continue while "tool_use"; stop on "end_turn". Never parse assistant text for completion or use an iteration cap as the primary stop — those are exam anti-patterns.',
        code: `def run_conversation(messages, tools):
    while True:
        response = client.messages.create(
            model=model, max_tokens=1000, messages=messages, tools=tools)
        messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason != "tool_use":
            break                                  # end_turn -> done
        results = run_tools(response)              # build tool_result blocks
        messages.append({"role": "user", "content": results})
    return messages`,
      },
    ],
  },
  {
    id: 'rag-pipeline',
    title: 'A RAG Pipeline',
    intro:
      'Walk through retrieval-augmented generation end to end: chunk a document, embed the chunks, store them with their text, embed the query, retrieve the closest chunks, and assemble the final prompt.',
    steps: [
      {
        lang: 'python',
        commentary:
          'Step 1 — chunk the source document. Here we split on structure (markdown sections); size-based with overlap is the common fallback.',
        code: `text = open("report.md").read()
chunks = chunk_by_section(text)   # structure-based chunking on ## headers`,
      },
      {
        lang: 'python',
        commentary:
          'Step 2 — embed each chunk into a vector. The embedding function accepts a list, returning one vector per chunk.',
        code: `embeddings = generate_embedding(chunks)   # list[str] -> list[vector]`,
      },
      {
        lang: 'python',
        commentary:
          'Steps 3–4 — store each embedding WITH its original text as metadata. Without storing the text, retrieval results would be meaningless vectors.',
        code: `store = VectorIndex()
for emb, chunk in zip(embeddings, chunks):
    store.add_vector(emb, {"content": chunk})   # text rides along as metadata`,
      },
      {
        lang: 'python',
        commentary:
          'Steps 5–6 — embed the user query with the SAME model, then run a similarity search (cosine distance) for the k closest chunks.',
        code: `query = "What did the software engineering department do last year?"
q_emb = generate_embedding(query)
results = store.search(q_emb, k=2)    # 2 closest chunks + distances`,
      },
      {
        lang: 'python',
        commentary:
          'Step 7 — assemble the prompt from the retrieved chunks plus the question, wrapped in XML tags so Claude knows what is context vs. instruction.',
        code: `context = "\\n\\n".join(r["content"] for r in results)
prompt = f"""Answer using only the context below.

<context>
{context}
</context>

Question: {query}"""
answer = chat([{"role": "user", "content": prompt}])`,
      },
      {
        lang: 'python',
        commentary:
          'Upgrade: add BM25 lexical search alongside the vector index and merge with Reciprocal Rank Fusion so exact-term matches aren’t missed.',
        code: `class Retriever:
    def search(self, query, k):
        vec = self.vector_index.search(query, k)
        lex = self.bm25_index.search(query, k)
        return reciprocal_rank_fusion([vec, lex])   # 1/(rank+1) summed`,
      },
    ],
  },
  {
    id: 'mcp-server',
    title: 'An MCP Server with @mcp.tool',
    intro:
      'Define a minimal MCP server whose tools are generated from typed Python functions — no hand-written JSON schemas — then test it in the inspector.',
    steps: [
      {
        lang: 'python',
        commentary:
          'Create the server and an in-memory document store. FastMCP turns decorated functions into fully-described tools.',
        code: `from mcp.server.fastmcp import FastMCP
from pydantic import Field

mcp = FastMCP("documents")

docs = {
    "report.pdf": "The quarterly report covering engineering and sales.",
    "plan.md": "Roadmap for the next two quarters.",
}`,
      },
      {
        lang: 'python',
        commentary:
          'Define a read tool. The @mcp.tool decorator auto-generates the JSON schema from the signature; Field() supplies the argument description. Validate and raise on missing docs.',
        code: `@mcp.tool(name="read_doc_contents",
          description="Read the full contents of a document by its id.")
def read_doc_contents(
    doc_id: str = Field(description="The id of the document to read"),
):
    if doc_id not in docs:
        raise ValueError(f"No document with id {doc_id}")
    return docs[doc_id]`,
      },
      {
        lang: 'python',
        commentary:
          'Define an edit tool that find/replaces within a document — again with validation. Two tools, zero hand-written schemas.',
        code: `@mcp.tool(name="edit_document",
          description="Find and replace a string within a document.")
def edit_document(
    doc_id: str = Field(description="The document to edit"),
    old_string: str = Field(description="Text to replace"),
    new_string: str = Field(description="Replacement text"),
):
    if doc_id not in docs:
        raise ValueError(f"No document with id {doc_id}")
    docs[doc_id] = docs[doc_id].replace(old_string, new_string)
    return docs[doc_id]`,
      },
      {
        lang: 'python',
        commentary:
          'Expose a resource (app-controlled data) so clients can list documents without a tool call. Resources serve the app; tools serve the model.',
        code: `@mcp.resource("docs://documents", mime_type="application/json")
def list_documents():
    return list(docs.keys())`,
      },
      {
        lang: 'bash',
        commentary:
          'Test the server in the browser with the inspector before wiring it to any app: connect, open Tools, fill parameters, Run Tool, verify output.',
        code: `mcp dev server.py
# open the printed localhost URL -> Connect -> Tools -> read_doc_contents`,
      },
    ],
  },
  {
    id: 'agentic-loop',
    title: 'The Agentic Loop (stop_reason)',
    intro:
      'The minimal, exam-faithful agentic loop: control flow driven entirely by stop_reason, with structured tool dispatch and error handling — no text parsing, no arbitrary caps as the stopping mechanism.',
    steps: [
      {
        lang: 'python',
        commentary:
          'A dispatcher maps tool names to functions. Wrap execution in try/except so failures become structured tool errors rather than crashes.',
        code: `def run_tool(name, tool_input):
    try:
        if name == "get_customer":
            return {"ok": True, "data": get_customer(**tool_input)}
        if name == "lookup_order":
            return {"ok": True, "data": lookup_order(**tool_input)}
        raise ValueError(f"Unknown tool: {name}")
    except Exception as e:
        return {"ok": False, "error": str(e)}`,
      },
      {
        lang: 'python',
        commentary:
          'Build one tool_result per tool_use block. Set is_error from the structured result so the model can decide whether to retry or explain.',
        code: `def run_tools(message):
    results = []
    for block in message.content:
        if block.type != "tool_use":
            continue
        out = run_tool(block.name, block.input)
        results.append({
            "type": "tool_result",
            "tool_use_id": block.id,
            "content": str(out),
            "is_error": not out["ok"],
        })
    return results`,
      },
      {
        lang: 'python',
        commentary:
          'The loop itself. The ONLY termination signal is stop_reason: continue on "tool_use", stop on "end_turn".',
        code: `def run_agent(messages, tools):
    while True:
        resp = client.messages.create(
            model=model, max_tokens=2000, messages=messages, tools=tools)
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason == "end_turn":
            return messages                 # done
        if resp.stop_reason == "tool_use":
            messages.append({"role": "user", "content": run_tools(resp)})
            continue
        return messages                     # other stop reasons -> finish`,
      },
      {
        lang: 'python',
        commentary:
          'For business-critical ordering (verify identity before refunding), enforce it programmatically — a prerequisite gate or hook — NOT a prompt instruction. Deterministic beats probabilistic when money is involved.',
        code: `def run_tool_guarded(name, tool_input, state):
    if name in ("lookup_order", "process_refund") and not state.get("verified_customer_id"):
        return {"ok": False, "error": "Blocked: call get_customer to verify identity first."}
    if name == "get_customer":
        customer = get_customer(**tool_input)
        state["verified_customer_id"] = customer["id"]   # unlock downstream tools
        return {"ok": True, "data": customer}
    return run_tool(name, tool_input)`,
      },
    ],
  },
]

export function walkthroughById(id: string): Walkthrough | undefined {
  return walkthroughs.find((w) => w.id === id)
}
