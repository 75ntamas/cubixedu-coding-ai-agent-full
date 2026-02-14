using System;

namespace MathLibrary
{
    /// <summary>
    /// Provides basic arithmetic operations for middle school mathematics.
    /// This class includes addition, subtraction, multiplication, and division operations
    /// with proper error handling and validation.
    /// </summary>
    /// <remarks>
    /// Use this class for fundamental arithmetic calculations.
    /// All methods are static and can be called directly without instantiation.
    /// Example: BasicArithmetic.Add(5, 3) returns 8
    /// </remarks>
    public class BasicArithmetic
    {
        /// <summary>
        /// Adds two numbers together and returns the sum.
        /// </summary>
        /// <param name="a">The first number to add</param>
        /// <param name="b">The second number to add</param>
        /// <returns>The sum of a and b</returns>
        /// <example>
        /// BasicArithmetic.Add(10, 5) returns 15
        /// BasicArithmetic.Add(-3, 7) returns 4
        /// </example>
        public static double Add(double a, double b)
        {
            return a + b;
        }

        /// <summary>
        /// Subtracts the second number from the first number.
        /// </summary>
        /// <param name="a">The number to subtract from (minuend)</param>
        /// <param name="b">The number to subtract (subtrahend)</param>
        /// <returns>The difference between a and b</returns>
        /// <example>
        /// BasicArithmetic.Subtract(10, 5) returns 5
        /// BasicArithmetic.Subtract(3, 7) returns -4
        /// </example>
        public static double Subtract(double a, double b)
        {
            return a - b;
        }

        /// <summary>
        /// Multiplies two numbers together and returns the product.
        /// </summary>
        /// <param name="a">The first factor</param>
        /// <param name="b">The second factor</param>
        /// <returns>The product of a and b</returns>
        /// <example>
        /// BasicArithmetic.Multiply(4, 5) returns 20
        /// BasicArithmetic.Multiply(-2, 3) returns -6
        /// </example>
        public static double Multiply(double a, double b)
        {
            return a * b;
        }

        /// <summary>
        /// Divides the first number by the second number.
        /// </summary>
        /// <param name="a">The dividend (number to be divided)</param>
        /// <param name="b">The divisor (number to divide by)</param>
        /// <returns>The quotient of a divided by b</returns>
        /// <exception cref="DivideByZeroException">Thrown when b is zero</exception>
        /// <example>
        /// BasicArithmetic.Divide(20, 4) returns 5
        /// BasicArithmetic.Divide(7, 2) returns 3.5
        /// </example>
        public static double Divide(double a, double b)
        {
            if (b == 0)
            {
                throw new DivideByZeroException("Cannot divide by zero");
            }
            return a / b;
        }

        /// <summary>
        /// Calculates the remainder after division (modulo operation).
        /// </summary>
        /// <param name="a">The dividend</param>
        /// <param name="b">The divisor</param>
        /// <returns>The remainder of a divided by b</returns>
        /// <example>
        /// BasicArithmetic.Modulo(10, 3) returns 1
        /// BasicArithmetic.Modulo(15, 4) returns 3
        /// </example>
        public static double Modulo(double a, double b)
        {
            if (b == 0)
            {
                throw new DivideByZeroException("Cannot divide by zero");
            }
            return a % b;
        }
    }
}
