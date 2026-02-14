import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

export const collectionName = process.env.QDRANT_COLLECTION_NAME || 'coding_knowledge';

/**
 * Ensures that the Qdrant collection exists, creating it if necessary.
 * @exception Throws an error if there is an issue communicating with 
 * Qdrant or creating the collection.
 */
export async function ensureCollection() {
  try {
    const collections = await client.getCollections();
    const exists = collections.collections.some(
      (col) => col.name === collectionName
    );

    if (!exists) {
      await client.createCollection(collectionName, {
        vectors: {
          size: 1536, // OpenAI embedding dimension
          distance: 'Cosine',
        },
      });
      console.log(`Collection ${collectionName} created`);
    }
  } catch (error) {
    console.error('Error ensuring collection:', error);
    throw error;
  }
}

export async function searchSimilarDocuments(
  embedding: number[],
  limit: number = 5
) {
  try {
    const searchResult = await client.search(collectionName, {
      vector: embedding,
      limit,
      with_payload: true,
    });

    return searchResult;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
}

/**
 * Adds a document to the Qdrant collection.
 * @param id : Unique identifier for the document.
 * @param embedding : The vector embedding of the document.
 * @param payload : Additional metadata to store with the document.
 * @exception Throws an error if there is an issue communicating with 
 * Qdrant or adding the document.
 */
export async function addDocument(
  id: string,
  embedding: number[],
  payload: Record<string, any>
) {
  try {
    await client.upsert(collectionName, {
      wait: true,
      points: [
        {
          id,
          vector: embedding,
          payload,
        },
      ],
    });
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
}

export default client;
