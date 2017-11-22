window.equations = {
    /**
     * x(t) = x₀·exp(-δ·t)·cos(√(ω₀² - δ²)·t) + (v₀ + x₀·δ)/(√(ω₀² - δ²))·exp(-δ·t)·sin(√(ω₀² - δ²)·t)
     *
     */
    /* parameter:                          m, k, γ,     x₀, v₀, t */
    analyticSpringPendulumDamped: function(m, k, gamma, x0, v0, t) {
        /*  δ           = γ / (2·m) */
        var delta       = gamma / (2 * m);

        /*  δ²          = δ² */
        var squareDelta = Math.pow(delta, 2);

        /*  ω₀²         = k / m */
        var squareOmega = k / m;

        /* e₁ = √(ω₀² - δ²) */
        var sqareRootOmegaDelta = Math.sqrt(squareOmega - squareDelta);

        /* equation: see doc bloc */
        var x1 = x0 * Math.exp(-delta * t) * Math.cos(sqareRootOmegaDelta * t);
        var x2 = (v0 + x0 * delta) / sqareRootOmegaDelta * Math.sin(sqareRootOmegaDelta * t);

        /* return the analytic solution */
        return x1 + x2;
    }
};
