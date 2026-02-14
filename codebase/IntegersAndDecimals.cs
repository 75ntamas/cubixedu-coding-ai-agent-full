using System;

namespace MathLibrary
{
    /// <summary>
    /// Provides methods for working with integers, decimals, and number operations in middle school mathematics.
    /// This class handles operations with positive and negative numbers, decimal conversions, and rounding.
    /// </summary>
    /// <remarks>
    /// Topics: Integers, Decimals, Negative Numbers, Absolute Value, Rounding, Number Line Operations
    /// Key concepts:
    /// - Integers: Whole numbers including positive, negative, and zero (..., -2, -1, 0, 1, 2, ...)
    /// - Decimals: Numbers with fractional parts expressed using decimal point
    /// - Absolute Value: Distance from zero on the number line (always non-negative)
    /// - Opposite Numbers: Numbers equidistant from zero on opposite sides (e.g., 5 and -5)
    /// - Place Value: Position of digits in decimal numbers (tenths, hundredths, etc.)
    /// </remarks>
    public class IntegersAndDecimals
    {
        /// <summary>
        /// Calculates the absolute value of a number.
        /// Absolute value is the distance from zero, always non-negative.
        /// </summary>
        /// <param name="number">The number to find absolute value of</param>
        /// <returns>The absolute value</returns>
        /// <example>
        /// AbsoluteValue(-5) returns 5
        /// AbsoluteValue(7) returns 7
        /// AbsoluteValue(0) returns 0
        /// AbsoluteValue(-3.5) returns 3.5
        /// </example>
        public static double AbsoluteValue(double number)
        {
            return Math.Abs(number);
        }

        /// <summary>
        /// Finds the opposite (additive inverse) of a number.
        /// The opposite of a number has the same distance from zero but on the opposite side.
        /// </summary>
        /// <param name="number">The number to find opposite of</param>
        /// <returns>The opposite number</returns>
        /// <example>
        /// Opposite(5) returns -5
        /// Opposite(-8) returns 8
        /// Opposite(0) returns 0
        /// Opposite(-3.2) returns 3.2
        /// </example>
        public static double Opposite(double number)
        {
            return -number;
        }

        /// <summary>
        /// Adds two integers with support for negative numbers.
        /// Handles all combinations: positive + positive, negative + negative, positive + negative.
        /// </summary>
        /// <param name="a">First integer</param>
        /// <param name="b">Second integer</param>
        /// <returns>The sum of the integers</returns>
        /// <example>
        /// AddIntegers(5, 3) returns 8
        /// AddIntegers(-5, -3) returns -8
        /// AddIntegers(5, -3) returns 2
        /// AddIntegers(-5, 7) returns 2
        /// </example>
        public static int AddIntegers(int a, int b)
        {
            return a + b;
        }

        /// <summary>
        /// Subtracts two integers with support for negative numbers.
        /// Subtraction can be thought of as adding the opposite: a - b = a + (-b).
        /// </summary>
        /// <param name="a">First integer (minuend)</param>
        /// <param name="b">Second integer (subtrahend)</param>
        /// <returns>The difference</returns>
        /// <example>
        /// SubtractIntegers(5, 3) returns 2
        /// SubtractIntegers(3, 5) returns -2
        /// SubtractIntegers(-5, -3) returns -2
        /// SubtractIntegers(-5, 3) returns -8
        /// </example>
        public static int SubtractIntegers(int a, int b)
        {
            return a - b;
        }

        /// <summary>
        /// Multiplies two integers following sign rules.
        /// Rules: positive × positive = positive, negative × negative = positive, 
        ///        positive × negative = negative, negative × positive = negative
        /// </summary>
        /// <param name="a">First integer</param>
        /// <param name="b">Second integer</param>
        /// <returns>The product</returns>
        /// <example>
        /// MultiplyIntegers(5, 3) returns 15 (positive × positive)
        /// MultiplyIntegers(-5, -3) returns 15 (negative × negative)
        /// MultiplyIntegers(5, -3) returns -15 (positive × negative)
        /// MultiplyIntegers(-5, 3) returns -15 (negative × positive)
        /// </example>
        public static int MultiplyIntegers(int a, int b)
        {
            return a * b;
        }

        /// <summary>
        /// Divides two integers following sign rules.
        /// Rules: Same signs give positive result, different signs give negative result.
        /// </summary>
        /// <param name="a">Dividend</param>
        /// <param name="b">Divisor</param>
        /// <returns>The quotient as a double to handle remainders</returns>
        /// <example>
        /// DivideIntegers(15, 3) returns 5.0 (positive ÷ positive)
        /// DivideIntegers(-15, -3) returns 5.0 (negative ÷ negative)
        /// DivideIntegers(15, -3) returns -5.0 (positive ÷ negative)
        /// DivideIntegers(-15, 3) returns -5.0 (negative ÷ positive)
        /// </example>
        public static double DivideIntegers(int a, int b)
        {
            if (b == 0)
            {
                throw new DivideByZeroException("Cannot divide by zero");
            }
            return (double)a / b;
        }

        /// <summary>
        /// Compares two numbers and determines which is greater.
        /// </summary>
        /// <param name="a">First number</param>
        /// <param name="b">Second number</param>
        /// <returns>1 if a > b, -1 if a &lt; b, 0 if a = b</returns>
        /// <example>
        /// CompareNumbers(5, 3) returns 1
        /// CompareNumbers(-2, -5) returns 1 (-2 is greater than -5)
        /// CompareNumbers(4, 4) returns 0
        /// CompareNumbers(-7, 2) returns -1
        /// </example>
        public static int CompareNumbers(double a, double b)
        {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        }

        /// <summary>
        /// Rounds a decimal number to the nearest integer.
        /// Uses standard rounding: .5 and above rounds up, below .5 rounds down.
        /// </summary>
        /// <param name="number">The decimal number to round</param>
        /// <returns>The rounded integer</returns>
        /// <example>
        /// RoundToNearest(4.3) returns 4
        /// RoundToNearest(4.5) returns 4 (banker's rounding in C#)
        /// RoundToNearest(4.7) returns 5
        /// RoundToNearest(-3.2) returns -3
        /// </example>
        public static int RoundToNearest(double number)
        {
            return (int)Math.Round(number);
        }

        /// <summary>
        /// Rounds a decimal number to a specified number of decimal places.
        /// </summary>
        /// <param name="number">The number to round</param>
        /// <param name="decimalPlaces">Number of decimal places to round to</param>
        /// <returns>The rounded number</returns>
        /// <example>
        /// RoundToDecimalPlaces(3.14159, 2) returns 3.14
        /// RoundToDecimalPlaces(7.8956, 1) returns 7.9
        /// RoundToDecimalPlaces(12.345, 0) returns 12.0
        /// </example>
        public static double RoundToDecimalPlaces(double number, int decimalPlaces)
        {
            if (decimalPlaces < 0)
            {
                throw new ArgumentException("Decimal places cannot be negative");
            }
            return Math.Round(number, decimalPlaces);
        }

        /// <summary>
        /// Rounds a number down to the nearest integer (floor function).
        /// </summary>
        /// <param name="number">The number to round down</param>
        /// <returns>The largest integer less than or equal to the number</returns>
        /// <example>
        /// RoundDown(4.7) returns 4
        /// RoundDown(4.1) returns 4
        /// RoundDown(-2.3) returns -3
        /// RoundDown(5.0) returns 5
        /// </example>
        public static int RoundDown(double number)
        {
            return (int)Math.Floor(number);
        }

        /// <summary>
        /// Rounds a number up to the nearest integer (ceiling function).
        /// </summary>
        /// <param name="number">The number to round up</param>
        /// <returns>The smallest integer greater than or equal to the number</returns>
        /// <example>
        /// RoundUp(4.1) returns 5
        /// RoundUp(4.9) returns 5
        /// RoundUp(-2.8) returns -2
        /// RoundUp(6.0) returns 6
        /// </example>
        public static int RoundUp(double number)
        {
            return (int)Math.Ceiling(number);
        }

        /// <summary>
        /// Converts a decimal to a fraction representation (simplified).
        /// Works best with terminating decimals.
        /// </summary>
        /// <param name="decimal">The decimal number to convert</param>
        /// <param name="maxDenominator">Maximum allowed denominator (default 1000)</param>
        /// <returns>Tuple containing numerator and denominator</returns>
        /// <example>
        /// DecimalToFraction(0.5, 100) returns (1, 2)
        /// DecimalToFraction(0.75, 100) returns (3, 4)
        /// DecimalToFraction(0.2, 100) returns (1, 5)
        /// </example>
        public static (int numerator, int denominator) DecimalToFraction(double decimalValue, int maxDenominator = 1000)
        {
            if (maxDenominator <= 0)
            {
                throw new ArgumentException("Maximum denominator must be positive");
            }

            // Find the best fractional approximation
            int bestNumerator = 0;
            int bestDenominator = 1;
            double bestError = Math.Abs(decimalValue);

            for (int denominator = 1; denominator <= maxDenominator; denominator++)
            {
                int numerator = (int)Math.Round(decimalValue * denominator);
                double error = Math.Abs(decimalValue - (double)numerator / denominator);
                
                if (error < bestError)
                {
                    bestError = error;
                    bestNumerator = numerator;
                    bestDenominator = denominator;
                }

                if (error < 0.0000001) break; // Close enough
            }

            // Simplify the fraction
            return FractionOperations.SimplifyFraction(bestNumerator, bestDenominator);
        }

        /// <summary>
        /// Determines if a number is positive.
        /// </summary>
        /// <param name="number">The number to check</param>
        /// <returns>True if positive, false otherwise</returns>
        /// <example>
        /// IsPositive(5) returns true
        /// IsPositive(-3) returns false
        /// IsPositive(0) returns false
        /// </example>
        public static bool IsPositive(double number)
        {
            return number > 0;
        }

        /// <summary>
        /// Determines if a number is negative.
        /// </summary>
        /// <param name="number">The number to check</param>
        /// <returns>True if negative, false otherwise</returns>
        /// <example>
        /// IsNegative(-5) returns true
        /// IsNegative(3) returns false
        /// IsNegative(0) returns false
        /// </example>
        public static bool IsNegative(double number)
        {
            return number < 0;
        }

        /// <summary>
        /// Finds the distance between two points on a number line.
        /// Distance is always positive and equals |b - a|.
        /// </summary>
        /// <param name="a">First point</param>
        /// <param name="b">Second point</param>
        /// <returns>The distance between the points</returns>
        /// <example>
        /// DistanceOnNumberLine(3, 7) returns 4
        /// DistanceOnNumberLine(-2, 5) returns 7
        /// DistanceOnNumberLine(-8, -3) returns 5
        /// DistanceOnNumberLine(5, 2) returns 3
        /// </example>
        public static double DistanceOnNumberLine(double a, double b)
        {
            return Math.Abs(b - a);
        }

        /// <summary>
        /// Determines which of two numbers has the greater absolute value.
        /// </summary>
        /// <param name="a">First number</param>
        /// <param name="b">Second number</param>
        /// <returns>The number with greater absolute value</returns>
        /// <example>
        /// GreaterAbsoluteValue(-8, 5) returns -8 (|-8| = 8 > |5| = 5)
        /// GreaterAbsoluteValue(3, -2) returns 3 (|3| = 3 > |-2| = 2)
        /// </example>
        public static double GreaterAbsoluteValue(double a, double b)
        {
            return Math.Abs(a) >= Math.Abs(b) ? a : b;
        }

        /// <summary>
        /// Truncates a decimal number, removing the fractional part.
        /// Different from rounding - simply removes digits after decimal point.
        /// </summary>
        /// <param name="number">The number to truncate</param>
        /// <returns>The truncated integer</returns>
        /// <example>
        /// Truncate(4.9) returns 4
        /// Truncate(-3.7) returns -3
        /// Truncate(5.1) returns 5
        /// </example>
        public static int Truncate(double number)
        {
            return (int)Math.Truncate(number);
        }

        /// <summary>
        /// Gets the decimal part (fractional part) of a number.
        /// </summary>
        /// <param name="number">The number to extract decimal part from</param>
        /// <returns>The decimal/fractional part</returns>
        /// <example>
        /// GetDecimalPart(4.75) returns 0.75
        /// GetDecimalPart(-3.2) returns -0.2
        /// GetDecimalPart(5.0) returns 0.0
        /// </example>
        public static double GetDecimalPart(double number)
        {
            return number - Math.Truncate(number);
        }

        /// <summary>
        /// Counts the number of decimal places in a number.
        /// </summary>
        /// <param name="number">The number to analyze</param>
        /// <returns>The count of decimal places</returns>
        /// <example>
        /// CountDecimalPlaces(3.14) returns 2
        /// CountDecimalPlaces(7.5) returns 1
        /// CountDecimalPlaces(10.0) returns 0
        /// </example>
        public static int CountDecimalPlaces(double number)
        {
            string numberStr = number.ToString("G");
            int decimalIndex = numberStr.IndexOf('.');
            
            if (decimalIndex == -1)
            {
                return 0;
            }
            
            return numberStr.Length - decimalIndex - 1;
        }

        /// <summary>
        /// Determines if a decimal is terminating (has finite decimal places).
        /// A simplified fraction terminates if denominator has only factors of 2 and 5.
        /// </summary>
        /// <param name="numerator">Numerator of the fraction</param>
        /// <param name="denominator">Denominator of the fraction</param>
        /// <returns>True if the decimal terminates, false if it repeats</returns>
        /// <example>
        /// IsTerminatingDecimal(1, 2) returns true (1/2 = 0.5)
        /// IsTerminatingDecimal(1, 4) returns true (1/4 = 0.25)
        /// IsTerminatingDecimal(1, 3) returns false (1/3 = 0.333...)
        /// IsTerminatingDecimal(1, 6) returns false (1/6 = 0.1666...)
        /// </example>
        public static bool IsTerminatingDecimal(int numerator, int denominator)
        {
            if (denominator == 0)
            {
                throw new ArgumentException("Denominator cannot be zero");
            }

            // Simplify the fraction first
            var simplified = FractionOperations.SimplifyFraction(numerator, denominator);
            int den = Math.Abs(simplified.denominator);

            // Remove all factors of 2 and 5
            while (den % 2 == 0)
            {
                den /= 2;
            }
            while (den % 5 == 0)
            {
                den /= 5;
            }

            // If only 1 remains, the decimal terminates
            return den == 1;
        }
    }
}
