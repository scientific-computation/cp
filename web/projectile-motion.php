<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Computational Science</title>

        <!-- include the header -->
        <?php include('includes/header.php'); ?>

        <!-- load own js file -->
        <script src="/js/projectile-motion.js"></script>

        <style>
        .MathJax:focus, .mjx-chtml:focus, .MathJax_SVG:focus {
            outline: 0px solid white;
        }
        </style>
    </head>
    <body>
        <div class="content">
            <h1>Projectile motion</h1>
            <p><strong>equation of motions:</strong></p>
            <p>
                <strong>Friction:</strong> \(\vec F_R = - \gamma \cdot | \vec \upsilon | \cdot \vec \upsilon\)<br />
                <strong>x:</strong> \(m \cdot \ddot{x} = {-\gamma \cdot \sqrt{v^2_{x} + v^2_{y}} \cdot v_{x}}\)<br />
                <strong>y:</strong> \(m \cdot \ddot{y} = {-\gamma \cdot \sqrt{v^2_{x} + v^2_{y}} \cdot v_{y} - m \cdot g}\)<br />
                <br />
                <strong>analytic:</strong> \(y(x) = -{g \over 2 \cdot v_0^2 \cdot cos^2(\alpha)} \cdot (x - x_0)^2 + tan(\alpha) \cdot (x - x_0) + y_0\)
            </p>
        </div>
        <div id="graph-oscillator-harmonic-damped" class="graph"></div>
    </body>
</html>
