import OpenAI from 'openai';
import { appConfig } from './config';

/**
 * Represents a search result with score and payload metadata
 */
export interface SearchResult {
  id: string | number;
  score: number;
  payload?: {
    text: string;
    filename?: string;
    class_name?: string;
    class_guid?: string;
    chunk_type?: 'class_definition' | 'method';
    chunk_index?: number;
    [key: string]: any;
  };
  finalScore?: number;
  llmScore?: number;
}

/**
 * Rerank search results using an LLM to evaluate relevance.
 * This is more accurate but slower and more expensive than metadata-based reranking.
 *
 * @param query - The user's search query
 * @param results - Array of search results from vector database
 * @param openai - OpenAI client instance
 * @param minScore - Minimum relevance score to include results (0-10 scale, default: 9)
 * @returns Reranked and filtered results with relevance score above minScore
 */
export async function rerankWithLLM(
  query: string,
  results: SearchResult[],
  openai: OpenAI,
  minScore: number = 9
): Promise<SearchResult[]> {
  if (results.length === 0) {
    return [];
  }
  
  // Create a concise representation of each chunk for the LLM
  const chunksDescription = results.map((r, i) => {
    const metadata = r.payload;
    const textPreview = metadata?.text?.substring(0, 200).replace(/\n/g, ' ') || '';
    return `${i}. [${metadata?.chunk_type || 'unknown'}] ${metadata?.class_name || 'Unknown'}.${metadata?.filename || ''}\n   Preview: ${textPreview}...`;
  }).join('\n\n');
  
  const prompt = `You are a code search relevance evaluator. Rate how relevant each code chunk is to the user's query.

User Query: "${query}"

Code Chunks:
${chunksDescription}

Task: Rate each chunk's relevance on a scale of 0-10, where:
- 10 = Perfectly answers the query
- 7-9 = Highly relevant, contains important information
- 4-6 = Somewhat relevant, tangentially related
- 1-3 = Barely relevant
- 0 = Not relevant at all

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{"scores": [score0, score1, score2, ...]}

Example: {"scores": [8.5, 6.0, 9.5, 3.0]}`;

  try {
    const response = await openai.chat.completions.create({
      model: appConfig.openai.chatModelForReranker, // Cost-effective model for reranking
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 200,
    });
    
    const content = response.choices[0].message.content?.trim() || '';
    
    // Parse the JSON response
    let scoresData;
    try {
      scoresData = JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from markdown code block
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scoresData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse LLM response');
      }
    }
    
    const scores = scoresData.scores;
    
    if (!Array.isArray(scores) || scores.length !== results.length) {
      console.error('LLM returned invalid scores array, falling back to original order');
      return results;
    }
    
    // Filter and sort by LLM score (keep only results with score >= minScore)
    return results
      .map((r, i) => ({
        ...r,
        llmScore: scores[i],
        finalScore: scores[i]
      }))
      .filter(r => (r.llmScore || 0) >= minScore)
      .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
      
  } catch (error) {
    console.error('Error in LLM reranking, falling back to original order:', error);
    // Fallback to original order if LLM fails
    return results;
  }
}


