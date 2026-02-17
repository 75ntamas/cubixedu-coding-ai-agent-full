/**
 * Application configuration for OpenAI models
 */
export const appConfig = {
  openai: {
    embeddingModel: 'text-embedding-3-small',
    chatModel: 'gpt-5.2',
    chatModelForReranker: 'gpt-4o-mini',
  },
} as const;
