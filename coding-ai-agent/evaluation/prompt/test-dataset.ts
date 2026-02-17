/**
 * Test dataset for prompt evaluation
 * Contains test cases with questions, context, and expected answers
 */

export interface PromptTestCase {
  id: string;
  question: string;
  context: string;
  expectedAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description?: string;
}

/**
 * Test dataset for single-turn prompt evaluation
 * Tests answer relevance, correctness, and groundedness
 */
export const promptTestDataset: PromptTestCase[] = [
  // ===== EASY (1-5) - Simple, direct questions =====
  {
    id: "prompt_test_001",
    question: "What does the Add method do?",
    context: `public static double Add(double a, double b)
{
    return a + b;
}`,
    expectedAnswer: "The Add method takes two double numbers as parameters and returns their sum.",
    difficulty: "easy",
    description: "Simple method description"
  },
  {
    id: "prompt_test_002",
    question: "How do I calculate percentage of a number?",
    context: `public static double PercentageOf(double percentage, double number)
{
    return (percentage / 100) * number;
}`,
    expectedAnswer: "Use the PercentageOf method by passing the percentage value and the number. It divides the percentage by 100 and multiplies by the number.",
    difficulty: "easy"
  },
  {
    id: "prompt_test_003",
    question: "What parameters does the Subtract method need?",
    context: `public static double Subtract(double a, double b)
{
    return a - b;
}`,
    expectedAnswer: "The Subtract method needs two double parameters: 'a' (the number to subtract from) and 'b' (the number to subtract).",
    difficulty: "easy"
  },
  {
    id: "prompt_test_004",
    question: "What is the return type of the Multiply method?",
    context: `public static double Multiply(double a, double b)
{
    return a * b;
}`,
    expectedAnswer: "The Multiply method returns a double.",
    difficulty: "easy"
  },
  {
    id: "prompt_test_005",
    question: "What does the Divide method return when dividing by zero?",
    context: `public static double Divide(double a, double b)
{
    if (b == 0)
    {
        throw new DivideByZeroException("Cannot divide by zero");
    }
    return a / b;
}`,
    expectedAnswer: "The Divide method throws a DivideByZeroException when dividing by zero.",
    difficulty: "easy"
  },

  // ===== MEDIUM (6-10) - More complex reasoning =====
  {
    id: "prompt_test_006",
    question: "How can I convert a decimal to a percentage?",
    context: `public static double DecimalToPercentage(double decimalValue)
{
    return decimalValue * 100;
}

public static string FormatAsPercentage(double value)
{
    return $"{value}%";
}`,
    expectedAnswer: "Use the DecimalToPercentage method which multiplies the decimal value by 100. You can also use FormatAsPercentage to format the result as a string with a % symbol.",
    difficulty: "medium"
  },
  {
    id: "prompt_test_007",
    question: "What's the difference between PercentageIncrease and ApplyPercentageIncrease?",
    context: `public static double PercentageIncrease(double original, double newValue)
{
    return ((newValue - original) / original) * 100;
}

public static double ApplyPercentageIncrease(double value, double percentage)
{
    return value + (value * percentage / 100);
}`,
    expectedAnswer: "PercentageIncrease calculates what percentage increase occurred between two values, while ApplyPercentageIncrease applies a given percentage increase to a value and returns the new value.",
    difficulty: "medium"
  },
  {
    id: "prompt_test_008",
    question: "How do I calculate a discounted price?",
    context: `public static double CalculateDiscountedPrice(double price, double discountPercentage)
{
    double discount = price * (discountPercentage / 100);
    return price - discount;
}`,
    expectedAnswer: "Use the CalculateDiscountedPrice method with the original price and discount percentage. It calculates the discount amount and subtracts it from the original price.",
    difficulty: "medium"
  },
  {
    id: "prompt_test_009",
    question: "What happens if I pass a negative percentage to PercentageOf?",
    context: `public static double PercentageOf(double percentage, double number)
{
    return (percentage / 100) * number;
}`,
    expectedAnswer: "The method will calculate with the negative percentage, effectively returning a negative result. There's no validation preventing negative percentages.",
    difficulty: "medium"
  },
  {
    id: "prompt_test_010",
    question: "How can I calculate the final price with tax?",
    context: `public static double CalculatePriceWithTax(double price, double taxPercentage)
{
    return price + (price * taxPercentage / 100);
}`,
    expectedAnswer: "Use CalculatePriceWithTax method by passing the base price and tax percentage. It calculates the tax amount and adds it to the original price.",
    difficulty: "medium"
  },

  // ===== HARD (11-15) - Complex, multi-step reasoning =====
  {
    id: "prompt_test_011",
    question: "How would I calculate a price after applying a discount and then adding tax?",
    context: `public static double CalculateDiscountedPrice(double price, double discountPercentage)
{
    double discount = price * (discountPercentage / 100);
    return price - discount;
}

public static double CalculatePriceWithTax(double price, double taxPercentage)
{
    return price + (price * taxPercentage / 100);
}`,
    expectedAnswer: "First use CalculateDiscountedPrice to apply the discount to the original price, then pass the result to CalculatePriceWithTax to add the tax. For example: CalculatePriceWithTax(CalculateDiscountedPrice(100, 20), 10) would apply 20% discount then 10% tax.",
    difficulty: "hard"
  },
  {
    id: "prompt_test_012",
    question: "What's the relationship between percentage increase and decrease operations?",
    context: `public static double PercentageIncrease(double original, double newValue)
{
    return ((newValue - original) / original) * 100;
}

public static double PercentageDecrease(double original, double newValue)
{
    return ((original - newValue) / original) * 100;
}

public static double ApplyPercentageIncrease(double value, double percentage)
{
    return value + (value * percentage / 100);
}

public static double ApplyPercentageDecrease(double value, double percentage)
{
    return value - (value * percentage / 100);
}`,
    expectedAnswer: "PercentageIncrease and PercentageDecrease calculate the percentage change between two values (one for increases, one for decreases). ApplyPercentageIncrease and ApplyPercentageDecrease apply a percentage change to a value. They're inverse operations - if you apply a percentage increase and then calculate the percentage change, you get back the original percentage.",
    difficulty: "hard"
  },
  {
    id: "prompt_test_013",
    question: "Can I use these methods to work with financial calculations involving compound operations?",
    context: `public static double CalculateDiscountedPrice(double price, double discountPercentage)
{
    double discount = price * (discountPercentage / 100);
    return price - discount;
}

public static double ApplyPercentageIncrease(double value, double percentage)
{
    return value + (value * percentage / 100);
}

public static double PercentageOf(double percentage, double number)
{
    return (percentage / 100) * number;
}`,
    expectedAnswer: "Yes, these methods can be chained for compound financial calculations. For example, you can apply multiple discounts sequentially, calculate portions of amounts, or combine discounts with increases. The key is understanding the order of operations and that each method returns a value that can be passed to another method.",
    difficulty: "hard"
  },
  {
    id: "prompt_test_014",
    question: "How do percentage conversions work between decimal and percentage formats?",
    context: `public static double DecimalToPercentage(double decimalValue)
{
    return decimalValue * 100;
}

public static double PercentageToDecimal(double percentage)
{
    return percentage / 100;
}`,
    expectedAnswer: "DecimalToPercentage multiplies by 100 to convert a decimal (like 0.25) to percentage (25). PercentageToDecimal divides by 100 to convert percentage (like 25) to decimal (0.25). They are inverse operations of each other.",
    difficulty: "hard"
  },
  {
    id: "prompt_test_015",
    question: "What's the best approach to calculate what percentage one number is of another?",
    context: `public static double WhatPercentOf(double part, double whole)
{
    if (whole == 0)
    {
        throw new DivideByZeroException("Cannot calculate percentage of zero");
    }
    return (part / whole) * 100;
}`,
    expectedAnswer: "Use the WhatPercentOf method, passing the part as the first parameter and the whole as the second parameter. It divides the part by the whole and multiplies by 100. Note that it includes safety check for division by zero, throwing an exception if the whole is zero.",
    difficulty: "hard"
  },
];

// Helper functions
export function getPromptTestsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): PromptTestCase[] {
  return promptTestDataset.filter(t => t.difficulty === difficulty);
}

export function getPromptTestById(id: string): PromptTestCase | undefined {
  return promptTestDataset.find(t => t.id === id);
}

export function getPromptTestCount(): number {
  return promptTestDataset.length;
}
