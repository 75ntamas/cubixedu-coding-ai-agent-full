import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { addDocument, ensureCollection } from '@/lib/qdrant';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, metadata } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Ensure collection exists
    await ensureCollection();

    // Create embedding
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Generate unique ID
    const id = uuidv4();

    // Store in Qdrant
    await addDocument(id, embedding, {
      text,
      ...metadata,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id,
      message: 'Document embedded and stored successfully',
    });
  } catch (error: any) {
    console.error('Error in /api/chunk:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
