using System;

namespace MathLibrary
{
    /// <summary>
    /// Handles fraction operations for middle school mathematics.
    /// This class provides methods for adding, subtracting, multiplying, and dividing fractions.
    /// It also includes simplification and conversion utilities.
    /// </summary>
    /// <remarks>
    /// Fractions are represented as numerator/denominator pairs.
    /// All operations automatically simplify results to lowest terms.
    /// Topics: Fractions, Rational Numbers, GCD, LCM
    /// </remarks>
    public class FractionOperations
    {
        /// <summary>
        /// Finds the Greatest Common Divisor (GCD) using Euclidean algorithm.
        /// Used for simplifying fractions to their lowest terms.
        /// </summary>
        /// <param name="a">First positive integer</param>
        /// <param name="b">Second positive integer</param>
        /// <returns>The GCD of a and b</returns>
        /// <example>
        /// GCD(12, 8) returns 4
        /// GCD(15, 25) returns 5
        /// </example>
        public static int GCD(int a, int b)
        {
            a = Math.Abs(a);
            b = Math.Abs(b);
            while (b != 0)
            {
                int temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

        /// <summary>
        /// Finds the Least Common Multiple (LCM) of two numbers.
        /// Used for finding common denominators when adding or subtracting fractions.
        /// </summary>
        /// <param name="a">First positive integer</param>
        /// <param name="b">Second positive integer</param>
        /// <returns>The LCM of a and b</returns>
        /// <example>
        /// LCM(4, 6) returns 12
        /// LCM(3, 5) returns 15
        /// </example>
        public static int LCM(int a, int b)
        {
            return Math.Abs(a * b) / GCD(a, b);
        }

        /// <summary>
        /// Simplifies a fraction to its lowest terms.
        /// </summary>
        /// <param name="numerator">The numerator of the fraction</param>
        /// <param name="denominator">The denominator of the fraction</param>
        /// <returns>A tuple containing the simplified numerator and denominator</returns>
        /// <example>
        /// SimplifyFraction(6, 8) returns (3, 4)
        /// SimplifyFraction(10, 15) returns (2, 3)
        /// </example>
        public static (int numerator, int denominator) SimplifyFraction(int numerator, int denominator)
        {
            if (denominator == 0)
            {
                throw new ArgumentException("Denominator cannot be zero");
            }

            int gcd = GCD(numerator, denominator);
            return (numerator / gcd, denominator / gcd);
        }

        /// <summary>
        /// Adds two fractions and returns the result in simplified form.
        /// Formula: a/b + c/d = (a*d + b*c) / (b*d)
        /// </summary>
        /// <param name="num1">Numerator of first fraction</param>
        /// <param name="den1">Denominator of first fraction</param>
        /// <param name="num2">Numerator of second fraction</param>
        /// <param name="den2">Denominator of second fraction</param>
        /// <returns>Simplified result as (numerator, denominator)</returns>
        /// <example>
        /// AddFractions(1, 2, 1, 3) returns (5, 6) which is 1/2 + 1/3 = 5/6
        /// </example>
        public static (int numerator, int denominator) AddFractions(int num1, int den1, int num2, int den2)
        {
            int numerator = num1 * den2 + num2 * den1;
            int denominator = den1 * den2;
            return SimplifyFraction(numerator, denominator);
        }

        /// <summary>
        /// Subtracts the second fraction from the first fraction.
        /// Formula: a/b - c/d = (a*d - b*c) / (b*d)
        /// </summary>
        /// <param name="num1">Numerator of first fraction</param>
        /// <param name="den1">Denominator of first fraction</param>
        /// <param name="num2">Numerator of second fraction</param>
        /// <param name="den2">Denominator of second fraction</param>
        /// <returns>Simplified result as (numerator, denominator)</returns>
        /// <example>
        /// SubtractFractions(3, 4, 1, 2) returns (1, 4) which is 3/4 - 1/2 = 1/4
        /// </example>
        public static (int numerator, int denominator) SubtractFractions(int num1, int den1, int num2, int den2)
        {
            int numerator = num1 * den2 - num2 * den1;
            int denominator = den1 * den2;
            return SimplifyFraction(numerator, denominator);
        }

        /// <summary>
        /// Multiplies two fractions.
        /// Formula: a/b * c/d = (a*c) / (b*d)
        /// </summary>
        /// <param name="num1">Numerator of first fraction</param>
        /// <param name="den1">Denominator of first fraction</param>
        /// <param name="num2">Numerator of second fraction</param>
        /// <param name="den2">Denominator of second fraction</param>
        /// <returns>Simplified result as (numerator, denominator)</returns>
        /// <example>
        /// MultiplyFractions(2, 3, 3, 4) returns (1, 2) which is 2/3 * 3/4 = 1/2
        /// </example>
        public static (int numerator, int denominator) MultiplyFractions(int num1, int den1, int num2, int den2)
        {
            int numerator = num1 * num2;
            int denominator = den1 * den2;
            return SimplifyFraction(numerator, denominator);
        }

        /// <summary>
        /// Divides the first fraction by the second fraction.
        /// Formula: (a/b) ÷ (c/d) = (a/b) * (d/c) = (a*d) / (b*c)
        /// </summary>
        /// <param name="num1">Numerator of first fraction</param>
        /// <param name="den1">Denominator of first fraction</param>
        /// <param name="num2">Numerator of second fraction</param>
        /// <param name="den2">Denominator of second fraction</param>
        /// <returns>Simplified result as (numerator, denominator)</returns>
        /// <example>
        /// DivideFractions(1, 2, 3, 4) returns (2, 3) which is (1/2) ÷ (3/4) = 2/3
        /// </example>
        public static (int numerator, int denominator) DivideFractions(int num1, int den1, int num2, int den2)
        {
            if (num2 == 0)
            {
                throw new DivideByZeroException("Cannot divide by zero");
            }
            return MultiplyFractions(num1, den1, den2, num2);
        }

        /// <summary>
        /// Converts a fraction to decimal form.
        /// </summary>
        /// <param name="numerator">The numerator</param>
        /// <param name="denominator">The denominator</param>
        /// <returns>The decimal representation</returns>
        /// <example>
        /// ToDecimal(3, 4) returns 0.75
        /// ToDecimal(1, 3) returns 0.333...
        /// </example>
        public static double ToDecimal(int numerator, int denominator)
        {
            if (denominator == 0)
            {
                throw new DivideByZeroException("Denominator cannot be zero");
            }
            return (double)numerator / denominator;
        }
    }
}
