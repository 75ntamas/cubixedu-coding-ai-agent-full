/**
 * Test dataset for RAG evaluation
 * Contains 25+ test cases across different difficulty levels
 */

export interface TestCase {
  id: string;
  query: string;
  relevantChunkIds: string[];  // Ground truth - IDs of relevant chunks
  relevantClassNames: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  description?: string;
}

/**
 * Test dataset with 25 test cases
 * 
 * NOTE: relevantChunkIds must match the actual IDs stored in Qdrant.
 * The format depends on how chunks are indexed. Common formats:
 * - UUID: "550e8400-e29b-41d4-a716-446655440000"
 * - Compound: "PercentageCalculations.cs_method_1"
 * 
 * Check your Qdrant collection to verify the correct ID format.
 */
export const testDataset: TestCase[] = [
  // ===== EASY (1-7) - Simple, single-class queries =====
  {
    id: "test_001",
    query: "How do I convert a decimal to percentage?",
    relevantChunkIds: [],  // Will be populated based on actual Qdrant IDs
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "easy",
    description: "Simple method search - DecimalToPercentage"
  },
  {
    id: "test_002",
    query: "Show me how to calculate percentage of a number",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "easy"
  },
  {
    id: "test_003",
    query: "How to calculate discounted price?",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "easy"
  },
  {
    id: "test_004",
    query: "Calculate percentage increase between two values",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "easy"
  },
  {
    id: "test_005",
    query: "Apply sales tax to a price",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "easy"
  },
  {
    id: "test_006",
    query: "Convert percentage to decimal",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "easy"
  },
  {
    id: "test_007",
    query: "Calculate what percent one number is of another",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "easy"
  },

  // ===== MEDIUM (8-15) - Multiple methods or broader context =====
  {
    id: "test_008",
    query: "How to work with percentages in calculations?",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "medium",
    description: "Broader query - needs class overview"
  },
  {
    id: "test_009",
    query: "Calculate price changes with percentage increase and decrease",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "medium"
  },
  {
    id: "test_010",
    query: "All percentage conversion methods",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "medium"
  },
  {
    id: "test_011",
    query: "Calculate discounts and tax on prices",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "medium"
  },
  {
    id: "test_012",
    query: "Percentage operations overview",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "medium"
  },
  {
    id: "test_013",
    query: "Apply percentage changes to values",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "medium"
  },
  {
    id: "test_014",
    query: "Compare original and new values using percentages",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "medium"
  },
  {
    id: "test_015",
    query: "Shopping calculations with discounts and tax",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "medium"
  },

  // ===== HARD (16-25) - Complex, multi-step, or cross-class =====
  {
    id: "test_016",
    query: "Complete percentage calculation toolkit",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "hard",
    description: "Requires full class context"
  },
  {
    id: "test_017",
    query: "Calculate final price with multiple discounts and tax",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "hard"
  },
  {
    id: "test_018",
    query: "Analyze price changes over time using percentage calculations",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "hard"
  },
  {
    id: "test_019",
    query: "Convert between different percentage representations and calculate values",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "hard"
  },
  {
    id: "test_020",
    query: "All methods for modifying values by percentages",
    relevantChunkIds: [],
    relevantClassNames: ["PercentageCalculations"],
    difficulty: "hard"
  },
  {
    id: "test_021",
    query: "Basic arithmetic operations like addition and subtraction",
    relevantChunkIds: [],
    relevantClassNames: ["BasicArithmetic"],
    difficulty: "easy"
  },
  {
    id: "test_022",
    query: "Geometry shape area and perimeter calculations",
    relevantChunkIds: [],
    relevantClassNames: ["GeometryShapes"],
    difficulty: "easy"
  },
  {
    id: "test_023",
    query: "Statistical calculations for data analysis",
    relevantChunkIds: [],
    relevantClassNames: ["StatisticsAndData"],
    difficulty: "easy"
  },
  {
    id: "test_024",
    query: "Working with fractions and fraction operations",
    relevantChunkIds: [],
    relevantClassNames: ["FractionOperations"],
    difficulty: "easy"
  },
  {
    id: "test_025",
    query: "Number theory operations like prime numbers and GCD",
    relevantChunkIds: [],
    relevantClassNames: ["NumberTheory"],
    difficulty: "easy"
  },
];

// Helper functions
export function getTestsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): TestCase[] {
  return testDataset.filter(t => t.difficulty === difficulty);
}

export function getTestById(id: string): TestCase | undefined {
  return testDataset.find(t => t.id === id);
}

export function getTestCount(): number {
  return testDataset.length;
}
