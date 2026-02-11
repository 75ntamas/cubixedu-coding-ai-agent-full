# Coding Agent - Next.js AI Assistant

A Next.js application that implements an AI-powered coding agent using OpenAI and Qdrant vector database. The agent helps answer questions about your company's codebase by storing and retrieving code knowledge.

## Features

- AI-powered chat interface with OpenAI integration
- Vector database storage with Qdrant
- Streaming and non-streaming API endpoints
- Semantic search over code knowledge base
- Interactive chat UI with conversation history
- Tool calling for retrieving relevant code information

## Prerequisites

- Node.js 18+ 
- Qdrant vector database (local or cloud instance)
- OpenAI API key

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Qdrant Configuration
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION_NAME=coding_knowledge
```

3. Start Qdrant (if running locally):

Using Docker:
```bash
docker run -p 6333:6333 qdrant/qdrant
```

Or download from: https://qdrant.tech/documentation/quick-start/

## Usage

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build and start the production server:

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/chunk

Creates embeddings and stores documents in Qdrant.

**Request:**
```json
{
  "text": "Your code snippet or documentation",
  "metadata": {
    "filename": "example.ts",
    "type": "function",
    "description": "Example function"
  }
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid-here",
  "message": "Document embedded and stored successfully"
}
```

### POST /api/chat

Streaming chat endpoint with tool calling support.

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How does the authentication work?"
    }
  ]
}
```

**Response:** Server-Sent Events (SSE) stream

### POST /api/chat-test

Non-streaming chat endpoint with tool calling support.

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Explain the database schema"
    }
  ]
}
```

**Response:**
```json
{
  "message": "AI response here...",
  "toolUsed": "search_code_knowledge",
  "toolQuery": "database schema"
}
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/          # Streaming chat endpoint
│   │   ├── chat-test/     # Non-streaming chat endpoint
│   │   └── chunk/         # Embedding creation endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat UI
├── lib/
│   └── qdrant.ts          # Qdrant client utility
├── .env.example           # Environment variables template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── next.config.js         # Next.js configuration
```

## Adding Code Knowledge

To add code knowledge to the database, send POST requests to `/api/chunk`:

```bash
curl -X POST http://localhost:3000/api/chunk \
  -H "Content-Type: application/json" \
  -d '{
    "text": "function authenticate(user) { /* auth logic */ }",
    "metadata": {
      "filename": "auth.ts",
      "type": "function"
    }
  }'
```

Or create a script to batch import your codebase.

## How It Works

1. **Embedding Creation**: Code snippets are converted to embeddings using OpenAI's embedding model
2. **Vector Storage**: Embeddings are stored in Qdrant with metadata
3. **Semantic Search**: User queries are embedded and searched against the knowledge base
4. **Tool Calling**: OpenAI uses tools to retrieve relevant code information
5. **Response Generation**: AI generates responses based on retrieved context

## Technologies Used

- **Next.js 14**: React framework with App Router
- **OpenAI API**: GPT-4 for chat and text-embedding-3-small for embeddings
- **Qdrant**: Vector database for similarity search
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

## Notes

- The TypeScript errors you see in VSCode will resolve after running `npm install`
- Make sure Qdrant is running before starting the application
- The collection will be created automatically on first use
- Embeddings use OpenAI's `text-embedding-3-small` model (1536 dimensions)
- Chat uses GPT-4 Turbo Preview model

## License

MIT
