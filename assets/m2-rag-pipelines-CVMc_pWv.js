const e=`# Module 2 — RAG Pipelines

## Overview
- Build a complete Retrieval-Augmented Generation pipeline from document ingestion to answer generation
- Understand chunking strategies, embedding models, and vector database selection
- Evaluate RAG quality using faithfulness, relevance, and groundedness metrics

---

## RAG Pipeline Architecture

\`\`\`
  INDEXING PHASE (offline / batch)
  ────────────────────────────────

  Documents (PDF, MD, HTML, DB)
       │
       ▼
  ┌───────────────┐
  │   Loader      │  LlamaIndex SimpleDirectoryReader
  │               │  or custom loaders per source
  └───────┬───────┘
          │  raw text + metadata
          ▼
  ┌───────────────┐
  │   Chunker     │  RecursiveCharacterTextSplitter
  │               │  chunk_size=512, overlap=64
  └───────┬───────┘
          │  chunks: List[Document]
          ▼
  ┌───────────────┐
  │   Embedder    │  text-embedding-3-small (OpenAI)
  │               │  or voyage-large-2 (Anthropic)
  └───────┬───────┘
          │  vectors: List[float[1536]]
          ▼
  ┌───────────────┐
  │ Vector Store  │  Pinecone / pgvector / Qdrant
  │               │  stores vector + metadata + text
  └───────────────┘

  RETRIEVAL PHASE (online / per query)
  ──────────────────────────────────────

  User Question: "What is the refund policy?"
       │
       ▼  embed question (same model as indexing)
  [0.12, -0.45, 0.88, ...]  query vector
       │
       ▼  similarity search (cosine)
  ┌───────────────┐
  │ Vector Store  │  top-k=5 most similar chunks
  └───────┬───────┘
          │  retrieved_docs: List[Document]
          ▼
  ┌───────────────────────────────────────────┐
  │  Context Window Assembly                  │
  │  system: "Answer using only this context" │
  │  context: [chunk1, chunk2, ..., chunk5]   │
  │  user: "What is the refund policy?"       │
  └───────────────────┬───────────────────────┘
                      │
                      ▼
                   LLM → Answer (grounded in docs)
\`\`\`

---

## Chunking Strategy Comparison

\`\`\`
  ┌─────────────────┬──────────────────────────────────────┐
  │ Strategy        │ When to use                          │
  ├─────────────────┼──────────────────────────────────────┤
  │ Fixed Size      │ Simple baseline. Fast.               │
  │ 512 tokens,     │ Bad: splits mid-sentence.            │
  │ 64 overlap      │ Use for: logs, structured data       │
  ├─────────────────┼──────────────────────────────────────┤
  │ Recursive       │ Tries paragraphs → sentences →       │
  │ Character       │ words. Best default strategy.        │
  │ Splitter        │ Use for: documents, articles         │
  ├─────────────────┼──────────────────────────────────────┤
  │ Semantic        │ Groups by meaning using embeddings.  │
  │ Chunking        │ Expensive but best quality.          │
  │                 │ Use for: high-value knowledge bases  │
  ├─────────────────┼──────────────────────────────────────┤
  │ Markdown/Code   │ Split by headers (##, ###) or        │
  │ Aware           │ function boundaries.                 │
  │                 │ Use for: docs sites, codebases       │
  └─────────────────┴──────────────────────────────────────┘
\`\`\`

---

## RAG Evaluation Metrics

\`\`\`
  Retrieved Chunks              Generated Answer
  ────────────────              ─────────────────

  Chunk 1: "Refunds processed   "Refunds are processed
  within 5 business days"       within 5 business days
                                 and require a receipt."
  Chunk 2: "A receipt is
  required for all refunds"

  ┌─────────────────────────────────────────────────────┐
  │  Faithfulness (0-1):                                │
  │  "Is every claim in the answer supported by         │
  │   the retrieved context?"                           │
  │  Score: 1.0 (both claims come from chunks)         │
  ├─────────────────────────────────────────────────────┤
  │  Answer Relevance (0-1):                            │
  │  "Does the answer address the original question?"   │
  │  Score: 0.9                                         │
  ├─────────────────────────────────────────────────────┤
  │  Context Recall (0-1):                              │
  │  "Did retrieval find all relevant information?"     │
  │  Compare retrieved vs ground truth docs             │
  └─────────────────────────────────────────────────────┘

  Tools: RAGAS framework, LlamaIndex Evaluator, Langfuse
\`\`\`

---

## Key Concepts

- **Embedding model must match**: Index and query with the same embedding model — mixing them breaks similarity search
- **Chunk overlap**: A 10-15% overlap ensures context at chunk boundaries isn't lost
- **Metadata filtering**: Store \`source\`, \`page\`, \`date\` as metadata — filter before vector search for efficiency
- **Hybrid search**: Combine dense (semantic) + sparse (BM25/keyword) retrieval. Use Reciprocal Rank Fusion to merge results

---

## Teaching Notes

- **Common mistake**: Indexing entire documents as one chunk — retrieval will always return the same giant doc regardless of query
- **Gotcha**: Vector similarity is not the same as relevance to the question. A chunk semantically similar to the query might not answer it
- **Hallucination**: Even with RAG, LLMs can hallucinate. Add \`"If the context doesn't contain the answer, say 'I don't know'"\` to system prompt
- **Cost**: Embedding 1M tokens ≈ $0.02 (text-embedding-3-small). Retrieval is cheap; keep index fresh with incremental updates

---

## Practice Exercise

1. Build a RAG system over a set of markdown docs (use your own notes or a small Wikipedia dump)
2. Compare chunking strategies (fixed 256 vs recursive 512) — which gives better answers and why?
3. Add metadata filtering (by date or category) before vector search
4. **Bonus**: Implement hybrid search (pgvector full-text + embedding) and compare results with pure semantic search
`;export{e as default};
