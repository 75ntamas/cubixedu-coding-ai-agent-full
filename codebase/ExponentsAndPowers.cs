using System;

namespace MathLibrary
{
    /// <summary>
    /// Provides methods for working with exponents, powers, and exponential operations.
    /// This class covers fundamental concepts of exponentiation taught in middle school mathematics.
    /// </summary>
    /// <remarks>
    /// Topics: Exponents, Powers, Bases, Scientific Notation, Exponential Growth
    /// Key concepts:
    /// - Base^Exponent: The base multiplied by itself exponent times
    /// - Negative exponents: a^(-n) = 1/(a^n)
    /// - Zero exponent: a^0 = 1 (for any non-zero a)
    /// - Fractional exponents: a^(1/n) = nth root of a
    /// </remarks>
    public class ExponentsAndPowers
    {
        /// <summary>
        /// Calculates a number raised to a power (exponentiation).
        /// Formula: base^exponent
        /// </summary>
        /// <param name="baseNumber">The base number</param>
        /// <param name="exponent">The exponent (power)</param>
        /// <returns>The result of base raised to the exponent</returns>
        /// <example>
        /// Power(2, 3) returns 8 (2³ = 8)
        /// Power(5, 2) returns 25 (5² = 25)
        /// Power(10, 0) returns 1 (any number to power 0 is 1)
        /// Power(2, -2) returns 0.25 (2^(-2) = 1/4 = 0.25)
        /// </example>
        public static double Power(double baseNumber, double exponent)
        {
            return Math.Pow(baseNumber, exponent);
        }

        /// <summary>
        /// Calculates the square of a number.
        /// Formula: n² = n × n
        /// </summary>
        /// <param name="number">The number to square</param>
        /// <returns>The square of the number</returns>
        /// <example>
        /// Square(5) returns 25
        /// Square(9) returns 81
        /// Square(-3) returns 9
        /// </example>
        public static double Square(double number)
        {
            return number * number;
        }

        /// <summary>
        /// Calculates the cube of a number.
        /// Formula: n³ = n × n × n
        /// </summary>
        /// <param name="number">The number to cube</param>
        /// <returns>The cube of the number</returns>
        /// <example>
        /// Cube(3) returns 27
        /// Cube(4) returns 64
        /// Cube(-2) returns -8
        /// </example>
        public static double Cube(double number)
        {
            return number * number * number;
        }

        /// <summary>
        /// Calculates the square root of a number.
        /// Formula: √n - the value that when squared gives n
        /// </summary>
        /// <param name="number">The number to find the square root of (must be non-negative)</param>
        /// <returns>The square root of the number</returns>
        /// <exception cref="ArgumentException">Thrown when number is negative</exception>
        /// <example>
        /// SquareRoot(25) returns 5
        /// SquareRoot(144) returns 12
        /// SquareRoot(2) returns approximately 1.414
        /// </example>
        public static double SquareRoot(double number)
        {
            if (number < 0)
            {
                throw new ArgumentException("Cannot calculate square root of negative number");
            }
            return Math.Sqrt(number);
        }

        /// <summary>
        /// Calculates the cube root of a number.
        /// Formula: ∛n - the value that when cubed gives n
        /// </summary>
        /// <param name="number">The number to find the cube root of</param>
        /// <returns>The cube root of the number</returns>
        /// <example>
        /// CubeRoot(27) returns 3
        /// CubeRoot(64) returns 4
        /// CubeRoot(-8) returns -2
        /// </example>
        public static double CubeRoot(double number)
        {
            if (number < 0)
            {
                return -Math.Pow(-number, 1.0 / 3.0);
            }
            return Math.Pow(number, 1.0 / 3.0);
        }

        /// <summary>
        /// Calculates the nth root of a number.
        /// Formula: ⁿ√x - the value that when raised to power n gives x
        /// </summary>
        /// <param name="number">The number to find the root of</param>
        /// <param name="root">The root to calculate (e.g., 2 for square root, 3 for cube root)</param>
        /// <returns>The nth root of the number</returns>
        /// <exception cref="ArgumentException">Thrown when root is zero or when taking even root of negative number</exception>
        /// <example>
        /// NthRoot(16, 4) returns 2 (fourth root of 16 is 2)
        /// NthRoot(32, 5) returns 2 (fifth root of 32 is 2)
        /// </example>
        public static double NthRoot(double number, int root)
        {
            if (root == 0)
            {
                throw new ArgumentException("Root cannot be zero");
            }

            if (number < 0 && root % 2 == 0)
            {
                throw new ArgumentException("Cannot take even root of negative number");
            }

            if (number < 0 && root % 2 != 0)
            {
                return -Math.Pow(-number, 1.0 / root);
            }

            return Math.Pow(number, 1.0 / root);
        }

        /// <summary>
        /// Determines if a number is a perfect square.
        /// A perfect square is a number that has an integer square root.
        /// </summary>
        /// <param name="number">The number to check</param>
        /// <returns>True if the number is a perfect square, false otherwise</returns>
        /// <example>
        /// IsPerfectSquare(16) returns true (4² = 16)
        /// IsPerfectSquare(25) returns true (5² = 25)
        /// IsPerfectSquare(20) returns false
        /// </example>
        public static bool IsPerfectSquare(int number)
        {
            if (number < 0)
            {
                return false;
            }

            int sqrt = (int)Math.Sqrt(number);
            return sqrt * sqrt == number;
        }

        /// <summary>
        /// Determines if a number is a perfect cube.
        /// A perfect cube is a number that has an integer cube root.
        /// </summary>
        /// <param name="number">The number to check</param>
        /// <returns>True if the number is a perfect cube, false otherwise</returns>
        /// <example>
        /// IsPerfectCube(27) returns true (3³ = 27)
        /// IsPerfectCube(64) returns true (4³ = 64)
        /// IsPerfectCube(30) returns false
        /// </example>
        public static bool IsPerfectCube(int number)
        {
            int cubeRoot = (int)Math.Round(CubeRoot(number));
            return cubeRoot * cubeRoot * cubeRoot == number;
        }

        /// <summary>
        /// Converts a number to scientific notation representation.
        /// Scientific notation: a × 10^b where 1 ≤ |a| < 10
        /// </summary>
        /// <param name="number">The number to convert</param>
        /// <returns>Tuple containing the coefficient (a) and exponent (b)</returns>
        /// <example>
        /// ToScientificNotation(3000) returns (3.0, 3) meaning 3.0 × 10³
        /// ToScientificNotation(0.005) returns (5.0, -3) meaning 5.0 × 10⁻³
        /// ToScientificNotation(42) returns (4.2, 1) meaning 4.2 × 10¹
        /// </example>
        public static (double coefficient, int exponent) ToScientificNotation(double number)
        {
            if (number == 0)
            {
                return (0, 0);
            }

            int exponent = (int)Math.Floor(Math.Log10(Math.Abs(number)));
            double coefficient = number / Math.Pow(10, exponent);
            
            return (coefficient, exponent);
        }

        /// <summary>
        /// Converts from scientific notation to standard decimal form.
        /// </summary>
        /// <param name="coefficient">The coefficient (a in a × 10^b)</param>
        /// <param name="exponent">The exponent (b in a × 10^b)</param>
        /// <returns>The number in standard decimal form</returns>
        /// <example>
        /// FromScientificNotation(3.0, 3) returns 3000 (3.0 × 10³)
        /// FromScientificNotation(5.0, -3) returns 0.005 (5.0 × 10⁻³)
        /// </example>
        public static double FromScientificNotation(double coefficient, int exponent)
        {
            return coefficient * Math.Pow(10, exponent);
        }

        /// <summary>
        /// Multiplies numbers in exponential form with the same base.
        /// When multiplying powers with same base: a^m × a^n = a^(m+n)
        /// </summary>
        /// <param name="baseNumber">The common base</param>
        /// <param name="exponent1">First exponent</param>
        /// <param name="exponent2">Second exponent</param>
        /// <returns>The result of base^(exponent1 + exponent2)</returns>
        /// <example>
        /// MultiplyWithSameBase(2, 3, 4) returns 128 (2³ × 2⁴ = 2⁷ = 128)
        /// </example>
        public static double MultiplyWithSameBase(double baseNumber, double exponent1, double exponent2)
        {
            return Math.Pow(baseNumber, exponent1 + exponent2);
        }

        /// <summary>
        /// Divides numbers in exponential form with the same base.
        /// When dividing powers with same base: a^m ÷ a^n = a^(m-n)
        /// </summary>
        /// <param name="baseNumber">The common base</param>
        /// <param name="exponent1">Numerator exponent</param>
        /// <param name="exponent2">Denominator exponent</param>
        /// <returns>The result of base^(exponent1 - exponent2)</returns>
        /// <example>
        /// DivideWithSameBase(3, 5, 2) returns 27 (3⁵ ÷ 3² = 3³ = 27)
        /// </example>
        public static double DivideWithSameBase(double baseNumber, double exponent1, double exponent2)
        {
            if (baseNumber == 0)
            {
                throw new ArgumentException("Base cannot be zero");
            }
            return Math.Pow(baseNumber, exponent1 - exponent2);
        }
    }
}
