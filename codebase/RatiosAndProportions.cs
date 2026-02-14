using System;

namespace MathLibrary
{
    /// <summary>
    /// Provides methods for working with ratios, proportions, and rate calculations in middle school mathematics.
    /// This class handles ratio comparisons, proportion solving, and real-world rate problems.
    /// </summary>
    /// <remarks>
    /// Topics: Ratios, Proportions, Rates, Unit Rates, Scale Factors, Similar Figures
    /// Key concepts:
    /// - Ratio: A comparison of two quantities (e.g., 3:4 or 3/4)
    /// - Proportion: An equation stating that two ratios are equal (e.g., a/b = c/d)
    /// - Rate: A ratio comparing quantities with different units (e.g., 60 miles per hour)
    /// - Unit Rate: A rate with a denominator of 1 (e.g., $5 per item)
    /// - Cross multiplication: Method to solve proportions: if a/b = c/d, then a×d = b×c
    /// </remarks>
    public class RatiosAndProportions
    {
        /// <summary>
        /// Simplifies a ratio to its lowest terms using GCD.
        /// </summary>
        /// <param name="a">First term of the ratio</param>
        /// <param name="b">Second term of the ratio</param>
        /// <returns>Tuple containing the simplified ratio (a, b)</returns>
        /// <example>
        /// SimplifyRatio(6, 9) returns (2, 3) - ratio 6:9 simplifies to 2:3
        /// SimplifyRatio(10, 15) returns (2, 3) - ratio 10:15 simplifies to 2:3
        /// SimplifyRatio(8, 12) returns (2, 3) - ratio 8:12 simplifies to 2:3
        /// </example>
        public static (int simplifiedA, int simplifiedB) SimplifyRatio(int a, int b)
        {
            if (b == 0)
            {
                throw new ArgumentException("Second term of ratio cannot be zero");
            }

            int gcd = FractionOperations.GCD(a, b);
            return (a / gcd, b / gcd);
        }

        /// <summary>
        /// Converts a ratio to decimal form.
        /// </summary>
        /// <param name="a">First term of the ratio</param>
        /// <param name="b">Second term of the ratio</param>
        /// <returns>The decimal representation of the ratio a:b</returns>
        /// <example>
        /// RatioToDecimal(3, 4) returns 0.75
        /// RatioToDecimal(1, 2) returns 0.5
        /// RatioToDecimal(5, 8) returns 0.625
        /// </example>
        public static double RatioToDecimal(int a, int b)
        {
            if (b == 0)
            {
                throw new ArgumentException("Second term of ratio cannot be zero");
            }
            return (double)a / b;
        }

        /// <summary>
        /// Determines if two ratios are equivalent (form a proportion).
        /// Two ratios a:b and c:d are equivalent if a/b = c/d or a×d = b×c.
        /// </summary>
        /// <param name="a">First term of first ratio</param>
        /// <param name="b">Second term of first ratio</param>
        /// <param name="c">First term of second ratio</param>
        /// <param name="d">Second term of second ratio</param>
        /// <returns>True if the ratios are equivalent, false otherwise</returns>
        /// <example>
        /// AreRatiosEquivalent(2, 3, 4, 6) returns true (2:3 = 4:6)
        /// AreRatiosEquivalent(3, 4, 6, 8) returns true (3:4 = 6:8)
        /// AreRatiosEquivalent(2, 5, 3, 7) returns false (2:5 ≠ 3:7)
        /// </example>
        public static bool AreRatiosEquivalent(double a, double b, double c, double d)
        {
            if (b == 0 || d == 0)
            {
                throw new ArgumentException("Ratio terms cannot have zero in denominator");
            }
            // Cross multiply: a/b = c/d if a*d = b*c
            return Math.Abs(a * d - b * c) < 0.0001;
        }

        /// <summary>
        /// Solves a proportion for the missing value x.
        /// Given a/b = c/x, solves for x using cross multiplication.
        /// Formula: x = (b × c) / a
        /// </summary>
        /// <param name="a">First term of first ratio</param>
        /// <param name="b">Second term of first ratio</param>
        /// <param name="c">First term of second ratio (known)</param>
        /// <returns>The missing value x that makes the proportion true</returns>
        /// <example>
        /// SolveProportionForX(2, 3, 8) returns 12 (2/3 = 8/x, so x = 12)
        /// SolveProportionForX(5, 10, 3) returns 6 (5/10 = 3/x, so x = 6)
        /// </example>
        public static double SolveProportionForX(double a, double b, double c)
        {
            if (a == 0)
            {
                throw new ArgumentException("First term of first ratio cannot be zero");
            }
            // a/b = c/x -> x = (b * c) / a
            return (b * c) / a;
        }

        /// <summary>
        /// Solves a proportion of the form a/b = x/d for the missing value x.
        /// Formula: x = (a × d) / b
        /// </summary>
        /// <param name="a">First term of first ratio (known)</param>
        /// <param name="b">Second term of first ratio</param>
        /// <param name="d">Second term of second ratio</param>
        /// <returns>The missing value x</returns>
        /// <example>
        /// SolveProportionAltForm(3, 4, 12) returns 9 (3/4 = x/12, so x = 9)
        /// SolveProportionAltForm(2, 5, 15) returns 6 (2/5 = x/15, so x = 6)
        /// </example>
        public static double SolveProportionAltForm(double a, double b, double d)
        {
            if (b == 0)
            {
                throw new ArgumentException("Second term of first ratio cannot be zero");
            }
            // a/b = x/d -> x = (a * d) / b
            return (a * d) / b;
        }

        /// <summary>
        /// Calculates a unit rate (rate per one unit).
        /// </summary>
        /// <param name="quantity">The total quantity</param>
        /// <param name="units">The number of units</param>
        /// <returns>The unit rate (quantity per 1 unit)</returns>
        /// <example>
        /// CalculateUnitRate(120, 3) returns 40 (120 miles in 3 hours = 40 miles per hour)
        /// CalculateUnitRate(15, 3) returns 5 (15 dollars for 3 items = 5 dollars per item)
        /// CalculateUnitRate(300, 6) returns 50 (300 calories in 6 servings = 50 calories per serving)
        /// </example>
        public static double CalculateUnitRate(double quantity, double units)
        {
            if (units == 0)
            {
                throw new ArgumentException("Number of units cannot be zero");
            }
            return quantity / units;
        }

        /// <summary>
        /// Calculates the better unit price between two options.
        /// </summary>
        /// <param name="price1">Price of first option</param>
        /// <param name="quantity1">Quantity of first option</param>
        /// <param name="price2">Price of second option</param>
        /// <param name="quantity2">Quantity of second option</param>
        /// <returns>1 if option 1 is better, 2 if option 2 is better</returns>
        /// <example>
        /// CompareBetterBuy(10, 5, 18, 10) returns 2 (option 1: $2/unit, option 2: $1.8/unit)
        /// CompareBetterBuy(6, 3, 15, 6) returns 1 (option 1: $2/unit, option 2: $2.5/unit)
        /// </example>
        public static int CompareBetterBuy(double price1, double quantity1, double price2, double quantity2)
        {
            double unitPrice1 = CalculateUnitRate(price1, quantity1);
            double unitPrice2 = CalculateUnitRate(price2, quantity2);
            return unitPrice1 < unitPrice2 ? 1 : 2;
        }

        /// <summary>
        /// Calculates distance using the rate formula: Distance = Rate × Time.
        /// </summary>
        /// <param name="rate">The speed or rate (e.g., miles per hour)</param>
        /// <param name="time">The time duration</param>
        /// <returns>The distance traveled</returns>
        /// <example>
        /// CalculateDistance(60, 3) returns 180 (60 mph for 3 hours = 180 miles)
        /// CalculateDistance(50, 2.5) returns 125 (50 mph for 2.5 hours = 125 miles)
        /// </example>
        public static double CalculateDistance(double rate, double time)
        {
            if (rate < 0 || time < 0)
            {
                throw new ArgumentException("Rate and time must be non-negative");
            }
            return rate * time;
        }

        /// <summary>
        /// Calculates rate (speed) using the formula: Rate = Distance / Time.
        /// </summary>
        /// <param name="distance">The distance traveled</param>
        /// <param name="time">The time duration</param>
        /// <returns>The rate or speed</returns>
        /// <example>
        /// CalculateRate(180, 3) returns 60 (180 miles in 3 hours = 60 mph)
        /// CalculateRate(100, 2) returns 50 (100 miles in 2 hours = 50 mph)
        /// </example>
        public static double CalculateRate(double distance, double time)
        {
            if (time == 0)
            {
                throw new ArgumentException("Time cannot be zero");
            }
            if (distance < 0 || time < 0)
            {
                throw new ArgumentException("Distance and time must be non-negative");
            }
            return distance / time;
        }

        /// <summary>
        /// Calculates time using the formula: Time = Distance / Rate.
        /// </summary>
        /// <param name="distance">The distance to travel</param>
        /// <param name="rate">The speed or rate</param>
        /// <returns>The time required</returns>
        /// <example>
        /// CalculateTime(180, 60) returns 3 (180 miles at 60 mph takes 3 hours)
        /// CalculateTime(250, 50) returns 5 (250 miles at 50 mph takes 5 hours)
        /// </example>
        public static double CalculateTime(double distance, double rate)
        {
            if (rate == 0)
            {
                throw new ArgumentException("Rate cannot be zero");
            }
            if (distance < 0 || rate < 0)
            {
                throw new ArgumentException("Distance and rate must be non-negative");
            }
            return distance / rate;
        }

        /// <summary>
        /// Scales a quantity using a scale factor.
        /// Used in similar figures and map scales.
        /// </summary>
        /// <param name="originalValue">The original value</param>
        /// <param name="scaleFactor">The factor to scale by</param>
        /// <returns>The scaled value</returns>
        /// <example>
        /// ApplyScaleFactor(10, 3) returns 30 (scale up by factor of 3)
        /// ApplyScaleFactor(20, 0.5) returns 10 (scale down by factor of 0.5)
        /// ApplyScaleFactor(5, 2.5) returns 12.5 (scale up by factor of 2.5)
        /// </example>
        public static double ApplyScaleFactor(double originalValue, double scaleFactor)
        {
            if (scaleFactor < 0)
            {
                throw new ArgumentException("Scale factor cannot be negative");
            }
            return originalValue * scaleFactor;
        }

        /// <summary>
        /// Finds the scale factor between two similar figures.
        /// Scale Factor = New Dimension / Original Dimension
        /// </summary>
        /// <param name="originalDimension">A dimension from the original figure</param>
        /// <param name="newDimension">The corresponding dimension from the new figure</param>
        /// <returns>The scale factor</returns>
        /// <example>
        /// FindScaleFactor(5, 15) returns 3 (the figure is scaled up by factor of 3)
        /// FindScaleFactor(10, 5) returns 0.5 (the figure is scaled down by factor of 0.5)
        /// </example>
        public static double FindScaleFactor(double originalDimension, double newDimension)
        {
            if (originalDimension == 0)
            {
                throw new ArgumentException("Original dimension cannot be zero");
            }
            return newDimension / originalDimension;
        }

        /// <summary>
        /// Divides a total into parts based on a given ratio.
        /// </summary>
        /// <param name="total">The total amount to divide</param>
        /// <param name="ratioPart1">First part of the ratio</param>
        /// <param name="ratioPart2">Second part of the ratio</param>
        /// <returns>Tuple containing the two parts</returns>
        /// <example>
        /// DivideByRatio(100, 2, 3) returns (40, 60) - divide 100 in ratio 2:3
        /// DivideByRatio(50, 1, 4) returns (10, 40) - divide 50 in ratio 1:4
        /// DivideByRatio(120, 3, 5) returns (45, 75) - divide 120 in ratio 3:5
        /// </example>
        public static (double part1, double part2) DivideByRatio(double total, int ratioPart1, int ratioPart2)
        {
            if (ratioPart1 <= 0 || ratioPart2 <= 0)
            {
                throw new ArgumentException("Ratio parts must be positive");
            }

            int totalParts = ratioPart1 + ratioPart2;
            double part1 = (total * ratioPart1) / totalParts;
            double part2 = (total * ratioPart2) / totalParts;
            
            return (part1, part2);
        }

        /// <summary>
        /// Converts a map distance to actual distance using a scale.
        /// </summary>
        /// <param name="mapDistance">Distance on the map</param>
        /// <param name="mapScale">Map scale (e.g., 1 inch represents x miles)</param>
        /// <returns>The actual distance</returns>
        /// <example>
        /// MapToActualDistance(3, 50) returns 150 (3 inches on map at scale 1:50 = 150 units)
        /// MapToActualDistance(2.5, 100) returns 250 (2.5 inches at scale 1:100 = 250 units)
        /// </example>
        public static double MapToActualDistance(double mapDistance, double mapScale)
        {
            if (mapScale <= 0)
            {
                throw new ArgumentException("Map scale must be positive");
            }
            return mapDistance * mapScale;
        }

        /// <summary>
        /// Converts an actual distance to map distance using a scale.
        /// </summary>
        /// <param name="actualDistance">The actual distance</param>
        /// <param name="mapScale">Map scale (e.g., 1 inch represents x miles)</param>
        /// <returns>The distance on the map</returns>
        /// <example>
        /// ActualToMapDistance(150, 50) returns 3 (150 units at scale 1:50 = 3 inches on map)
        /// ActualToMapDistance(250, 100) returns 2.5 (250 units at scale 1:100 = 2.5 inches)
        /// </example>
        public static double ActualToMapDistance(double actualDistance, double mapScale)
        {
            if (mapScale == 0)
            {
                throw new ArgumentException("Map scale cannot be zero");
            }
            return actualDistance / mapScale;
        }
    }
}
