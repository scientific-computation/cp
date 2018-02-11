window.numericalAnalysis = {
    /**
     * Calculates the next psi step with numerov method.
     *
     *
     */
    numerov: function(coordinates, initialSettings) {
        var q_i_1 = initialSettings.energy;
        var q_i   = initialSettings.energy;
        var q_i1  = initialSettings.energy;

        var d_x_square = Math.pow(initialSettings.d_x, 2);

        var value1 = (2 - 5/6 * q_i * d_x_square) * coordinates.y_i;
        var value2 = (1 + q_i_1 * d_x_square / 12) * coordinates.y_i_1;
        var value3 = 1 + q_i1 * d_x_square / 12;

        return (value1 - value2) / value3;
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
    }
};
