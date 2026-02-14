using System;

namespace MathLibrary
{
    /// <summary>
    /// Provides geometry calculations for common 2D and 3D shapes in middle school mathematics.
    /// This class includes methods for calculating area, perimeter, circumference, volume, and surface area.
    /// </summary>
    /// <remarks>
    /// Topics: Geometry, Area, Perimeter, Volume, Surface Area, Circles, Rectangles, Triangles, Spheres, Cylinders
    /// All measurements should use consistent units (e.g., all in meters or all in centimeters).
    /// Pi is approximated using Math.PI for accuracy.
    /// </remarks>
    public class GeometryShapes
    {
        /// <summary>
        /// Calculates the area of a rectangle.
        /// Formula: Area = length × width
        /// </summary>
        /// <param name="length">The length of the rectangle</param>
        /// <param name="width">The width of the rectangle</param>
        /// <returns>The area of the rectangle</returns>
        /// <example>
        /// RectangleArea(5, 3) returns 15
        /// RectangleArea(7.5, 4) returns 30
        /// </example>
        public static double RectangleArea(double length, double width)
        {
            if (length <= 0 || width <= 0)
            {
                throw new ArgumentException("Length and width must be positive");
            }
            return length * width;
        }

        /// <summary>
        /// Calculates the perimeter of a rectangle.
        /// Formula: Perimeter = 2 × (length + width)
        /// </summary>
        /// <param name="length">The length of the rectangle</param>
        /// <param name="width">The width of the rectangle</param>
        /// <returns>The perimeter of the rectangle</returns>
        /// <example>
        /// RectanglePerimeter(5, 3) returns 16
        /// RectanglePerimeter(10, 4) returns 28
        /// </example>
        public static double RectanglePerimeter(double length, double width)
        {
            if (length <= 0 || width <= 0)
            {
                throw new ArgumentException("Length and width must be positive");
            }
            return 2 * (length + width);
        }

        /// <summary>
        /// Calculates the area of a square.
        /// Formula: Area = side²
        /// </summary>
        /// <param name="side">The length of one side of the square</param>
        /// <returns>The area of the square</returns>
        /// <example>
        /// SquareArea(4) returns 16
        /// SquareArea(6.5) returns 42.25
        /// </example>
        public static double SquareArea(double side)
        {
            if (side <= 0)
            {
                throw new ArgumentException("Side length must be positive");
            }
            return side * side;
        }

        /// <summary>
        /// Calculates the perimeter of a square.
        /// Formula: Perimeter = 4 × side
        /// </summary>
        /// <param name="side">The length of one side of the square</param>
        /// <returns>The perimeter of the square</returns>
        /// <example>
        /// SquarePerimeter(5) returns 20
        /// SquarePerimeter(7) returns 28
        /// </example>
        public static double SquarePerimeter(double side)
        {
            if (side <= 0)
            {
                throw new ArgumentException("Side length must be positive");
            }
            return 4 * side;
        }

        /// <summary>
        /// Calculates the area of a triangle given base and height.
        /// Formula: Area = (base × height) / 2
        /// </summary>
        /// <param name="baseLength">The base of the triangle</param>
        /// <param name="height">The height of the triangle (perpendicular to base)</param>
        /// <returns>The area of the triangle</returns>
        /// <example>
        /// TriangleArea(6, 4) returns 12
        /// TriangleArea(10, 5) returns 25
        /// </example>
        public static double TriangleArea(double baseLength, double height)
        {
            if (baseLength <= 0 || height <= 0)
            {
                throw new ArgumentException("Base and height must be positive");
            }
            return (baseLength * height) / 2;
        }

        /// <summary>
        /// Calculates the perimeter of a triangle.
        /// Formula: Perimeter = side1 + side2 + side3
        /// </summary>
        /// <param name="side1">Length of first side</param>
        /// <param name="side2">Length of second side</param>
        /// <param name="side3">Length of third side</param>
        /// <returns>The perimeter of the triangle</returns>
        /// <example>
        /// TrianglePerimeter(3, 4, 5) returns 12
        /// TrianglePerimeter(6, 8, 10) returns 24
        /// </example>
        public static double TrianglePerimeter(double side1, double side2, double side3)
        {
            if (side1 <= 0 || side2 <= 0 || side3 <= 0)
            {
                throw new ArgumentException("All sides must be positive");
            }
            return side1 + side2 + side3;
        }

        /// <summary>
        /// Calculates the area of a circle.
        /// Formula: Area = π × radius²
        /// </summary>
        /// <param name="radius">The radius of the circle</param>
        /// <returns>The area of the circle</returns>
        /// <example>
        /// CircleArea(5) returns approximately 78.54
        /// CircleArea(3) returns approximately 28.27
        /// </example>
        public static double CircleArea(double radius)
        {
            if (radius <= 0)
            {
                throw new ArgumentException("Radius must be positive");
            }
            return Math.PI * radius * radius;
        }

        /// <summary>
        /// Calculates the circumference of a circle.
        /// Formula: Circumference = 2 × π × radius
        /// </summary>
        /// <param name="radius">The radius of the circle</param>
        /// <returns>The circumference of the circle</returns>
        /// <example>
        /// CircleCircumference(5) returns approximately 31.42
        /// CircleCircumference(10) returns approximately 62.83
        /// </example>
        public static double CircleCircumference(double radius)
        {
            if (radius <= 0)
            {
                throw new ArgumentException("Radius must be positive");
            }
            return 2 * Math.PI * radius;
        }

        /// <summary>
        /// Calculates the volume of a rectangular prism (box).
        /// Formula: Volume = length × width × height
        /// </summary>
        /// <param name="length">The length of the prism</param>
        /// <param name="width">The width of the prism</param>
        /// <param name="height">The height of the prism</param>
        /// <returns>The volume of the rectangular prism</returns>
        /// <example>
        /// RectangularPrismVolume(4, 3, 5) returns 60
        /// RectangularPrismVolume(2.5, 4, 6) returns 60
        /// </example>
        public static double RectangularPrismVolume(double length, double width, double height)
        {
            if (length <= 0 || width <= 0 || height <= 0)
            {
                throw new ArgumentException("All dimensions must be positive");
            }
            return length * width * height;
        }

        /// <summary>
        /// Calculates the volume of a cube.
        /// Formula: Volume = side³
        /// </summary>
        /// <param name="side">The length of one side of the cube</param>
        /// <returns>The volume of the cube</returns>
        /// <example>
        /// CubeVolume(3) returns 27
        /// CubeVolume(5) returns 125
        /// </example>
        public static double CubeVolume(double side)
        {
            if (side <= 0)
            {
                throw new ArgumentException("Side length must be positive");
            }
            return side * side * side;
        }

        /// <summary>
        /// Calculates the volume of a cylinder.
        /// Formula: Volume = π × radius² × height
        /// </summary>
        /// <param name="radius">The radius of the circular base</param>
        /// <param name="height">The height of the cylinder</param>
        /// <returns>The volume of the cylinder</returns>
        /// <example>
        /// CylinderVolume(3, 5) returns approximately 141.37
        /// CylinderVolume(4, 10) returns approximately 502.65
        /// </example>
        public static double CylinderVolume(double radius, double height)
        {
            if (radius <= 0 || height <= 0)
            {
                throw new ArgumentException("Radius and height must be positive");
            }
            return Math.PI * radius * radius * height;
        }

        /// <summary>
        /// Calculates the surface area of a cylinder.
        /// Formula: Surface Area = 2πr² + 2πrh = 2πr(r + h)
        /// </summary>
        /// <param name="radius">The radius of the circular base</param>
        /// <param name="height">The height of the cylinder</param>
        /// <returns>The surface area of the cylinder</returns>
        /// <example>
        /// CylinderSurfaceArea(3, 5) returns approximately 150.80
        /// </example>
        public static double CylinderSurfaceArea(double radius, double height)
        {
            if (radius <= 0 || height <= 0)
            {
                throw new ArgumentException("Radius and height must be positive");
            }
            return 2 * Math.PI * radius * (radius + height);
        }

        /// <summary>
        /// Calculates the volume of a sphere.
        /// Formula: Volume = (4/3) × π × radius³
        /// </summary>
        /// <param name="radius">The radius of the sphere</param>
        /// <returns>The volume of the sphere</returns>
        /// <example>
        /// SphereVolume(3) returns approximately 113.10
        /// SphereVolume(5) returns approximately 523.60
        /// </example>
        public static double SphereVolume(double radius)
        {
            if (radius <= 0)
            {
                throw new ArgumentException("Radius must be positive");
            }
            return (4.0 / 3.0) * Math.PI * radius * radius * radius;
        }

        /// <summary>
        /// Calculates the surface area of a sphere.
        /// Formula: Surface Area = 4 × π × radius²
        /// </summary>
        /// <param name="radius">The radius of the sphere</param>
        /// <returns>The surface area of the sphere</returns>
        /// <example>
        /// SphereSurfaceArea(3) returns approximately 113.10
        /// SphereSurfaceArea(5) returns approximately 314.16
        /// </example>
        public static double SphereSurfaceArea(double radius)
        {
            if (radius <= 0)
            {
                throw new ArgumentException("Radius must be positive");
            }
            return 4 * Math.PI * radius * radius;
        }
    }
}
