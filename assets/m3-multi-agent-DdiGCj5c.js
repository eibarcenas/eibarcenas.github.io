const e=`# Module 3 — Multi-Agent Systems

## Overview
- Understand the ReAct reasoning loop and how agents decide which tools to call
- Design multi-agent systems with LangGraph — nodes, edges, and shared state
- Implement agent memory (short-term context, long-term vector store, episodic)

---

## ReAct Agent Loop

\`\`\`
  User: "Research the top 3 cloud providers and create a comparison table"
       │
       ▼
  ┌─────────────────────────────────────────────────────────┐
  │  THOUGHT: I need to search for information about each   │
  │  cloud provider. Let me start with AWS.                 │
  ├─────────────────────────────────────────────────────────┤
  │  ACTION: search("AWS market share and key features")    │
  ├─────────────────────────────────────────────────────────┤
  │  OBSERVATION: "AWS holds 31% market share, known for    │
  │  breadth of services (200+), strong enterprise..."      │
  └─────────────────────────┬───────────────────────────────┘
                            │ loop continues
                            ▼
  ┌─────────────────────────────────────────────────────────┐
  │  THOUGHT: Got AWS data. Now search GCP.                 │
  ├─────────────────────────────────────────────────────────┤
  │  ACTION: search("GCP market share and key features")    │
  ├─────────────────────────────────────────────────────────┤
  │  OBSERVATION: "GCP holds 11%, known for data/AI..."     │
  └─────────────────────────┬───────────────────────────────┘
                            │ (Azure search...)
                            ▼
  ┌─────────────────────────────────────────────────────────┐
  │  THOUGHT: I have all data. Time to create the table.    │
  ├─────────────────────────────────────────────────────────┤
  │  ACTION: create_table(data=[aws, gcp, azure])           │
  ├─────────────────────────────────────────────────────────┤
  │  OBSERVATION: table created                             │
  ├─────────────────────────────────────────────────────────┤
  │  FINAL ANSWER: [markdown table with comparison]         │
  └─────────────────────────────────────────────────────────┘
\`\`\`

---

## LangGraph State Machine

\`\`\`
  State:
  ┌─────────────────────────────────┐
  │  {                              │
  │    "messages": [...],           │
  │    "research_results": {},      │
  │    "final_answer": null         │
  │  }                              │
  └─────────────────────────────────┘

  Graph:
  ┌──────────┐
  │  START   │
  └────┬─────┘
       │
       ▼
  ┌──────────┐     tool call?      ┌──────────────┐
  │  Agent   │────────────────────►│  Tool Node   │
  │  Node    │◄────────────────────│  (execute    │
  │ (LLM)   │   tool result        │   tools)     │
  └────┬─────┘                     └──────────────┘
       │
       │  no tool call (final answer)
       ▼
  ┌──────────┐
  │   END    │
  └──────────┘

  Conditional edge logic (Python):
  def should_continue(state):
      last_msg = state["messages"][-1]
      if last_msg.tool_calls:
          return "tool_node"
      return END
\`\`\`

---

## Multi-Agent Hierarchy

\`\`\`
  User Request
       │
       ▼
  ┌──────────────────────────────────────────────┐
  │           ORCHESTRATOR AGENT                 │
  │  "Plan the task and delegate to specialists" │
  │                                              │
  │  Tools:                                      │
  │  ├── call_researcher(query)                  │
  │  ├── call_writer(content, format)            │
  │  └── call_reviewer(draft)                    │
  └──────────────────────┬───────────────────────┘
                         │  delegates subtasks
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
  ┌──────────────┐ ┌────────────┐ ┌───────────┐
  │  Researcher  │ │  Writer    │ │ Reviewer  │
  │  Agent       │ │  Agent     │ │ Agent     │
  │              │ │            │ │           │
  │  Tools:      │ │  Tools:    │ │  Tools:   │
  │  web_search  │ │  write_doc │ │  critique │
  │  fetch_url   │ │  format_md │ │  score    │
  │  extract_data│ │            │ │           │
  └──────────────┘ └────────────┘ └───────────┘
\`\`\`

---

## Agent Memory Types

\`\`\`
  ┌─────────────────────────────────────────────────────┐
  │  SHORT-TERM (In-Context)                            │
  │  The conversation messages list                     │
  │  Cleared between sessions                          │
  │  Cost: tokens × price/token                        │
  ├─────────────────────────────────────────────────────┤
  │  LONG-TERM (External Vector Store)                  │
  │  Persistent facts about the user / world            │
  │  Retrieved via similarity search                    │
  │  e.g., "User prefers Python over JavaScript"       │
  ├─────────────────────────────────────────────────────┤
  │  EPISODIC (Summaries of past sessions)              │
  │  Compressed summaries of previous conversations    │
  │  Injected into system prompt for returning users    │
  │  e.g., "Last week discussed refund feature"        │
  ├─────────────────────────────────────────────────────┤
  │  SEMANTIC (Knowledge Base)                          │
  │  Domain knowledge, documentation (RAG)              │
  │  Retrieved per query, not per user                  │
  └─────────────────────────────────────────────────────┘
\`\`\`

---

## Key Concepts

- **Checkpointing**: LangGraph supports persisting state to SQLite/Postgres — agents can be paused and resumed
- **Human-in-the-loop**: Use \`interrupt_before\` or \`interrupt_after\` to pause execution at a node for human approval
- **Tool errors**: Always handle tool exceptions — return error strings back to the model, don't raise exceptions
- **Max iterations**: Set a maximum recursion depth to prevent runaway agents (LangGraph: \`recursion_limit\`)

---

## Teaching Notes

- **Common mistake**: Building a multi-agent system when a single agent with more tools would suffice. Start simple
- **Gotcha**: Agents are non-deterministic. The same input can produce different tool call sequences. Add tracing from day one
- **Cost control**: Every agent loop iteration costs tokens. Add \`max_iterations\` and log token usage per run
- **Debugging**: Use LangSmith or LangFuse to trace agent steps — you cannot debug agents by reading code alone

---

## Practice Exercise

1. Build a ReAct agent with 3 tools: \`search_web\`, \`read_url\`, \`save_note\`
2. Add a LangGraph checkpointer (SQLite) so conversations persist across runs
3. Implement human-in-the-loop: agent must ask for approval before calling \`save_note\`
4. **Bonus**: Build a supervisor agent that routes tasks to a "researcher" and a "writer" subagent based on task type
`;export{e as default};
