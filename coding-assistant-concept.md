# Coding Assistant Concept

## Overview

This document defines the concept and architecture of a **Qdrant-backed RAG (Retrieval Augmented Generation) Coding Assistant** that provides information strictly from a knowledge base stored in a Qdrant vector database.

## Core Concept

The Coding Assistant is a specialized AI agent designed to:

1. **Answer questions exclusively about code stored in the Qdrant knowledge base**
2. **Refuse to answer questions outside its domain** (non-coding topics)
3. **Refuse to provide information about code not in its knowledge base**
4. **Use general LLM knowledge only to explain, improve, or debug code from the knowledge base**

## Architecture

```
┌──────────────┐
│   User       │
│   Query      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│   Next.js Application            │
│   (coding-ai-agent)              │
├──────────────────────────────────┤
│  1. Query Classification         │
│  2. Vector Search (Qdrant)       │
│  3. Context Retrieval            │
│  4. LLM Response Generation      │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│   Qdrant Vector Database         │
│   (localhost:6333)               │
├──────────────────────────────────┤
│  Collection: coding_knowledge    │
│  - C# Code Chunks                │
│  - Metadata (class, methods)     │
│  - Embeddings (1536-dim)         │
└──────────────────────────────────┘
```

## Knowledge Base Structure

### Code Indexing (code-indexer)

The [`chunk_cs_files.py`](code-indexer/chunk_cs_files.py) script processes C# source files and creates optimized chunks:

- **Class Definition Chunks**: namespace, using directives, class-level properties
- **Method Chunks**: individual methods with XML documentation
- **Unique Identifiers**: class_guid links all chunks belonging to a class

### Metadata Schema

```json
{
  "filename": "BasicArithmetic.cs",
  "class_name": "BasicArithmetic",
  "class_guid": "550e8400-e29b-41d4-a716-446655440000",
  "chunk_type": "class_definition | method",
  "chunk_index": 0
}
```

## Behavioral Policy

### 1. Scope Enforcement

| Query Type | Response Action |
|------------|----------------|
| About knowledge base code | ✅ Provide detailed answer using RAG |
| About other code | ❌ Politely decline, explain scope |
| Non-coding question | ❌ Redirect to coding domain |
| Code explanation/debugging | ✅ Use LLM knowledge + KB context |

### 2. Response Strategy

#### When code IS in knowledge base:
1. Retrieve relevant chunks from Qdrant
2. Use LLM's general programming knowledge to:
   - Explain the code clearly
   - Suggest improvements
   - Identify bugs
   - Provide usage examples
3. Always reference the specific files/classes from the knowledge base

#### When code is NOT in knowledge base:
1. Detect that no relevant chunks were found
2. Politely inform user that the code is not in the knowledge base
3. Suggest re-phrasing or asking about available code

#### When question is off-topic:
1. Identify non-coding question
2. Politely inform user of assistant's specialized role
3. Redirect to coding-related questions

## Technical Components

### 1. Query Processing Pipeline

```typescript
User Query → Query Embedding → Vector Search → 
Context Retrieval → Prompt Construction → LLM Response
```

### 2. Vector Search Parameters

- **Collection**: `coding_knowledge`
- **Embedding Model**: OpenAI `text-embedding-3-small` (1536 dimensions)
- **Search Strategy**: Semantic similarity search
- **Top-K Results**: 5-10 most relevant chunks

### 3. Prompt Engineering

The system prompt enforces:
- **Scope boundaries**: Only knowledge base code
- **Citation requirement**: Reference specific files/classes
- **Professional tone**: Clear, concise, helpful
- **Honesty**: Admit when information is unavailable

## Use Cases

### ✅ Supported Queries

- "What does the `BasicArithmetic.Add` method do?"
- "How do I use the `FractionOperations` class?"
- "Can you explain the `GeometryShapes.Circle` implementation?"
- "Is there a bug in the `PercentageCalculations` class?"
- "How can I improve the `NumberTheory.IsPrime` method?"

### ❌ Unsupported Queries

- "How do I implement a binary search tree?" (not in KB)
- "What's the weather today?" (off-topic)
- "Explain Python decorators" (not in KB, wrong language)
- "Write me a React component" (not in KB)

## Benefits

1. **Accuracy**: No hallucination about code not in the knowledge base
2. **Relevance**: All answers grounded in actual project code
3. **Traceability**: Clear references to source files and classes
4. **Maintainability**: Knowledge base updated by re-indexing code
5. **Security**: No exposure of code outside the knowledge base

## Future Enhancements

- Multi-language support (Python, JavaScript, etc.)
- Code generation based on knowledge base patterns
- Diff-based updates for code changes
- Integration with version control systems
- Advanced metadata filtering (by module, author, date)

## Conclusion

This Coding Assistant provides a **trustworthy, scoped, and accurate** way to query and understand a specific codebase. By combining RAG with strict behavioral policies, it ensures users get relevant information without hallucination or scope creep.
