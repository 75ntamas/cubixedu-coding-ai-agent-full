import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchSimilarDocuments } from '@/lib/qdrant';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tool definition for retrieving code information
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_code_knowledge',
      description: 'Search the company\'s code knowledge base for relevant information about code, functions, classes, or implementation details.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find relevant code information',
          },
        },
        required: ['query'],
      },
    },
  },
];

async function searchCodeKnowledge(query: string) {
  try {
    // Create embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Search similar documents in Qdrant
    const results = await searchSimilarDocuments(queryEmbedding, 3);

    // Format results
    const formattedResults = results.map((result: any) => ({
      text: result.payload?.text || '',
      score: result.score,
      metadata: result.payload,
    }));

    return JSON.stringify(formattedResults);
  } catch (error) {
    console.error('Error searching code knowledge:', error);
    return JSON.stringify({ error: 'Failed to search code knowledge' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Initial chat completion with tools
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      tools: tools,
      tool_choice: 'auto',
    });

    const assistantMessage = response.choices[0].message;

    // Check if tool was called
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      let toolResult = '';
      if (functionName === 'search_code_knowledge') {
        toolResult = await searchCodeKnowledge(functionArgs.query);
      }

      // Create new messages with tool result
      const newMessages = [
        ...messages,
        {
          role: 'assistant',
          content: null,
          tool_calls: [toolCall],
        },
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult,
        },
      ];

      // Get final response
      const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: newMessages,
      });

      return NextResponse.json({
        message: finalResponse.choices[0].message.content,
        toolUsed: functionName,
        toolQuery: functionArgs.query,
      });
    }

    // No tool was called
    return NextResponse.json({
      message: assistantMessage.content,
      toolUsed: null,
    });
  } catch (error: any) {
    console.error('Error in /api/chat-test:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
