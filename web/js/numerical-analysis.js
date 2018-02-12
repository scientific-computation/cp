window.numericalAnalysis = {


    /**
     * Calculates the next psi step with numerov method.
     *
     */
    numerov: function (coordinates, initialSettings) {
        /* use the following energy value to calculate the wave function */
        var E = initialSettings.energyStart;

        /* calculate Q₋₁, Q₀ and Q₊₁ */
        var q_i_1 = this.calculateQ(E, coordinates.x_i_1, initialSettings);
        var q_i = this.calculateQ(E, coordinates.x_i, initialSettings);
        var q_i1 = this.calculateQ(E, coordinates.x_i1, initialSettings);

        var d_x_square = Math.pow(initialSettings.d_x, 2);

        var value1 = (2 - 5 / 6 * q_i * d_x_square) * coordinates.y_i;
        var value2 = (1 + q_i_1 * d_x_square / 12) * coordinates.y_i_1;
        var value3 = 1 + q_i1 * d_x_square / 12;

        return (value1 - value2) / value3;
    },

    /**
     * Solves the schrödinger equation with the numerical numerov algorithm.
     * Save it to given trace.
     *
     * @param initialSettings
     */
    numerovHelper: function (trace, initialSettings) {

        /* build coordinates object */
        var coordinates = {
            x_i_1: initialSettings.x,
            x_i: initialSettings.x + initialSettings.d_x,
            x_i1: initialSettings.x + 2 * initialSettings.d_x,
            y_i_1: initialSettings.y_i_1,
            y_i: initialSettings.y_i
        };

        /* calculate the y₋₁ point */
        trace.x.push(coordinates.x_i_1);
        trace.y.push(coordinates.y_i_1);

        /* calculate the y₀ point */
        trace.x.push(coordinates.x_i);
        trace.y.push(coordinates.y_i);

        /* calculate the y₊₁ points */
        var zeroCounter = -1;
        do {
            /* calculate y₊₁ */
            var y_i1 = window.numericalAnalysis.numerov(coordinates, initialSettings);

            /* Checks if the new value differ in sign and count this issue. */
            if (window.numericalAnalysis.algebraicSignHasChanged(coordinates.y_i, y_i1)) {
                zeroCounter++;
            }

            /* save calculated value to current trace */
            trace.x.push(coordinates.x_i1);
            trace.y.push(y_i1);

            /* set new y₋₁ and y₀ */
            coordinates.y_i_1 = coordinates.y_i;
            coordinates.y_i = y_i1;

            /* set new x₋₁, x₀ and x₊₁ */
            coordinates.x_i_1 = coordinates.x_i;
            coordinates.x_i = coordinates.x_i1;
            coordinates.x_i1 += initialSettings.d_x;
        } while (zeroCounter < initialSettings.energyLevel);

        return trace;
    },

    /**
     * Calculates the hermite polynomial.
     *
     * @param n
     * @param x
     * @returns {number}
     */
    calculateHermitePolynomial: function (n, x) {
        switch (n) {
            case 0:
                return 1;
                break;

            case 1:
                return 2 * x;
                break;

            case 2:
                return 4 * Math.pow(x, 2) - 2;
                break;

            default:
                console.error('unsupported hermite polynomial: ' + n);
                break;
        }
    },

    /**
     * Calculates Q from φ''(x) = -Q(x)⋅φ(x)
     *
     * @param E
     * @param x
     * @param initialSettings
     * @returns {number}
     */
    calculateQ: function (E, x, initialSettings) {
        var V = initialSettings.V;
        return 2 * initialSettings.m / Math.pow(initialSettings.constants.h_reduced, 2) * (E - V(x));
    },

    /**
     * Calculates Q from φ''(x) = -Q(x)⋅φ(x)
     *
     * @param E
     * @param x
     * @param initialSettings
     * @returns {number}
     */
    calculateQ0: function (E, x, initialSettings) {
        var V = initialSettings.V;
        return 2 * initialSettings.m / Math.pow(initialSettings.constants.h_reduced, 2) * (V(x) - E);
    },

    /**
     * Calculates the area of given y1 and y1+1 with given width (dx).
     *
     * @param d_x
     * @param y_i
     * @param y_i1
     * @returns {number}
     */
    calculateArea: function (d_x, y_i, y_i1) {
        return (y_i + y_i1) / 2 * d_x;
    },

    /**
     * Normalize the given trace (1 = ∫|φ|² dx)
     *
     * @param trace
     */
    normalizeTrace: function (trace) {

        var d_x = .01;
        var area = 0;

        for (var i = 1; i < trace.y.length; i++) {
            area += this.calculateArea(d_x, Math.pow(trace.y[i - 1], 2), Math.pow(trace.y[i], 2));
        }

        console.log('A² = ' + area);
        console.log('A = ' + Math.sqrt(area));

        for (var i = 0; i < trace.y.length; i++) {
            trace.y[i] /= Math.sqrt(area);
        }
    },

    /**
     * Moves the given trace around the y axis
     *
     * @param trace
     * @param y
     */
    moveTraceY: function (trace, y) {
        for (var i = 0; i < trace.y.length; i++) {
            trace.y[i] += y;
        }
    },

    /**
     * E = (n²⋅π²⋅ℏ²)/(2⋅m⋅L) | m = ℏ²/2 ∧ L = 1
     */
    calculateEnergy: function (n, initialSettings) {
        return initialSettings.analyticEnergyFunction(n);
    },

    /**
     * Checks if the given numbers differ in sign.
     *
     * @param x1
     * @param x2
     */
    algebraicSignHasChanged: function (x1, x2) {
        var algebraicSign1 = Math.sign(x1);
        var algebraicSign2 = Math.sign(x2);

        algebraicSign1 = algebraicSign1 === 0 ? 1 : algebraicSign1;
        algebraicSign2 = algebraicSign2 === 0 ? 1 : algebraicSign2;

        return algebraicSign1 !== algebraicSign2;
    },

    /**
     * Guess the next y value from given energy level.
     *
     * @param trace
     */
    guessNextY: function (trace) {
        return Math.pow(-1, trace.energyLevel) * Math.pow(10, -8 + trace.energyLevel / 1.3);
    }
};
