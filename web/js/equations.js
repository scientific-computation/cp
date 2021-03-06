window.equations = {
    /**
     * x(t) = x₀·exp(-δ·t)·cos(√(ω₀² - δ²)·t) + (v₀ + x₀·δ)/(√(ω₀² - δ²))·exp(-δ·t)·sin(√(ω₀² - δ²)·t)
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-23)
     */
    /* parameter:                                  m, k, γ,     x₀, v₀, t */
    analyticPositionSpringPendulumDamped: function(m, k, gamma, x0, v0, t) {
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
     * v(t) =           -δ·x₀·exp(-δ·t)·cos(√(ω₀² - δ²)·t) +
     *        -√(ω₀² - δ²)·x₀·exp(-δ·t)·sin(√(ω₀² - δ²)·t) +
     *                  -δ·(v₀ + x₀·δ)/(√(ω₀² - δ²))·exp(-δ·t)·sin(√(ω₀² - δ²)·t) +
     *         √(ω₀² - δ²)·(v₀ + x₀·δ)/(√(ω₀² - δ²))·exp(-δ·t)·cos(√(ω₀² - δ²)·t)
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-28)
     */
    /* parameter:                                    m, k, γ,     x₀, v₀, t */
    analyticDerivationSpringPendulumDamped: function(m, k, gamma, x0, v0, t) {
        /*  δ           = γ / (2·m) */
        var delta       = gamma / (2 * m);

        /*  δ²          = δ² */
        var squareDelta = Math.pow(delta, 2);

        /*  ω₀²         = k / m */
        var squareOmega = k / m;

        /* e₁ = √(ω₀² - δ²) */
        var sqareRootOmegaDelta = Math.sqrt(squareOmega - squareDelta);

        /* equation: see doc bloc */
        var v1 = - delta * x0 * Math.exp(-delta * t) * Math.cos(sqareRootOmegaDelta * t) -
                   sqareRootOmegaDelta * x0 * Math.exp(-delta * t) * Math.sin(sqareRootOmegaDelta * t);
        var v2 = - delta * (v0 + x0 * delta) / sqareRootOmegaDelta * Math.exp(-delta * t) * Math.sin(sqareRootOmegaDelta * t) +
                   sqareRootOmegaDelta * (v0 + x0 * delta) / sqareRootOmegaDelta * Math.exp(-delta * t) * Math.cos(sqareRootOmegaDelta * t);

        /* return the analytic solution */
        return v1 + v2;
    },

    /**
     * Calculates the energy from a spring pendulum damped.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-28)
     */
    energySpringPendulumDamped: function(k, m, x, v) {
        return k / 2 * Math.pow(x, 2) + m / 2 * Math.pow(v, 2);
    },

    /**
     * Calculates the gradient of given parameters.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-28) 
     */
    gradientSpringPendulumDamped: function(m, k, gamma, values) {
        return {
            v: - gamma / m * values.v - k / m * values.x,
            x: values.v
        };
    },

    /**
     * This is the euler method version of analyticPositionSpringPendulumDamped.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-23)
     */
    deltaEulerSpringPendulumDamped: function(m, k, gamma, values, deltaT) {
        var gradient = this.gradientSpringPendulumDamped(m, k, gamma, values);

        return {
            v: values.v + deltaT * gradient.v,
            x: values.x + deltaT * gradient.x
        };
    },

    /**
     * This is the runge kutta method (2. order) version of analyticPositionSpringPendulumDamped.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-25)
     */
    deltaRungeKuttaOfSecondOrderSpringPendulumDamped: function(m, k, gamma, values, deltaT) {
        /* calculate the gradient of the first position */
        var gradient = this.gradientSpringPendulumDamped(m, k, gamma, values);

        /* calculate the values of the next position */
        var values2 = {
            v: values.v + deltaT * gradient.v,
            x: values.x + deltaT * gradient.x
        };

        /* calculate the gradient of the second position */
        var gradient2 = this.gradientSpringPendulumDamped(m, k, gamma, values2);

        return {
            v: values.v + deltaT * .5 * (gradient.v + gradient2.v),
            x: values.x + deltaT * .5 * (gradient.x + gradient2.x)
        };
    },

    /**
     * This is the runge kutta method (4. order) version of analyticPositionSpringPendulumDamped.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-25)
     */
    deltaRungeKuttaOfFourthOrderSpringPendulumDamped: function(m, k, gamma, values, deltaT) {
        var k1 = this.gradientSpringPendulumDamped(m, k, gamma, values);

        var valuesK2 = {
            v: values.v + .5 * deltaT * k1.v,
            x: values.x + .5 * deltaT * k1.x
        }
        var k2 = this.gradientSpringPendulumDamped(m, k, gamma, valuesK2);

        var valuesK3 = {
            v: values.v + .5 * deltaT * k2.v,
            x: values.x + .5 * deltaT * k2.x
        }
        var k3 = this.gradientSpringPendulumDamped(m, k, gamma, valuesK3);

        var valuesK4 = {
            v: values.v + deltaT * k3.v,
            x: values.x + deltaT * k3.x
        }
        var k4 = this.gradientSpringPendulumDamped(m, k, gamma, valuesK4);

        return {
            v: values.v + 1 / 6 * deltaT * (k1.v + 2 * k2.v + 2 * k3.v + k4.v),
            x: values.x + 1 / 6 * deltaT * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
        };
    },

    /**
     * Analytic equation projectile motion without friction.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-12-12)
     */
    analyticPosition: function(values, deltaT, initialSettings) {
        if (deltaT > 0) {
            values.x += deltaT;
        }

        values.y = 0;

        values.y += -initialSettings.g / (2 * Math.pow(initialSettings.v0, 2) * Math.pow(Math.cos(initialSettings.alpha), 2)) * Math.pow(values.x - initialSettings.x0, 2);
        values.y += Math.tan(initialSettings.alpha) * (values.x - initialSettings.x0);
        values.y += initialSettings.y0;

        /* return the analytic solution */
        return values;
    },

    /**
     * Calculates the gradient of given parameters.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-12-11)
     */
    gradientProjectileMotionX: function(values, initialSettings) {
        var vx = - initialSettings.gamma / initialSettings.m * Math.sqrt(Math.pow(values.vx, 2) + Math.pow(values.vy, 2)) * values.vx;
        var x  = values.vx;

        /* merge values with the calculations before */
        return $.extend({}, values, {vx: vx, x: x});
    },

    /**
     * Calculates the gradient of given parameters.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-12-11)
     */
    gradientProjectileMotionY: function(values, initialSettings) {
        var vy = - initialSettings.gamma / initialSettings.m * Math.sqrt(Math.pow(values.vx, 2) + Math.pow(values.vy, 2)) * values.vy - initialSettings.g;
        var y  = values.vy;

        /* merge values with the calculations before */
        return $.extend({}, values, {vy: vy, y: y});
    },


    /**
     * Calculates the runge kutta method (4. order) version of analyticProjectileMotion.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-25)
     */
    deltaRungeKuttaOfFourthOrderProjectileMotion: function(values, deltaT, initialSettings) {
        var gradientIndexesX = {gradient: 'vx', position: 'x'};
        var gradientIndexesY = {gradient: 'vy', position: 'y'};

        var valuesX = this.deltaRungeKuttaOfFourthOrder(
            values,
            deltaT,
            initialSettings,
            this.gradientProjectileMotionX,
            gradientIndexesX
        );

        var valuesY = this.deltaRungeKuttaOfFourthOrder(
            values,
            deltaT,
            initialSettings,
            this.gradientProjectileMotionY,
            gradientIndexesY
        );

        values.vx = valuesX.gradient;
        values.x  = valuesX.position;

        values.vy = valuesY.gradient;
        values.y  = valuesY.position;

        return values;
    },

    /**
     * Calculates the runge kutta method (4. order) version of analyticProjectileMotion.
     *
     * @author  Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2017-11-25)
     */
    deltaRungeKuttaOfFourthOrder: function(values, deltaT, initialSettings, gradientFunction, gradientIndexes) {
        var iGradient = gradientIndexes.gradient;
        var iPosition = gradientIndexes.position;

        /* calculate k1 */
        var k1 = gradientFunction(values, initialSettings);

        /* calculate k2 */
        var valuesK2 = $.extend({}, values);
        valuesK2[iGradient] = values[iGradient] + .5 * deltaT * k1[iGradient];
        valuesK2[iPosition] = values[iPosition] + .5 * deltaT * k1[iPosition];
        var k2 = gradientFunction(valuesK2, initialSettings);

        /* calculate k3 */
        var valuesK3 = $.extend({}, values);
        valuesK3[iGradient] = values[iGradient] + .5 * deltaT * k2[iGradient];
        valuesK3[iPosition] = values[iPosition] + .5 * deltaT * k2[iPosition];
        var k3 = gradientFunction(valuesK3, initialSettings);

        /* calculate k4 */
        var valuesK4 = $.extend({}, values);
        valuesK4[iGradient] = values[iGradient] + deltaT * k3[iGradient];
        valuesK4[iPosition] = values[iPosition] + deltaT * k3[iPosition];
        var k4 = gradientFunction(valuesK4, initialSettings);

        /* summarize */
        return {
            gradient: values[iGradient] + 1 / 6 * deltaT * (k1[iGradient] + 2 * k2[iGradient] + 2 * k3[iGradient] + k4[iGradient]),
            position: values[iPosition] + 1 / 6 * deltaT * (k1[iPosition] + 2 * k2[iPosition] + 2 * k3[iPosition] + k4[iPosition])
        };
    }
};
