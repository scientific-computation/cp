window.numericalAnalysis = {
    /**
     * Calculates the next psi step with numerov method.
     *
     */
    numerov: function(coordinates, initialSettings) {
        var q_i_1 = initialSettings.energyStart;
        var q_i   = initialSettings.energyStart;
        var q_i1  = initialSettings.energyStart;

        var d_x_square = Math.pow(initialSettings.d_x, 2);

        var value1 = (2 - 5/6 * q_i * d_x_square) * coordinates.y_i;
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
            x: initialSettings.x,
            y_i_1: initialSettings.y_i_1,
            y_i: initialSettings.y_i
        };

        trace.x.push(coordinates.x);
        trace.y.push(coordinates.y_i_1);
        coordinates.x += initialSettings.d_x;

        trace.x.push(coordinates.x);
        trace.y.push(coordinates.y_i);
        coordinates.x += initialSettings.d_x;

        var zeroCounter = 0;

        do {
            /* calculate y₊₁ */
            var y_i1 = window.numericalAnalysis.numerov(coordinates, initialSettings);

            /* Checks if the new value differ in sign and count this issue. */
            if (window.numericalAnalysis.algebraicSignHasChanged(coordinates.y_i, y_i1)) {
                zeroCounter++;
            }

            /* save calculated value to current trace */
            trace.x.push(coordinates.x);
            trace.y.push(y_i1);

            /* set new y₋₁ and y₀ */
            coordinates.y_i_1 = coordinates.y_i;
            coordinates.y_i   = y_i1;

            /* set new x */
            coordinates.x += initialSettings.d_x;
        } while (zeroCounter < initialSettings.energyLevel);

        return trace;
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
    calculateEnergy: function (n) {
        return Math.pow(n, 2) * Math.pow(Math.PI, 2);
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
    }
};
