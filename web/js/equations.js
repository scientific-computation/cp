window.equations = {
    /**
     * x(t) = x₀·exp(-δ·t)·cos(√(ω₀² - δ²)·t) + (v₀ + x₀·δ)/(√(ω₀² - δ²))·exp(-δ·t)·sin(√(ω₀² - δ²)·t)
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-23)
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
        var x2 = (v0 + x0 * delta) / sqareRootOmegaDelta * Math.exp(-delta * t) * Math.sin(sqareRootOmegaDelta * t);

        /* return the analytic solution */
        return x1 + x2;
    },

    /**
     * This is the euler method version of analyticSpringPendulumDamped.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-23)
     */
    deltaEulerSpringPendulumDamped: function(m, k, gamma, values, deltaT) {
        return {
            v: values.v - deltaT * (gamma / m * values.v + k / m * values.x),
            x: values.x + deltaT * values.v
        };
    },

    /**
     * This is the runge kutta method (2. order) version of analyticSpringPendulumDamped.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-25)
     */
    deltaRungeKuttaSpringPendulumDamped: function(m, k, gamma, values, deltaT) {
        /* m' */
        var si_ = -(gamma / m * values.v + k / m * values.x);
        /* m */
        var si  = values.v;

        var v = values.v + deltaT * si_;
        var x = values.x + deltaT * si;

        var si1_ = -(gamma / m * v + k / m * x);
        var si1  = v;

        return {
            v: values.v + deltaT * .5 * (si_ + si1_),
            x: values.x + deltaT * .5 * (si  + si1)
        };
    }
};
