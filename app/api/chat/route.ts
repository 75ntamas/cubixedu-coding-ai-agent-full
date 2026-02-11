import { NextRequest } from 'next/server';
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
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Initial chat completion with tools
          const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: messages,
            tools: tools,
            tool_choice: 'auto',
            stream: true,
          });

          let functionName = '';
          let functionArgs = '';
          let currentMessage = '';

          for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta;

            // Handle tool calls
            if (delta?.tool_calls) {
              const toolCall = delta.tool_calls[0];
              if (toolCall?.function?.name) {
                functionName = toolCall.function.name;
              }
              if (toolCall?.function?.arguments) {
                functionArgs += toolCall.function.arguments;
              }
            }

            // Handle content
            if (delta?.content) {
              currentMessage += delta.content;
              const data = `data: ${JSON.stringify({ content: delta.content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }

            // Check if tool call is finished
            if (chunk.choices[0]?.finish_reason === 'tool_calls' && functionName) {
              // Execute tool
              let toolResult = '';
              if (functionName === 'search_code_knowledge') {
                const args = JSON.parse(functionArgs);
                toolResult = await searchCodeKnowledge(args.query);
                
                // Send tool execution notification
                const toolData = `data: ${JSON.stringify({ 
                  tool: functionName, 
                  query: args.query 
                })}\n\n`;
                controller.enqueue(encoder.encode(toolData));
              }

              // Create new messages with tool result
              const newMessages = [
                ...messages,
                {
                  role: 'assistant',
                  content: null,
                  tool_calls: [{
                    id: 'call_' + Date.now(),
                    type: 'function',
                    function: {
                      name: functionName,
                      arguments: functionArgs,
                    },
                  }],
                },
                {
                  role: 'tool',
                  tool_call_id: 'call_' + Date.now(),
                  content: toolResult,
                },
              ];

              // Get final response
              const finalResponse = await openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: newMessages,
                stream: true,
              });

              for await (const finalChunk of finalResponse) {
                const finalDelta = finalChunk.choices[0]?.delta;
                if (finalDelta?.content) {
                  const data = `data: ${JSON.stringify({ content: finalDelta.content })}\n\n`;
                  controller.enqueue(encoder.encode(data));
                }
              }

              functionName = '';
              functionArgs = '';
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          const errorData = `data: ${JSON.stringify({ error: error.message })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500 }
    );
  }
}
