import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { searchSimilarDocuments } from '@/lib/qdrant';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load system prompt
const systemPromptPath = path.join(process.cwd(), 'system_prompt.md');
const systemPrompt =
  fs.existsSync(systemPromptPath) && fs.statSync(systemPromptPath).isFile()
    ? fs.readFileSync(systemPromptPath, 'utf8')
    : 'You are a helpful coding assistant.';

// Tool definition for retrieving code information from RAG database
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      // LLM will identify this function by name when calling this tool
      name: 'search_code_knowledge',
      // Description for the LLM to understand when to use this tool
      description: 'Search the company\'s code knowledge base (RAG over Qdrant) for relevant information about code, functions, classes, or implementation details.',
      // Define the parameters that the LLM needs to provide when calling this tool
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            // Description for the LLM to understand what 'query' parameter is for
            description: 'Short natural language search query for semantic vector search (not SQL) to find relevant code information',
          },
        },
        required: ['query'],
      },
    },
  },
];

/**
 * RAG database search. We search for similar documents in Qdrant. 
 * @param query : The search query to find relevant code information
 * @returns A JSON string containing the search results with text, score, and metadata for each relevant 
 * document found in the code knowledge base (RAG).
 */
async function searchCodeKnowledge(query: string) {
  try {
    // Create embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
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
          // Prepare messages with system prompt
          const systemMessage = {
            role: 'system' as const,
            content: systemPrompt,
          };

          // Send the request to the OpenAI API and wait until the streaming connection is established
          const response = await openai.chat.completions.create({
            model: process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo',
            messages: [systemMessage, ...messages], // system and user messages to send to the OpenAI API
            tools: tools, // Tools to use
            tool_choice: 'auto', // Auto-select the tool to use
            stream: true, // Stream the response
            n: 1, // Only one response is needed
          });

          let functionName = '';
          let functionArgs = '';
          let currentMessage = '';

          // Stream the response from the OpenAI API (async iterator)
          for await (const chunk of response) {
            // we requested only one choice (version of the response)
            // delta is next LLM's response can be content or tool_calls etc.
            const delta = chunk.choices[0]?.delta;


            // Handle tool calls (if the LLM is calling a tool)
            if (delta?.tool_calls) {
              const toolCall = delta.tool_calls[0]; // Get the tool call from the delta
              if (toolCall?.function?.name) {
                functionName = toolCall.function.name;
              }
              if (toolCall?.function?.arguments) {
                // argument comes in more than one chunks (length issue), so we need to concatenate them
                functionArgs += toolCall.function.arguments;
              }
            }
            // finally we will have the tool name and its arguments. it comes in more then one chunk.

            // Handle content (if the LLM is responding with content)
            if (delta?.content) {
              currentMessage += delta.content;
              // Send the data to the client (SSE format)
              const data = `data: ${JSON.stringify({ content: delta.content })}\n\n`;
              // Send the data to the client
              controller.enqueue(encoder.encode(data));
            }

            // Check if LLM finished sending the tool call response (so we can call the tool)
            if (chunk.choices[0]?.finish_reason === 'tool_calls' && functionName) {
              // Execute tool
              let toolResult = '';
              if (functionName === 'search_code_knowledge') {
                const args = JSON.parse(functionArgs);
                // calling the tool (database search)
                toolResult = await searchCodeKnowledge(args.query);
                
                // Send tool execution notification to the client
                // it no needed for a real user experience, but it's good to have it for debugging
                const toolData = `data: ${JSON.stringify({ 
                  tool: functionName, 
                  query: args.query 
                })}\n\n`;
                controller.enqueue(encoder.encode(toolData));
              }

              // Create new messages with system prompt and tool result
              const tool_call_Messages = [
                systemMessage,
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
                model: process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo',
                messages: tool_call_Messages,
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
