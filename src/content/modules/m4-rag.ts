import type { BuildModule } from '../types'

export const m4: BuildModule = {
  id: 'm4',
  title: 'Retrieval Augmented Generation (RAG)',
  blurb:
    'Query large documents without blowing the context window: chunk, embed, retrieve the relevant pieces, and improve recall with hybrid search, RRF, reranking, and contextual retrieval.',
  lessons: [
    {
      id: 'introducing-rag',
      moduleId: 'm4',
      title: 'Introducing RAG',
      summary: 'Retrieve only the relevant chunks instead of stuffing whole documents into the prompt.',
      body: `**RAG** (Retrieval Augmented Generation) is a technique for querying large documents (100–1000+ pages) without hitting context limits.

## Two options

- **Option 1 — Direct.** Put the entire document into the prompt. Limitations: hard token limits, degraded effectiveness on very long prompts, higher cost, slower processing.
- **Option 2 — RAG.** A two-step process: (1) break the document into small **chunks**; (2) for each question, find the **most relevant** chunks and include only those.

## Trade-offs

**Benefits:** the model focuses on relevant content, scales to large/multiple documents, smaller prompts, lower cost, faster. **Downsides:** more complexity, a preprocessing step, a search mechanism to find relevant chunks, and no guarantee chunks contain complete context.

The core challenge is defining **relevance** and choosing a **chunking strategy** for your use case. RAG trades simplicity for scalability and efficiency.`,
      keyTakeaways: [
        'RAG retrieves only relevant chunks rather than the whole document.',
        'Benefits: scale, lower cost, faster, focused context. Costs: complexity + preprocessing.',
        'The hard parts are defining relevance and chunking well.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Direct prompt vs RAG',
          code: `flowchart LR
  subgraph Direct
    D1[Whole 500-page doc] --> P1[Prompt] --> M1[Model]
  end
  subgraph RAG
    D2[Doc] --> Ch[Chunks] --> R[Retrieve relevant] --> P2[Small prompt] --> M2[Model]
  end`,
        },
      ],
    },
    {
      id: 'chunking-strategies',
      moduleId: 'm4',
      title: 'Text Chunking Strategies',
      summary: 'Size-based, structure-based, and semantic chunking — and overlap.',
      body: `Chunking quality directly drives RAG performance. Poor chunking retrieves irrelevant context — e.g. a medical "bug" passage surfacing for a software-engineering query about bugs.

## Three strategies

1. **Size-based** — divide text into equal-length strings. *Easy, most common in production.* Downsides: cut-off words, lost context. Fix with an **overlap** strategy — include characters from neighboring chunks to preserve context (at the cost of duplication).
2. **Structure-based** — split on document structure (headers, paragraphs, sections). Best for structured docs (markdown, HTML), e.g. splitting on \`##\` headers. Requires guaranteed formatting.
3. **Semantic-based** — use NLP to group related sentences by similarity. Most advanced, most complex to implement.

## Rules of thumb

- **By character** — most reliable fallback; works on any document.
- **By sentence** — good middle ground if sentence detection is reliable.
- **By section** — optimal results, but needs structured input.

There's **no universal best** — it depends on your document's structure guarantees and use case.`,
      keyTakeaways: [
        'Three strategies: size-based (+overlap), structure-based, semantic.',
        'Overlap preserves context at the cost of duplication.',
        'No universal best — choose by document structure and use case.',
      ],
    },
    {
      id: 'embeddings',
      moduleId: 'm4',
      title: 'Text Embeddings',
      summary: 'Numerical vectors capturing meaning, enabling semantic search.',
      outOfScope: true,
      outOfScopeNote:
        'Embedding models and vector-DB implementation details are explicitly OUT of scope for the Architect exam. Understand the concept; you won\'t be tested on the internals.',
      body: `A **text embedding** is a numerical representation of text meaning produced by an embedding model. The model takes text and outputs a long list of numbers (each roughly in the range -1 to +1).

Each number scores some unknown quality/feature of the text (happiness, topic relevance, etc.) — the exact meaning of each dimension is **not known** to us, but similar texts get similar vectors.

**Semantic search** uses embeddings to find chunks related to a user's question — solving the "how do I match a query to relevant chunks" problem with *meaning* rather than *keyword* matching.

Pipeline role: extract chunks → user submits a query → find related chunks via semantic search → add them as context. Anthropic recommends **Voyage AI** for generating embeddings (separate account/API key, free to start, easy SDK integration).`,
      keyTakeaways: [
        'Embeddings turn text into meaning-vectors; similar text → similar vectors.',
        'Enables semantic (meaning) search, not keyword matching.',
        'Anthropic recommends Voyage AI for embeddings.',
      ],
      diagrams: [
        { kind: 'embedding', title: 'Vector space sketch', caption: 'Related concepts sit closer together in embedding space.' },
      ],
    },
    {
      id: 'full-rag-flow',
      moduleId: 'm4',
      title: 'The Full RAG Flow',
      summary: 'Seven steps from chunking to prompt assembly, split into preprocessing and retrieval.',
      body: `The full RAG flow is a **7-step process** combining chunking, embeddings, and vector search.

1. **Text chunking** — split source documents into pieces.
2. **Generate embeddings** — convert chunks to vectors.
3. **Normalization** — scale vector magnitudes to 1.0 (handled automatically by embedding APIs).
4. **Vector database storage** — store embeddings in a database optimized for vector operations.
5. **Query processing** — convert the user's question into an embedding with the **same model**.
6. **Similarity search** — find the most similar stored embeddings using **cosine similarity**.
7. **Prompt assembly** — combine the question + retrieved chunks, send to the LLM.

Steps 1–4 are **preprocessing**; steps 5–7 happen at **query time**.

## Key math

- **Cosine similarity** — cosine of the angle between vectors; ranges -1 to 1; closer to 1 = more similar.
- **Cosine distance** — 1 minus cosine similarity; closer to 0 = more similar.`,
      keyTakeaways: [
        'Seven steps: chunk, embed, normalize, store, embed query, similarity search, assemble.',
        'Steps 1–4 are preprocessing; 5–7 run per query.',
        'Cosine similarity (→1 = similar); cosine distance = 1 − similarity (→0 = similar).',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'The 7-step RAG flow',
          code: `flowchart TD
  subgraph Preprocessing
    S1[1. Chunk] --> S2[2. Embed]
    S2 --> S3[3. Normalize]
    S3 --> S4[(4. Vector DB)]
  end
  subgraph Query time
    Q[User query] --> S5[5. Embed query]
    S5 --> S6[6. Similarity search]
    S4 --> S6
    S6 --> S7[7. Assemble prompt]
    S7 --> LLM[LLM response]
  end`,
        },
      ],
    },
    {
      id: 'implementing-rag-flow',
      moduleId: 'm4',
      title: 'Implementing the RAG Flow',
      summary: 'A concrete 5-step walkthrough storing chunks alongside their embeddings.',
      body: `A practical walkthrough of RAG in five steps:

1. **Text chunking** — split the document into sections (\`chunk_by_section\` on \`report.md\`).
2. **Embedding generation** — create vectors for each chunk via \`generate_embedding\` (accepts a single string or a list).
3. **Vector store population** — create a vector index, loop chunk-embedding pairs with \`zip()\`, and store each with \`store.add_vector(embedding, {content: chunk})\`. **Store the original text alongside the embedding** so retrieval returns meaningful content.
4. **Query processing** — generate an embedding for the user's query (e.g. "what did the software engineering department do last year?").
5. **Similarity search** — \`store.search(user_embedding, 2)\` returns the 2 most relevant chunks with cosine distances.

The crucial implementation detail is step 3: **metadata storage** — keeping the original text with each embedding is what makes the results usable. The workflow is complete but still has limitations the later lessons address (exact-term matches, ranking nuance, lost context).`,
      keyTakeaways: [
        'Store the original chunk text as metadata alongside each embedding.',
        'search(query_embedding, k) returns the k closest chunks by cosine distance.',
        'A working baseline — later lessons fix its weaknesses.',
      ],
      code: [
        {
          lang: 'python',
          title: 'Populating and querying a vector store',
          code: `chunks = chunk_by_section(open("report.md").read())
embeddings = generate_embedding(chunks)

store = VectorIndex()
for emb, chunk in zip(embeddings, chunks):
    store.add_vector(emb, {"content": chunk})

q_emb = generate_embedding("what did software engineering do last year?")
results = store.search(q_emb, 2)   # 2 closest chunks + distances`,
        },
      ],
    },
    {
      id: 'bm25-lexical-search',
      moduleId: 'm4',
      title: 'BM25 Lexical Search',
      summary: 'Keyword search that complements semantic search\'s blind spots.',
      body: `**BM25** (Best Match 25) is a lexical (keyword) search algorithm commonly paired with semantic search in RAG.

The problem it solves: **semantic search alone can miss exact-term matches**, returning irrelevant results even when a specific term appears frequently in the right document. A **hybrid** approach runs semantic search (embeddings) and lexical search (BM25) **in parallel**, then merges results for a better balance.

## How BM25 works

1. **Tokenize** the query into terms (strip punctuation, split on spaces).
2. **Count frequency** of each term across all chunks.
3. **Weight by rarity** — rare terms get higher importance; common terms like "a" get lower importance.
4. **Rank** chunks by how often they contain higher-weighted terms.

The key insight: frequently-used terms across the corpus are **less** important for relevance than rare, specific terms. BM25 is great at exact-term matching and prioritizing documents with rare query terms — complementing semantic search's weaknesses. Both systems expose similar APIs (\`add_document\`, \`search\`), making them easy to combine.`,
      keyTakeaways: [
        'BM25 is keyword search; rare terms weigh more than common ones.',
        'Hybrid = semantic + BM25 in parallel, then merge.',
        'BM25 catches exact-term matches semantic search misses.',
      ],
    },
    {
      id: 'multi-index-pipeline',
      moduleId: 'm4',
      title: 'A Multi-Index RAG Pipeline',
      summary: 'Combine vector + BM25 indexes and merge with Reciprocal Rank Fusion.',
      body: `A multi-index pipeline combines a **vector index** (semantic) and a **BM25 index** (lexical), wrapped by a **Retriever** class that forwards a query to both and merges the results.

## Reciprocal Rank Fusion (RRF)

RRF merges ranked lists from different indexes. For each document, sum \`1 / (rank + 1)\` across all search methods; rank documents by the highest combined score.

> Example: vector search returns \`[doc2, doc7, doc6]\`, BM25 returns \`[doc6, doc2, doc7]\`. After RRF, the final ranking is \`[doc2, doc6, doc7]\` — doc2 wins because it ranked high in **both** methods.

Benefits: better accuracy by combining paradigms, a modular design with a standard API (\`search()\`, \`add_document()\`), easy extension with more indexes, and better handling of cases where one method fails. Each index stays isolated while contributing to the merged result.`,
      keyTakeaways: [
        'A Retriever forwards queries to both vector and BM25 indexes.',
        'RRF score = Σ 1/(rank+1) across methods; docs ranking high in both win.',
        'Modular and extensible — add more indexes behind the same API.',
      ],
      diagrams: [
        {
          kind: 'mermaid',
          title: 'Hybrid retrieval with RRF',
          code: `flowchart TD
  Q[Query] --> V[Vector index<br/>semantic]
  Q --> B[BM25 index<br/>lexical]
  V -->|ranked list| RRF[Reciprocal Rank Fusion]
  B -->|ranked list| RRF
  RRF --> M[Merged ranking]`,
        },
      ],
    },
    {
      id: 'reranking-results',
      moduleId: 'm4',
      title: 'Reranking Results',
      summary: 'A post-retrieval LLM pass that reorders candidates by true relevance.',
      body: `**Reranking** is a post-processing step where an LLM reorders search results by relevance *after* initial retrieval.

Process: run vector + BM25 → merge → pass candidates to an LLM with a prompt asking it to rank them by relevance → get a reordered list.

Implementation details: use **document IDs** rather than full text for efficiency; give the LLM the query + candidate documents + an instruction to return the most relevant docs in decreasing order; use assistant-message prefill + a stop sequence to get structured JSON output.

Trade-offs: reranking **increases accuracy** by leveraging the LLM's semantic understanding, but **adds latency** (an extra LLM call). It shines when initial retrieval misses nuanced intent.

> Example: "What did the engineering team do with incident 2023?" correctly prioritized the *software engineering* section over the *cybersecurity* section after reranking, even though hybrid search had ranked it lower (the model understood "ENG team" ≈ "engineering team").

This is a builder cousin of the exam's idea that a separate evaluating/judging pass improves quality.`,
      keyTakeaways: [
        'Reranking uses an LLM to reorder retrieved candidates by relevance.',
        'Use doc IDs + prefilled JSON output for efficiency/structure.',
        'Boosts accuracy at the cost of an extra LLM call (latency).',
      ],
      examRelevance: [{ domainId: 'd5', taskId: 't5.6', label: 'A judging/synthesis pass over retrieved evidence' }],
    },
    {
      id: 'contextual-retrieval',
      moduleId: 'm4',
      title: 'Contextual Retrieval',
      summary: 'Add situating context to each chunk before embedding to preserve meaning.',
      body: `**Contextual retrieval** improves accuracy by adding context to each chunk **before** embedding it.

The problem: splitting a document into chunks strips each chunk of context from the whole — hurting retrieval accuracy.

## The process

1. Take a chunk + the original source document.
2. Send to Claude with a prompt to **generate situating context** — a brief explanation of how the chunk relates to the larger document.
3. Join the generated context to the chunk → a **"contextualized chunk."**
4. Use the contextualized chunk as input to the vector/BM25 indexes.

## Handling large documents

If the source is too big for a single prompt, use a **selective context** strategy:
- Include **starter chunks** (1–3) from the beginning (summary/abstract).
- Include chunks **immediately before** the target for local context.
- **Skip** less-relevant middle chunks.

The benefit: chunks retain ties to the larger document structure and cross-references, improving retrieval for complex, interconnected documents. This directly parallels the exam's **context-preservation** theme (don't let summarization strip the facts a chunk needs to be understood).`,
      keyTakeaways: [
        'Prepend generated situating context to each chunk before embedding.',
        'For big docs, use selective context (starters + neighbors, skip the middle).',
        'Preserves cross-references and boosts retrieval accuracy.',
      ],
      examRelevance: [{ domainId: 'd5', taskId: 't5.1', label: 'Preserving critical context (anti lost-in-the-middle)' }],
    },
  ],
}
