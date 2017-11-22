<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Computational Science</title>

        <!-- include the header -->
        <?php include('includes/header.php'); ?>

        <!-- load own js file -->
        <script src="/js/oscillator-harmonic-damped.js"></script>
    </head>
    <body>
        <div class="content">
            <h1>Damped harmonic oscillator</h1>
            <p><strong>equation of motion:</strong> m·ẍ(t) + γ·ẋ(t) + k·x(t) = 0</p>
        </div>
        <div id="graph-oscillator-harmonic-damped" class="graph"></div>
    </body>
</html>
