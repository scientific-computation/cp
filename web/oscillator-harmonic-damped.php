<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Computational Science - oscillator harmonic damped</title>

        <!-- include the header -->
        <?php include('includes/header.php'); ?>

        <!-- load own js file -->
        <script src="/js/oscillator-harmonic-damped.js"></script>
    </head>
    <body>
        <div class="content">
            <h1>Damped harmonic oscillator</h1>
            <p><strong>equation of motion:</strong> m·ẍ(t) + γ·ẋ(t) + k·x(t) = 0</p>
            <p><strong>representation:</strong> x → t; y → x(t)</p>
        </div>
        <div id="graph-oscillator-harmonic-damped" class="graph"></div>
        <div class="content">
            <h2>Error</h2>
            <p>Error between numeric and analytic calculations.</p>
        </div>
        <div id="graph-oscillator-harmonic-damped-error" class="graph"></div>
        <div class="content">
            <h1>phase space</h1>
            <p><strong>equation of motion:</strong> m·ẍ(t) + γ·ẋ(t) + k·x(t) = 0</p>
            <p><strong>representation:</strong> x → x(t); y → ẋ(t)</p>
        </div>
        <div id="graph-oscillator-harmonic-damped-phase" class="graph"></div>
        <div class="content">
            <h1>energy</h1>
            <p><strong>equation of motion:</strong> m·ẍ(t) + γ·ẋ(t) + k·x(t) = 0</p>
            <p><strong>formula:</strong> E = k/2·x² + m/2·ẋ²</p>
        </div>
        <div id="graph-oscillator-harmonic-damped-energy" class="graph"></div>
        <div class="content">
            <h1>energy without attenuation</h1>
            <p><strong>equation of motion:</strong> m·ẍ(t) + k·x(t) = 0 │ γ = 0</p>
            <p><strong>formula:</strong> E = k/2·x² + m/2·ẋ²</p>
        </div>
        <div id="graph-oscillator-harmonic-damped-energy-without-attenuation" class="graph"></div>
    </body>
</html>
