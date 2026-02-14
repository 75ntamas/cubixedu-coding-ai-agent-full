using System;
using System.Collections.Generic;
using System.Linq;

namespace MathLibrary
{
    /// <summary>
    /// Provides statistical methods for analyzing data sets in middle school mathematics.
    /// This class includes calculations for central tendency, range, and basic data analysis.
    /// </summary>
    /// <remarks>
    /// Topics: Statistics, Data Analysis, Mean, Median, Mode, Range, Average
    /// Statistics helps us understand and describe data through numerical summaries.
    /// Key concepts:
    /// - Mean (Average): Sum of all values divided by count
    /// - Median: Middle value when data is ordered
    /// - Mode: Most frequently occurring value
    /// - Range: Difference between maximum and minimum values
    /// </remarks>
    public class StatisticsAndData
    {
        /// <summary>
        /// Calculates the mean (average) of a dataset.
        /// Formula: Mean = Sum of all values / Number of values
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>The mean of the dataset</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// CalculateMean(new double[] {2, 4, 6, 8, 10}) returns 6
        /// CalculateMean(new double[] {5, 10, 15}) returns 10
        /// CalculateMean(new double[] {100, 200, 300}) returns 200
        /// </example>
        public static double CalculateMean(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            double sum = 0;
            foreach (double value in data)
            {
                sum += value;
            }
            return sum / data.Length;
        }

        /// <summary>
        /// Calculates the median (middle value) of a dataset.
        /// The median is the middle value when data is sorted in ascending order.
        /// If there are an even number of values, the median is the average of the two middle values.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>The median of the dataset</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// CalculateMedian(new double[] {3, 1, 4, 2, 5}) returns 3
        /// CalculateMedian(new double[] {10, 20, 30, 40}) returns 25 (average of 20 and 30)
        /// CalculateMedian(new double[] {7}) returns 7
        /// </example>
        public static double CalculateMedian(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            double[] sortedData = (double[])data.Clone();
            Array.Sort(sortedData);

            int length = sortedData.Length;
            if (length % 2 == 0)
            {
                // Even number of elements - average the two middle values
                return (sortedData[length / 2 - 1] + sortedData[length / 2]) / 2.0;
            }
            else
            {
                // Odd number of elements - return the middle value
                return sortedData[length / 2];
            }
        }

        /// <summary>
        /// Finds the mode(s) of a dataset - the value(s) that appear most frequently.
        /// A dataset may have one mode (unimodal), multiple modes (multimodal), or no mode.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>List of mode values (may be empty if all values appear once)</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// CalculateMode(new double[] {1, 2, 2, 3, 4}) returns list containing 2
        /// CalculateMode(new double[] {1, 1, 2, 2, 3}) returns list containing 1 and 2 (bimodal)
        /// CalculateMode(new double[] {5, 5, 5, 6, 7}) returns list containing 5
        /// </example>
        public static List<double> CalculateMode(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            // Count frequency of each value
            Dictionary<double, int> frequency = new Dictionary<double, int>();
            foreach (double value in data)
            {
                if (frequency.ContainsKey(value))
                {
                    frequency[value]++;
                }
                else
                {
                    frequency[value] = 1;
                }
            }

            // Find maximum frequency
            int maxFrequency = frequency.Values.Max();

            // If all values appear only once, there is no mode
            if (maxFrequency == 1)
            {
                return new List<double>();
            }

            // Return all values with maximum frequency
            return frequency.Where(kvp => kvp.Value == maxFrequency)
                           .Select(kvp => kvp.Key)
                           .OrderBy(x => x)
                           .ToList();
        }

        /// <summary>
        /// Calculates the range of a dataset.
        /// Range = Maximum value - Minimum value
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>The range of the dataset</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// CalculateRange(new double[] {2, 5, 8, 12, 3}) returns 10 (12 - 2 = 10)
        /// CalculateRange(new double[] {100, 150, 125}) returns 50 (150 - 100 = 50)
        /// </example>
        public static double CalculateRange(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            return data.Max() - data.Min();
        }

        /// <summary>
        /// Finds the minimum value in a dataset.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>The minimum value</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// FindMinimum(new double[] {5, 2, 9, 1, 7}) returns 1
        /// </example>
        public static double FindMinimum(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            return data.Min();
        }

        /// <summary>
        /// Finds the maximum value in a dataset.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>The maximum value</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// FindMaximum(new double[] {5, 2, 9, 1, 7}) returns 9
        /// </example>
        public static double FindMaximum(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            return data.Max();
        }

        /// <summary>
        /// Calculates the sum of all values in a dataset.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>The sum of all values</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// CalculateSum(new double[] {1, 2, 3, 4, 5}) returns 15
        /// CalculateSum(new double[] {10, 20, 30}) returns 60
        /// </example>
        public static double CalculateSum(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            return data.Sum();
        }

        /// <summary>
        /// Counts the number of data points in a dataset.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>The count of data points</returns>
        /// <exception cref="ArgumentException">Thrown when data is null</exception>
        /// <example>
        /// CountDataPoints(new double[] {1, 2, 3, 4, 5}) returns 5
        /// </example>
        public static int CountDataPoints(double[] data)
        {
            if (data == null)
            {
                throw new ArgumentException("Data cannot be null");
            }

            return data.Length;
        }

        /// <summary>
        /// Sorts a dataset in ascending order.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>New array with values sorted in ascending order</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// SortAscending(new double[] {5, 2, 8, 1, 9}) returns {1, 2, 5, 8, 9}
        /// </example>
        public static double[] SortAscending(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            double[] sorted = (double[])data.Clone();
            Array.Sort(sorted);
            return sorted;
        }

        /// <summary>
        /// Sorts a dataset in descending order.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>New array with values sorted in descending order</returns>
        /// <exception cref="ArgumentException">Thrown when data is null or empty</exception>
        /// <example>
        /// SortDescending(new double[] {5, 2, 8, 1, 9}) returns {9, 8, 5, 2, 1}
        /// </example>
        public static double[] SortDescending(double[] data)
        {
            if (data == null || data.Length == 0)
            {
                throw new ArgumentException("Data cannot be null or empty");
            }

            double[] sorted = (double[])data.Clone();
            Array.Sort(sorted);
            Array.Reverse(sorted);
            return sorted;
        }

        /// <summary>
        /// Calculates a complete statistical summary of a dataset.
        /// </summary>
        /// <param name="data">Array of numerical values</param>
        /// <returns>Tuple containing (mean, median, range, min, max, count)</returns>
        /// <example>
        /// GetStatisticalSummary(new double[] {2, 4, 6, 8, 10}) 
        /// returns (mean: 6, median: 6, range: 8, min: 2, max: 10, count: 5)
        /// </example>
        public static (double mean, double median, double range, double min, double max, int count) 
            GetStatisticalSummary(double[] data)
        {
            return (
                mean: CalculateMean(data),
                median: CalculateMedian(data),
                range: CalculateRange(data),
                min: FindMinimum(data),
                max: FindMaximum(data),
                count: CountDataPoints(data)
            );
        }
    }
}
