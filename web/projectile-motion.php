<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Computational Science - projectile motion</title>

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
                <table border="0" cellpadding="0" cellspacing="0" class="equations">
                    <tr>
                        <td><strong>Friction:</strong></td><td>\(\vec F_R = - \gamma \cdot | \vec \upsilon | \cdot \vec \upsilon\)</td>
                    </tr>
                    <tr>
                        <td><strong>Differential equation:</strong></td><td>\(\ddot{x}(t) = {-{\gamma \over m} \cdot \sqrt{v^2_{x}(t) + v^2_{y}(t)} \cdot v_{x}(t)}\)</td>
                    </tr>
                    <tr>
                        <td></td><td>\(\ddot{y}(t) = {-{\gamma \over m} \cdot \sqrt{v^2_{x}(t) + v^2_{y}(t)} \cdot v_{y}(t) - g}\)</td>
                    </tr>
                    <tr>
                        <td><strong>Analytic:</strong></td><td>\(y(x) = -{g \over 2 \cdot v_0^2 \cdot cos^2(\alpha)} \cdot (x - x_0)^2 + tan(\alpha) \cdot (x - x_0) + y_0\)</td>
                    </tr>
                </table>
            </p>

            <p>
                <form id="equation-settings">
                    <table border="0" cellpadding="0" cellspacing="0" class="settings">
                        <tr>
                            <td>\(\Delta t\)</td>
                            <td>=</td>
                            <td>
                                <select id="settings-delta-t" name="delta-t">
                                    <option value="0.01" selected>0.01</option>
                                    <option value="0.2">0.2</option>
                                    <option value="0.5">0.5</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>\(\gamma\)</td>
                            <td>=</td>
                            <td>
                                <select id="settings-gamma" name="gamma">
                                    <option value="0.1" selected>0.1</option>
                                    <option value="0.2">0.2</option>
                                    <option value="0.5">0.5</option>
                                </select>
                            </td>
                            <td>&nbsp;</td>
                            <td>\(\alpha\)</td>
                            <td>=</td>
                            <td>
                                <select id="settings-alpha" name="alpha">
                                    <option value="90">90° (1.6)</option>
                                    <option value="75">75° (1.3)</option>
                                    <option value="60">60° (1.0)</option>
                                    <option value="45" selected>45° (0.8)</option>
                                    <option value="30">30° (0.5)</option>
                                    <option value="15">15° (0.3)</option>
                                    <option value="0">0° (0.0)</option>
                                </select>
                            </td>
                            <td>&nbsp;</td>
                            <td>\(m\)</td>
                            <td>=</td>
                            <td>
                                <select id="settings-m" name="m">
                                    <option value="1.0">1.0</option>
                                    <option value="2.0">2.0</option>
                                    <option value="10.0">10.0</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>\(x_0\)</td>
                            <td>=</td>
                            <td>
                                <select id="settings-x0" name="x0">
                                    <option value="0.0" selected>0.0</option>
                                    <option value="5.0">5.0</option>
                                    <option value="10.0">10.0</option>
                                </select>
                            </td>
                            <td>&nbsp;</td>
                            <td>\(y_0\)</td>
                            <td>=</td>
                            <td>
                                <select id="settings-y0" name="y0">
                                    <option value="0.0">0.0</option>
                                    <option value="5.0">5.0</option>
                                    <option value="10.0" selected>10.0</option>
                                </select>
                            </td>
                            <td>&nbsp;</td>
                            <td>\(v_0\)</td>
                            <td>=</td>
                            <td>
                                <select id="settings-v0" name="v0">
                                    <option value="0.0">0.0</option>
                                    <option value="1.0">1.0</option>
                                    <option value="2.0">2.0</option>
                                    <option value="10.0" selected>10.0</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="10"></td>
                            <td><input type="submit" value="render"></td>
                        </tr>
                    </table>
                </form>
            </p>
        </div>
        <div id="graph-oscillator-harmonic-damped" class="graph"></div>
    </body>
</html>
