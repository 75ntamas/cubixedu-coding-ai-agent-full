using System;

namespace MathLibrary
{
    /// <summary>
    /// Provides percentage calculation methods for middle school mathematics.
    /// This class handles common percentage operations including:
    /// - Converting between decimals, fractions, and percentages
    /// - Calculating percentage of a number
    /// - Finding what percentage one number is of another
    /// - Percentage increase and decrease calculations
    /// </summary>
    /// <remarks>
    /// Percentages represent parts per hundred (per cent = per 100).
    /// Topics: Percentages, Ratios, Proportions, Decimal Conversions
    /// Common applications: Discounts, Sales Tax, Grade Calculations, Statistics
    /// </remarks>
    public class PercentageCalculations
    {
        /// <summary>
        /// Converts a decimal number to a percentage.
        /// </summary>
        /// <param name="decimal">The decimal value (e.g., 0.5 for 50%)</param>
        /// <returns>The percentage value</returns>
        /// <example>
        /// DecimalToPercentage(0.75) returns 75.0
        /// DecimalToPercentage(0.125) returns 12.5
        /// DecimalToPercentage(1.5) returns 150.0
        /// </example>
        public static double DecimalToPercentage(double decimalValue)
        {
            return decimalValue * 100;
        }

        /// <summary>
        /// Converts a percentage to a decimal number.
        /// </summary>
        /// <param name="percentage">The percentage value (e.g., 50 for 50%)</param>
        /// <returns>The decimal value</returns>
        /// <example>
        /// PercentageToDecimal(75) returns 0.75
        /// PercentageToDecimal(12.5) returns 0.125
        /// PercentageToDecimal(150) returns 1.5
        /// </example>
        public static double PercentageToDecimal(double percentage)
        {
            return percentage / 100;
        }

        /// <summary>
        /// Calculates what percentage the first number is of the second number.
        /// Formula: (part / whole) * 100
        /// </summary>
        /// <param name="part">The part value</param>
        /// <param name="whole">The whole value</param>
        /// <returns>The percentage that part represents of whole</returns>
        /// <exception cref="ArgumentException">Thrown when whole is zero</exception>
        /// <example>
        /// WhatPercentOf(25, 100) returns 25.0 (25 is 25% of 100)
        /// WhatPercentOf(15, 60) returns 25.0 (15 is 25% of 60)
        /// WhatPercentOf(30, 40) returns 75.0 (30 is 75% of 40)
        /// </example>
        public static double WhatPercentOf(double part, double whole)
        {
            if (whole == 0)
            {
                throw new ArgumentException("The whole value cannot be zero");
            }
            return (part / whole) * 100;
        }

        /// <summary>
        /// Calculates a given percentage of a number.
        /// Formula: (percentage / 100) * number
        /// </summary>
        /// <param name="percentage">The percentage to calculate (e.g., 25 for 25%)</param>
        /// <param name="number">The number to find the percentage of</param>
        /// <returns>The calculated value</returns>
        /// <example>
        /// PercentageOf(25, 200) returns 50 (25% of 200 is 50)
        /// PercentageOf(10, 150) returns 15 (10% of 150 is 15)
        /// PercentageOf(75, 80) returns 60 (75% of 80 is 60)
        /// </example>
        public static double PercentageOf(double percentage, double number)
        {
            return (percentage / 100) * number;
        }

        /// <summary>
        /// Calculates the percentage increase from the original value to the new value.
        /// Formula: ((new - original) / original) * 100
        /// </summary>
        /// <param name="originalValue">The starting value</param>
        /// <param name="newValue">The ending value</param>
        /// <returns>The percentage increase (positive value)</returns>
        /// <exception cref="ArgumentException">Thrown when original value is zero</exception>
        /// <example>
        /// PercentageIncrease(50, 75) returns 50.0 (50 to 75 is a 50% increase)
        /// PercentageIncrease(100, 120) returns 20.0 (100 to 120 is a 20% increase)
        /// PercentageIncrease(80, 100) returns 25.0 (80 to 100 is a 25% increase)
        /// </example>
        public static double PercentageIncrease(double originalValue, double newValue)
        {
            if (originalValue == 0)
            {
                throw new ArgumentException("Original value cannot be zero");
            }
            return ((newValue - originalValue) / originalValue) * 100;
        }

        /// <summary>
        /// Calculates the percentage decrease from the original value to the new value.
        /// Formula: ((original - new) / original) * 100
        /// </summary>
        /// <param name="originalValue">The starting value</param>
        /// <param name="newValue">The ending value</param>
        /// <returns>The percentage decrease (positive value)</returns>
        /// <exception cref="ArgumentException">Thrown when original value is zero</exception>
        /// <example>
        /// PercentageDecrease(100, 75) returns 25.0 (100 to 75 is a 25% decrease)
        /// PercentageDecrease(200, 150) returns 25.0 (200 to 150 is a 25% decrease)
        /// PercentageDecrease(80, 60) returns 25.0 (80 to 60 is a 25% decrease)
        /// </example>
        public static double PercentageDecrease(double originalValue, double newValue)
        {
            if (originalValue == 0)
            {
                throw new ArgumentException("Original value cannot be zero");
            }
            return ((originalValue - newValue) / originalValue) * 100;
        }

        /// <summary>
        /// Applies a percentage increase to a value.
        /// </summary>
        /// <param name="value">The original value</param>
        /// <param name="percentage">The percentage to increase by</param>
        /// <returns>The value after the percentage increase</returns>
        /// <example>
        /// ApplyPercentageIncrease(100, 10) returns 110 (100 + 10% = 110)
        /// ApplyPercentageIncrease(50, 20) returns 60 (50 + 20% = 60)
        /// </example>
        public static double ApplyPercentageIncrease(double value, double percentage)
        {
            return value + PercentageOf(percentage, value);
        }

        /// <summary>
        /// Applies a percentage decrease to a value (useful for calculating discounts).
        /// </summary>
        /// <param name="value">The original value</param>
        /// <param name="percentage">The percentage to decrease by</param>
        /// <returns>The value after the percentage decrease</returns>
        /// <example>
        /// ApplyPercentageDecrease(100, 20) returns 80 (100 - 20% = 80)
        /// ApplyPercentageDecrease(250, 15) returns 212.5 (250 - 15% = 212.5)
        /// </example>
        public static double ApplyPercentageDecrease(double value, double percentage)
        {
            return value - PercentageOf(percentage, value);
        }

        /// <summary>
        /// Calculates the final price after applying a discount percentage.
        /// This is a convenience method equivalent to ApplyPercentageDecrease.
        /// </summary>
        /// <param name="originalPrice">The original price</param>
        /// <param name="discountPercentage">The discount percentage</param>
        /// <returns>The final price after discount</returns>
        /// <example>
        /// CalculateDiscountedPrice(100, 25) returns 75 (25% off of 100 is 75)
        /// CalculateDiscountedPrice(80, 10) returns 72 (10% off of 80 is 72)
        /// </example>
        public static double CalculateDiscountedPrice(double originalPrice, double discountPercentage)
        {
            return ApplyPercentageDecrease(originalPrice, discountPercentage);
        }

        /// <summary>
        /// Calculates the final price after adding sales tax percentage.
        /// This is a convenience method equivalent to ApplyPercentageIncrease.
        /// </summary>
        /// <param name="basePrice">The base price before tax</param>
        /// <param name="taxPercentage">The tax percentage</param>
        /// <returns>The final price including tax</returns>
        /// <example>
        /// CalculatePriceWithTax(100, 8) returns 108 (100 + 8% tax = 108)
        /// CalculatePriceWithTax(50, 5.5) returns 52.75 (50 + 5.5% tax = 52.75)
        /// </example>
        public static double CalculatePriceWithTax(double basePrice, double taxPercentage)
        {
            return ApplyPercentageIncrease(basePrice, taxPercentage);
        }
    }
}
