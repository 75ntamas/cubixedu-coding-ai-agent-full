/**
 * Test dataset for RAG evaluation
 * Contains 25+ test cases across different difficulty levels
 */

/**
 * Represents a relevant chunk identified by metadata fields
 */
export interface RelevantChunk {
  filename: string;      // e.g., "PercentageCalculations.cs"
  class_name: string;    // e.g., "PercentageCalculations"
  method_name?: string;  // e.g., "DecimalToPercentage" or "" for class-level chunks
}

export interface TestCase {
  id: string;
  query: string;
  relevantChunks: RelevantChunk[];  // Expected chunks to be retrieved
  difficulty: 'easy' | 'medium' | 'hard';
  description?: string;
}

/**
 * Test dataset with 25 test cases
 * 
 * NOTE: relevantChunks identifies expected chunks using metadata fields:
 * - filename: The C# source file name
 * - class_name: The class name
 * - method_name: The method name (empty string "" for class-level chunks)
 */
export const testDataset: TestCase[] = [
  // ===== EASY (1-7) - Simple, single-method queries =====
  {
    id: "test_001",
    query: "How do I convert a decimal to percentage?",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "DecimalToPercentage" }
    ],
    difficulty: "easy",
    description: "Simple method search - DecimalToPercentage"
  },
  {
    id: "test_002",
    query: "Show me how to calculate percentage of a number",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "CalculatePercentageOf" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_003",
    query: "How to calculate discounted price?",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplyDiscount" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_004",
    query: "Calculate percentage increase between two values",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageIncrease" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_005",
    query: "Apply sales tax to a price",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplySalesTax" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_006",
    query: "Convert percentage to decimal",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageToDecimal" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_007",
    query: "Calculate what percent one number is of another",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "WhatPercentOf" }
    ],
    difficulty: "easy"
  },

  // ===== MEDIUM (8-15) - Multiple methods or broader context =====
  {
    id: "test_008",
    query: "How to work with percentages in calculations?",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "" }
    ],
    difficulty: "medium",
    description: "Broader query - needs class overview"
  },
  {
    id: "test_009",
    query: "Calculate price changes with percentage increase and decrease",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageIncrease" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageDecrease" }
    ],
    difficulty: "medium"
  },
  {
    id: "test_010",
    query: "All percentage conversion methods",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "DecimalToPercentage" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageToDecimal" }
    ],
    difficulty: "medium"
  },
  {
    id: "test_011",
    query: "Calculate discounts and tax on prices",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplyDiscount" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplySalesTax" }
    ],
    difficulty: "medium"
  },
  {
    id: "test_012",
    query: "Percentage operations overview",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "" }
    ],
    difficulty: "medium"
  },
  {
    id: "test_013",
    query: "Apply percentage changes to values",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageIncrease" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageDecrease" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplyDiscount" }
    ],
    difficulty: "medium"
  },
  {
    id: "test_014",
    query: "Compare original and new values using percentages",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageIncrease" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageDecrease" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "WhatPercentOf" }
    ],
    difficulty: "medium"
  },
  {
    id: "test_015",
    query: "Shopping calculations with discounts and tax",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplyDiscount" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplySalesTax" }
    ],
    difficulty: "medium"
  },

  // ===== HARD (16-25) - Complex, multi-step, or cross-class =====
  {
    id: "test_016",
    query: "Complete percentage calculation toolkit",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "" }
    ],
    difficulty: "hard",
    description: "Requires full class context"
  },
  {
    id: "test_017",
    query: "Calculate final price with multiple discounts and tax",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplyDiscount" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplySalesTax" }
    ],
    difficulty: "hard"
  },
  {
    id: "test_018",
    query: "Analyze price changes over time using percentage calculations",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageIncrease" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageDecrease" }
    ],
    difficulty: "hard"
  },
  {
    id: "test_019",
    query: "Convert between different percentage representations and calculate values",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "DecimalToPercentage" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageToDecimal" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "CalculatePercentageOf" }
    ],
    difficulty: "hard"
  },
  {
    id: "test_020",
    query: "All methods for modifying values by percentages",
    relevantChunks: [
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageIncrease" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "PercentageDecrease" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplyDiscount" },
      { filename: "PercentageCalculations.cs", class_name: "PercentageCalculations", method_name: "ApplySalesTax" }
    ],
    difficulty: "hard"
  },
  {
    id: "test_021",
    query: "Basic arithmetic operations like addition and subtraction",
    relevantChunks: [
      { filename: "BasicArithmetic.cs", class_name: "BasicArithmetic", method_name: "" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_022",
    query: "Geometry shape area and perimeter calculations",
    relevantChunks: [
      { filename: "GeometryShapes.cs", class_name: "GeometryShapes", method_name: "" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_023",
    query: "Statistical calculations for data analysis",
    relevantChunks: [
      { filename: "StatisticsAndData.cs", class_name: "StatisticsAndData", method_name: "" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_024",
    query: "Working with fractions and fraction operations",
    relevantChunks: [
      { filename: "FractionOperations.cs", class_name: "FractionOperations", method_name: "" }
    ],
    difficulty: "easy"
  },
  {
    id: "test_025",
    query: "Number theory operations like prime numbers and GCD",
    relevantChunks: [
      { filename: "NumberTheory.cs", class_name: "NumberTheory", method_name: "" }
    ],
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
