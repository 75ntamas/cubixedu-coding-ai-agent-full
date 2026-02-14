using System;
using System.Collections.Generic;

namespace MathLibrary
{
    /// <summary>
    /// Provides methods for basic algebraic operations and concepts in middle school mathematics.
    /// This class handles variable evaluation, expression simplification, and equation solving.
    /// </summary>
    /// <remarks>
    /// Topics: Algebra, Variables, Expressions, Equations, Evaluation, Simplification
    /// Algebra uses letters (variables) to represent unknown values.
    /// Key concepts:
    /// - Variables: Symbols that represent numbers (e.g., x, y)
    /// - Expressions: Mathematical phrases with variables (e.g., 3x + 5)
    /// - Equations: Mathematical statements that two expressions are equal (e.g., 2x + 3 = 7)
    /// - Like terms: Terms with the same variable and exponent
    /// </remarks>
    public class AlgebraBasics
    {
        /// <summary>
        /// Evaluates a linear expression of the form ax + b for a given value of x.
        /// </summary>
        /// <param name="coefficient">The coefficient (a) multiplying the variable</param>
        /// <param name="constant">The constant term (b)</param>
        /// <param name="variableValue">The value to substitute for the variable (x)</param>
        /// <returns>The evaluated result</returns>
        /// <example>
        /// EvaluateLinearExpression(3, 5, 2) returns 11 (3×2 + 5 = 11)
        /// EvaluateLinearExpression(-2, 7, 4) returns -1 (-2×4 + 7 = -1)
        /// </example>
        public static double EvaluateLinearExpression(double coefficient, double constant, double variableValue)
        {
            return coefficient * variableValue + constant;
        }

        /// <summary>
        /// Evaluates a quadratic expression of the form ax² + bx + c for a given value of x.
        /// </summary>
        /// <param name="a">The coefficient of x²</param>
        /// <param name="b">The coefficient of x</param>
        /// <param name="c">The constant term</param>
        /// <param name="x">The value to substitute for the variable</param>
        /// <returns>The evaluated result</returns>
        /// <example>
        /// EvaluateQuadraticExpression(1, -3, 2, 5) returns 12 (5² - 3×5 + 2 = 25 - 15 + 2 = 12)
        /// EvaluateQuadraticExpression(2, 4, -1, 3) returns 29 (2×3² + 4×3 - 1 = 18 + 12 - 1 = 29)
        /// </example>
        public static double EvaluateQuadraticExpression(double a, double b, double c, double x)
        {
            return a * x * x + b * x + c;
        }

        /// <summary>
        /// Solves a simple linear equation of the form ax + b = c for x.
        /// Formula: x = (c - b) / a
        /// </summary>
        /// <param name="a">The coefficient of x</param>
        /// <param name="b">The constant on the left side</param>
        /// <param name="c">The constant on the right side</param>
        /// <returns>The value of x that satisfies the equation</returns>
        /// <exception cref="ArgumentException">Thrown when a is zero (no unique solution)</exception>
        /// <example>
        /// SolveLinearEquation(2, 3, 7) returns 2 (2x + 3 = 7, so x = 2)
        /// SolveLinearEquation(5, -10, 15) returns 5 (5x - 10 = 15, so x = 5)
        /// </example>
        public static double SolveLinearEquation(double a, double b, double c)
        {
            if (a == 0)
            {
                throw new ArgumentException("Coefficient 'a' cannot be zero. The equation has no unique solution.");
            }
            return (c - b) / a;
        }

        /// <summary>
        /// Combines like terms in a simple algebraic expression.
        /// Takes coefficients of the same variable and returns the simplified coefficient.
        /// </summary>
        /// <param name="coefficients">Array of coefficients for like terms</param>
        /// <returns>The sum of all coefficients (combined like terms)</returns>
        /// <example>
        /// CombineLikeTerms(new double[] {3, 5, -2}) returns 6 (3x + 5x - 2x = 6x)
        /// CombineLikeTerms(new double[] {7, -4, 2, -1}) returns 4 (7x - 4x + 2x - x = 4x)
        /// </example>
        public static double CombineLikeTerms(double[] coefficients)
        {
            double sum = 0;
            foreach (double coef in coefficients)
            {
                sum += coef;
            }
            return sum;
        }

        /// <summary>
        /// Distributes multiplication over addition: a(b + c) = ab + ac
        /// </summary>
        /// <param name="multiplier">The value outside the parentheses (a)</param>
        /// <param name="term1">The first term inside parentheses (b)</param>
        /// <param name="term2">The second term inside parentheses (c)</param>
        /// <returns>Tuple containing the two distributed terms (ab, ac)</returns>
        /// <example>
        /// DistributeMultiplication(3, 4, 5) returns (12, 15) (3×4 + 3×5 = 12 + 15)
        /// DistributeMultiplication(2, -3, 7) returns (-6, 14) (2×(-3) + 2×7 = -6 + 14)
        /// </example>
        public static (double term1Result, double term2Result) DistributeMultiplication(double multiplier, double term1, double term2)
        {
            return (multiplier * term1, multiplier * term2);
        }

        /// <summary>
        /// Calculates the value distributed from a(b + c) and returns the final sum: ab + ac.
        /// </summary>
        /// <param name="multiplier">The value outside the parentheses</param>
        /// <param name="term1">The first term inside parentheses</param>
        /// <param name="term2">The second term inside parentheses</param>
        /// <returns>The final distributed and simplified result</returns>
        /// <example>
        /// DistributeAndSimplify(3, 4, 5) returns 27 (3(4 + 5) = 3×4 + 3×5 = 12 + 15 = 27)
        /// </example>
        public static double DistributeAndSimplify(double multiplier, double term1, double term2)
        {
            return multiplier * term1 + multiplier * term2;
        }

        /// <summary>
        /// Factors out the Greatest Common Factor (GCF) from terms.
        /// Given terms ax and ay, finds the common factor a and returns a(x + y).
        /// </summary>
        /// <param name="term1">The first term</param>
        /// <param name="term2">The second term</param>
        /// <returns>The greatest common factor</returns>
        /// <example>
        /// FindCommonFactor(12, 18) returns 6 (12 = 6×2, 18 = 6×3, so GCF is 6)
        /// FindCommonFactor(15, 25) returns 5 (15 = 5×3, 25 = 5×5, so GCF is 5)
        /// </example>
        public static int FindCommonFactor(int term1, int term2)
        {
            return FractionOperations.GCD(term1, term2);
        }

        /// <summary>
        /// Evaluates an expression with multiple variables.
        /// Takes a dictionary of variable values and returns the evaluated result.
        /// Example: 2x + 3y - z where x=5, y=2, z=1 returns 2(5) + 3(2) - 1 = 15
        /// </summary>
        /// <param name="coefficients">Dictionary mapping variable names to their coefficients</param>
        /// <param name="values">Dictionary mapping variable names to their values</param>
        /// <param name="constant">The constant term in the expression</param>
        /// <returns>The evaluated result</returns>
        /// <example>
        /// var coef = new Dictionary&lt;string, double&gt; { {"x", 2}, {"y", 3} };
        /// var vals = new Dictionary&lt;string, double&gt; { {"x", 5}, {"y", 4} };
        /// EvaluateMultiVariableExpression(coef, vals, 1) returns 23 (2×5 + 3×4 + 1 = 23)
        /// </example>
        public static double EvaluateMultiVariableExpression(
            Dictionary<string, double> coefficients,
            Dictionary<string, double> values,
            double constant)
        {
            double result = constant;
            foreach (var variable in coefficients.Keys)
            {
                if (values.ContainsKey(variable))
                {
                    result += coefficients[variable] * values[variable];
                }
                else
                {
                    throw new ArgumentException($"Value for variable '{variable}' not provided");
                }
            }
            return result;
        }

        /// <summary>
        /// Checks if a given value is a solution to the equation ax + b = c.
        /// </summary>
        /// <param name="a">Coefficient of x</param>
        /// <param name="b">Constant on left side</param>
        /// <param name="c">Constant on right side</param>
        /// <param name="x">The value to check</param>
        /// <returns>True if x satisfies the equation, false otherwise</returns>
        /// <example>
        /// IsEquationSolution(2, 3, 11, 4) returns true (2×4 + 3 = 11 is true)
        /// IsEquationSolution(3, 5, 20, 4) returns false (3×4 + 5 = 17, not 20)
        /// </example>
        public static bool IsEquationSolution(double a, double b, double c, double x)
        {
            double leftSide = a * x + b;
            return Math.Abs(leftSide - c) < 0.0001; // Using small epsilon for floating point comparison
        }

        /// <summary>
        /// Isolates the variable in a simple equation by performing inverse operations.
        /// Demonstrates the step-by-step process of solving ax + b = c.
        /// </summary>
        /// <param name="a">Coefficient of x</param>
        /// <param name="b">Constant on left side</param>
        /// <param name="c">Constant on right side</param>
        /// <returns>Tuple containing intermediate step (c - b) and final answer ((c - b) / a)</returns>
        /// <example>
        /// IsolateVariable(2, 3, 11) returns (8, 4)
        /// Step 1: 2x + 3 = 11
        /// Step 2: 2x = 11 - 3 = 8 (first value)
        /// Step 3: x = 8 / 2 = 4 (second value)
        /// </example>
        public static (double afterSubtraction, double finalAnswer) IsolateVariable(double a, double b, double c)
        {
            if (a == 0)
            {
                throw new ArgumentException("Coefficient 'a' cannot be zero");
            }
            double afterSubtraction = c - b;
            double finalAnswer = afterSubtraction / a;
            return (afterSubtraction, finalAnswer);
        }
    }
}
