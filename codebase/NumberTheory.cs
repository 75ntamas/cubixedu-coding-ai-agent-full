using System;
using System.Collections.Generic;

namespace MathLibrary
{
    /// <summary>
    /// Provides number theory methods for middle school mathematics.
    /// This class includes operations related to prime numbers, factors, multiples, and divisibility.
    /// </summary>
    /// <remarks>
    /// Topics: Number Theory, Prime Numbers, Factors, Multiples, Divisibility, Even/Odd Numbers
    /// Number theory studies the properties and relationships of integers.
    /// Key concepts:
    /// - Prime Numbers: Numbers greater than 1 with exactly two factors (1 and itself)
    /// - Composite Numbers: Numbers with more than two factors
    /// - Factors: Numbers that divide evenly into another number
    /// - Multiples: Products of a number and integers
    /// - Divisibility Rules: Quick ways to determine if one number divides another
    /// </remarks>
    public class NumberTheory
    {
        /// <summary>
        /// Determines if a number is prime.
        /// A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.
        /// </summary>
        /// <param name="number">The number to check</param>
        /// <returns>True if the number is prime, false otherwise</returns>
        /// <example>
        /// IsPrime(7) returns true
        /// IsPrime(10) returns false
        /// IsPrime(2) returns true (2 is the only even prime)
        /// IsPrime(1) returns false (1 is not considered prime)
        /// </example>
        public static bool IsPrime(int number)
        {
            if (number <= 1) return false;
            if (number == 2) return true;
            if (number % 2 == 0) return false;

            // Check odd divisors up to square root of number
            int sqrt = (int)Math.Sqrt(number);
            for (int i = 3; i <= sqrt; i += 2)
            {
                if (number % i == 0)
                {
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// Determines if a number is composite.
        /// A composite number is a positive integer greater than 1 that has more than two factors.
        /// </summary>
        /// <param name="number">The number to check</param>
        /// <returns>True if the number is composite, false otherwise</returns>
        /// <example>
        /// IsComposite(4) returns true (factors: 1, 2, 4)
        /// IsComposite(9) returns true (factors: 1, 3, 9)
        /// IsComposite(7) returns false (7 is prime)
        /// </example>
        public static bool IsComposite(int number)
        {
            return number > 1 && !IsPrime(number);
        }

        /// <summary>
        /// Finds all prime numbers up to a given limit using the Sieve of Eratosthenes algorithm.
        /// </summary>
        /// <param name="limit">The upper limit for finding primes</param>
        /// <returns>List of all prime numbers up to and including the limit</returns>
        /// <example>
        /// FindPrimesUpTo(20) returns {2, 3, 5, 7, 11, 13, 17, 19}
        /// FindPrimesUpTo(10) returns {2, 3, 5, 7}
        /// </example>
        public static List<int> FindPrimesUpTo(int limit)
        {
            if (limit < 2)
            {
                return new List<int>();
            }

            bool[] isPrime = new bool[limit + 1];
            for (int i = 2; i <= limit; i++)
            {
                isPrime[i] = true;
            }

            for (int i = 2; i * i <= limit; i++)
            {
                if (isPrime[i])
                {
                    for (int j = i * i; j <= limit; j += i)
                    {
                        isPrime[j] = false;
                    }
                }
            }

            List<int> primes = new List<int>();
            for (int i = 2; i <= limit; i++)
            {
                if (isPrime[i])
                {
                    primes.Add(i);
                }
            }
            return primes;
        }

        /// <summary>
        /// Finds all factors (divisors) of a number.
        /// Factors are positive integers that divide the number evenly.
        /// </summary>
        /// <param name="number">The number to find factors of</param>
        /// <returns>List of all factors in ascending order</returns>
        /// <example>
        /// FindFactors(12) returns {1, 2, 3, 4, 6, 12}
        /// FindFactors(15) returns {1, 3, 5, 15}
        /// FindFactors(7) returns {1, 7}
        /// </example>
        public static List<int> FindFactors(int number)
        {
            if (number <= 0)
            {
                throw new ArgumentException("Number must be positive");
            }

            List<int> factors = new List<int>();
            for (int i = 1; i <= Math.Sqrt(number); i++)
            {
                if (number % i == 0)
                {
                    factors.Add(i);
                    if (i != number / i)
                    {
                        factors.Add(number / i);
                    }
                }
            }
            factors.Sort();
            return factors;
        }

        /// <summary>
        /// Finds the prime factorization of a number.
        /// Prime factorization expresses a number as a product of prime numbers.
        /// </summary>
        /// <param name="number">The number to factorize</param>
        /// <returns>List of prime factors (may contain duplicates)</returns>
        /// <example>
        /// PrimeFactorization(12) returns {2, 2, 3} (12 = 2 × 2 × 3)
        /// PrimeFactorization(30) returns {2, 3, 5} (30 = 2 × 3 × 5)
        /// PrimeFactorization(7) returns {7} (7 is prime)
        /// </example>
        public static List<int> PrimeFactorization(int number)
        {
            if (number <= 1)
            {
                throw new ArgumentException("Number must be greater than 1");
            }

            List<int> factors = new List<int>();
            
            // Divide by 2 until no longer divisible
            while (number % 2 == 0)
            {
                factors.Add(2);
                number /= 2;
            }

            // Check odd divisors from 3 onwards
            for (int i = 3; i <= Math.Sqrt(number); i += 2)
            {
                while (number % i == 0)
                {
                    factors.Add(i);
                    number /= i;
                }
            }

            // If number is still greater than 1, it's a prime factor
            if (number > 1)
            {
                factors.Add(number);
            }

            return factors;
        }

        /// <summary>
        /// Finds the first n multiples of a given number.
        /// Multiples are products of the number and positive integers.
        /// </summary>
        /// <param name="number">The base number</param>
        /// <param name="count">How many multiples to find</param>
        /// <returns>List of the first n multiples</returns>
        /// <example>
        /// FindMultiples(3, 5) returns {3, 6, 9, 12, 15}
        /// FindMultiples(7, 4) returns {7, 14, 21, 28}
        /// </example>
        public static List<int> FindMultiples(int number, int count)
        {
            if (count < 0)
            {
                throw new ArgumentException("Count cannot be negative");
            }

            List<int> multiples = new List<int>();
            for (int i = 1; i <= count; i++)
            {
                multiples.Add(number * i);
            }
            return multiples;
        }

        /// <summary>
        /// Determines if a number is even.
        /// Even numbers are divisible by 2.
        /// </summary>
        /// <param name="number">The number to check</param>
        /// <returns>True if the number is even, false otherwise</returns>
        /// <example>
        /// IsEven(4) returns true
        /// IsEven(7) returns false
        /// IsEven(0) returns true
        /// </example>
        public static bool IsEven(int number)
        {
            return number % 2 == 0;
        }

        /// <summary>
        /// Determines if a number is odd.
        /// Odd numbers are not divisible by 2.
        /// </summary>
        /// <param name="number">The number to check</param>
        /// <returns>True if the number is odd, false otherwise</returns>
        /// <example>
        /// IsOdd(5) returns true
        /// IsOdd(8) returns false
        /// IsOdd(-3) returns true
        /// </example>
        public static bool IsOdd(int number)
        {
            return number % 2 != 0;
        }

        /// <summary>
        /// Checks if one number is divisible by another.
        /// A number a is divisible by b if a ÷ b has no remainder.
        /// </summary>
        /// <param name="dividend">The number to be divided</param>
        /// <param name="divisor">The number to divide by</param>
        /// <returns>True if dividend is divisible by divisor, false otherwise</returns>
        /// <example>
        /// IsDivisibleBy(15, 3) returns true
        /// IsDivisibleBy(17, 4) returns false
        /// IsDivisibleBy(20, 5) returns true
        /// </example>
        public static bool IsDivisibleBy(int dividend, int divisor)
        {
            if (divisor == 0)
            {
                throw new DivideByZeroException("Divisor cannot be zero");
            }
            return dividend % divisor == 0;
        }

        /// <summary>
        /// Counts the number of factors a number has.
        /// </summary>
        /// <param name="number">The number to count factors of</param>
        /// <returns>The count of factors</returns>
        /// <example>
        /// CountFactors(12) returns 6 (factors: 1, 2, 3, 4, 6, 12)
        /// CountFactors(7) returns 2 (factors: 1, 7)
        /// </example>
        public static int CountFactors(int number)
        {
            return FindFactors(number).Count;
        }

        /// <summary>
        /// Determines if two numbers are relatively prime (coprime).
        /// Two numbers are relatively prime if their GCD is 1.
        /// </summary>
        /// <param name="a">First number</param>
        /// <param name="b">Second number</param>
        /// <returns>True if the numbers are relatively prime, false otherwise</returns>
        /// <example>
        /// AreRelativelyPrime(8, 15) returns true (GCD is 1)
        /// AreRelativelyPrime(12, 18) returns false (GCD is 6)
        /// </example>
        public static bool AreRelativelyPrime(int a, int b)
        {
            return FractionOperations.GCD(a, b) == 1;
        }

        /// <summary>
        /// Finds common multiples of two numbers up to a limit.
        /// </summary>
        /// <param name="a">First number</param>
        /// <param name="b">Second number</param>
        /// <param name="limit">Upper limit for finding common multiples</param>
        /// <returns>List of common multiples up to the limit</returns>
        /// <example>
        /// FindCommonMultiples(3, 4, 30) returns {12, 24}
        /// FindCommonMultiples(2, 5, 25) returns {10, 20}
        /// </example>
        public static List<int> FindCommonMultiples(int a, int b, int limit)
        {
            List<int> commonMultiples = new List<int>();
            int lcm = FractionOperations.LCM(a, b);
            
            for (int multiple = lcm; multiple <= limit; multiple += lcm)
            {
                commonMultiples.Add(multiple);
            }
            
            return commonMultiples;
        }

        /// <summary>
        /// Finds common factors of two numbers.
        /// </summary>
        /// <param name="a">First number</param>
        /// <param name="b">Second number</param>
        /// <returns>List of common factors in ascending order</returns>
        /// <example>
        /// FindCommonFactors(12, 18) returns {1, 2, 3, 6}
        /// FindCommonFactors(15, 25) returns {1, 5}
        /// </example>
        public static List<int> FindCommonFactors(int a, int b)
        {
            List<int> factorsA = FindFactors(a);
            List<int> factorsB = FindFactors(b);
            List<int> commonFactors = new List<int>();

            foreach (int factor in factorsA)
            {
                if (factorsB.Contains(factor))
                {
                    commonFactors.Add(factor);
                }
            }

            return commonFactors;
        }
    }
}
