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
            <h2>equation of motions:</h2>
            <p>
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td><strong>Friction:</strong></td><td>\(\vec F_R = - \gamma \cdot | \vec \upsilon | \cdot \vec \upsilon\)</td>
                    </tr>
                    <tr>
                        <td><strong>x:</strong></td><td>\(m \cdot \ddot{x} = {-\gamma \cdot \sqrt{v^2_{x} + v^2_{y}} \cdot v_{x}}\)</td>
                    </tr>
                    <tr>
                        <td><strong>y:</strong></td><td>\(m \cdot \ddot{y} = {-\gamma \cdot \sqrt{v^2_{x} + v^2_{y}} \cdot v_{y} - m \cdot g}\)</td>
                    </tr>
                    <tr>
                        <td><strong>analytic:</strong></td><td>\(y(x) = -{g \over 2 \cdot v_0^2 \cdot cos^2(\alpha)} \cdot (x - x_0)^2 + tan(\alpha) \cdot (x - x_0) + y_0\)</td>
                    </tr>
                </table>
            </p>

            <p>
                <button type="button" onclick="window.tPrecision = 0.01; window.calculate(window.initialSettings, window.tPrecision);">Δt = 0.01</button>
                <button type="button" onclick="window.tPrecision = 0.2;  window.calculate(window.initialSettings, window.tPrecision);">Δt = 0.2</button>
                <button type="button" onclick="window.tPrecision = 0.5;  window.calculate(window.initialSettings, window.tPrecision);">Δt = 0.5</button>
            </p>

            <p>
                <button type="button" onclick="window.initialSettings.gamma = 0.1; window.calculate(window.initialSettings, window.tPrecision);">γ = 0.1</button>
                <button type="button" onclick="window.initialSettings.gamma = 0.2; window.calculate(window.initialSettings, window.tPrecision);">γ = 0.2</button>
                <button type="button" onclick="window.initialSettings.gamma = 0.5; window.calculate(window.initialSettings, window.tPrecision);">γ = 0.5</button>
            </p>
        </div>
        <div id="graph-oscillator-harmonic-damped" class="graph"></div>
    </body>
</html>
