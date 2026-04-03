const n=`# Module 1 — LLM Fundamentals

## Overview
- Understand how Large Language Models generate text — tokens, context windows, and sampling
- Master prompt engineering patterns for reliable, structured outputs
- Use the Anthropic and OpenAI SDKs with function calling for tool-augmented generation

---

## Token Generation Process

\`\`\`
  Input: "Hello, my name is"
       │
       ▼
  ┌──────────────────────┐
  │     Tokenizer        │
  │  "Hello" → 15496     │
  │  "," → 11            │
  │  " my" → 616         │
  │  " name" → 1438      │
  │  " is" → 318         │
  └──────────┬───────────┘
             │  token IDs: [15496, 11, 616, 1438, 318]
             ▼
  ┌──────────────────────┐
  │  Embedding Layer     │
  │  each ID → vector    │
  │  (768 or 4096 dims)  │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Transformer Layers  │
  │  self-attention +    │
  │  feed-forward        │
  │  (repeated N times)  │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Logits (vocab size) │
  │  50,000+ scores, one │
  │  per possible token  │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Sampling            │
  │  temperature=0 →     │
  │    argmax (greedy)   │
  │  temperature=1 →     │
  │    proportional      │
  │  temperature=2 →     │
  │    more random       │
  └──────────┬───────────┘
             │  next token: "Erick"
             ▼
        repeat until <EOS>
\`\`\`

---

## Prompt Anatomy

\`\`\`
  ┌──────────────────────────────────────────────────────┐
  │  SYSTEM MESSAGE                                      │
  │  "You are a helpful assistant that extracts          │
  │   structured data. Always respond in JSON.           │
  │   Never include explanations outside the JSON."      │
  ├──────────────────────────────────────────────────────┤
  │  FEW-SHOT EXAMPLES (optional but powerful)           │
  │  User: "John Smith, 35 years old, engineer"          │
  │  Asst: {"name":"John Smith","age":35,"job":"eng"}    │
  │  User: "Maria García, developer, 28"                 │
  │  Asst: {"name":"Maria García","age":28,"job":"dev"}  │
  ├──────────────────────────────────────────────────────┤
  │  USER MESSAGE                                        │
  │  "Erick Bárcenas, cloud architect, 32"               │
  ├──────────────────────────────────────────────────────┤
  │  ASSISTANT PREFIX (optional, forces format)          │
  │  "{"                                                 │
  └──────────────────────────────────────────────────────┘

  Temperature guide:
  0.0  → deterministic, best for extraction/classification
  0.3  → mostly consistent, slight variation
  0.7  → balanced creativity (default for chat)
  1.0+ → high creativity, use for brainstorming only
\`\`\`

---

## Function Calling Flow

\`\`\`
  User: "What is the weather in Mexico City?"
       │
       ▼
  ┌──────────────────────────────────────────────┐
  │  LLM receives tools definition:              │
  │  {                                           │
  │    "name": "get_weather",                    │
  │    "description": "Get current weather",     │
  │    "parameters": {                           │
  │      "city": { "type": "string" }            │
  │    }                                         │
  │  }                                           │
  └──────────────────┬───────────────────────────┘
                     │
                     │  Model decides to call tool
                     ▼
  ┌──────────────────────────────────────────────┐
  │  Tool Call response:                         │
  │  { "name": "get_weather",                    │
  │    "input": { "city": "Mexico City" } }      │
  └──────────────────┬───────────────────────────┘
                     │
                     │  Your code executes the function
                     ▼
  ┌──────────────────────────────────────────────┐
  │  Tool Result:                                │
  │  { "temperature": 22, "condition": "Sunny" } │
  └──────────────────┬───────────────────────────┘
                     │
                     │  Sent back to LLM
                     ▼
  "The current weather in Mexico City is 22°C and sunny."
\`\`\`

---

## Key Concepts

- **Context window**: Max tokens the model can see at once (Claude: 200K, GPT-4: 128K). Prompt + history + response all count
- **Token ≠ word**: ~4 chars per token in English. Code is more expensive (more tokens per line)
- **Temperature**: Not "randomness of the model" — it's scaling of the logit distribution before sampling
- **Structured output**: Use \`response_format: { type: "json_object" }\` or define output schema in system prompt + parse with Pydantic

---

## Teaching Notes

- **Common mistake**: Setting temperature=1 for extraction tasks — outputs become inconsistent. Use 0 or 0.1 for structured tasks
- **Gotcha**: Context window costs money in both directions. A 200K context model doesn't mean you should send 200K tokens every call
- **Prompt injection**: User input that says "Ignore previous instructions and..." — always sanitize and separate user data from instructions
- **Few-shot ordering**: The last example before the user message has the most influence — put the best example last

---

## Practice Exercise

1. Call the Anthropic API and extract structured data (name, email, job) from 5 unstructured bios
2. Compare outputs at temperature 0 vs 0.7 — document the differences
3. Implement function calling: create a \`search_orders(order_id: str)\` tool that queries a mock database
4. **Bonus**: Build a chain that first classifies user intent, then routes to a specialized prompt
`;export{n as default};
