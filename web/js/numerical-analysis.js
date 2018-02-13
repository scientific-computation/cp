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

        /* create coordinates object */
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
        var stationaryCounter = 0;
        var inflectionCounter = 0;
        do {
            /* calculate y₊₁ */
            var y_i1 = window.numericalAnalysis.numerov(coordinates, initialSettings);



            /* checks if the current point is a zero point (differs in sign) */
            if (window.numericalAnalysis.algebraicSignHasChanged(coordinates.y_i, y_i1)) {
                zeroCounter++;
                stationaryCounter = 0;
                inflectionCounter = 0;
                console.log('zero point found.', coordinates.x_i_1 + '/' + coordinates.y_i_1, coordinates.x_i + '/' + coordinates.y_i, coordinates.x_i1 + '/' + y_i1);
            }

            /* checks if the current point is a stationary point */
            if (window.numericalAnalysis.isStationaryPoint(trace, coordinates.y_i, y_i1)) {
                stationaryCounter++;
                console.log('stationary point found (' + (trace.slope === 'up' ? 'min' : 'max') + ').', stationaryCounter, coordinates.x_i + '/' + coordinates.y_i);
            }

            /* checks if the current point is an inflection point */
            if (window.numericalAnalysis.isInflectionPoint()) {
                inflectionCounter++;
                console.log('inflection point found.');
            }

            /* max zero points reached */
            if (zeroCounter >= initialSettings.energyLevel) {
                console.log('Max zero points found.');
                break;
            }

            /* maximal number of stationary points between two zero points reached */
            if (stationaryCounter >= initialSettings.stationary_max) {
                console.warn('To much stationary points found!');
                break;
            }

            /* maximal number of inflection points between two zero points reached */
            if (inflectionCounter >= initialSettings.inflection_max) {
                console.warn('To much inflection points found!');
                break;
            }

            /* y to high -> the energy is maybe less than physically allowed */
            if (y_i1 > initialSettings.y_max) {
                console.warn('Y to high!');
                break;
            }

            /* only calculate the wave function between the given bounds */
            if (coordinates.x_i1 > 2 * initialSettings.x_max) {
                console.warn('X to high!');
                break;
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
        } while (true);

        var E_guess = window.initialSettings.energyStart / (8 * 2 / (coordinates.x_i + 8));
        var percent = 100 * Math.abs(1 - (coordinates.x_i + 8) / (8 * 2));

        return {
            'E':          window.initialSettings.energyStart,
            'E_guess':    E_guess,//(E_guess - window.initialSettings.energyStart) * percent / 100 + window.initialSettings.energyStart,
            'x_expected': 8,
            'x_pivot':    coordinates.x_i,
            'percent':    percent
        };
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
    algebraicSignHasChanged: function (y1, y2) {
        var algebraicSign1 = Math.sign(y1);
        var algebraicSign2 = Math.sign(y2);

        algebraicSign1 = algebraicSign1 === 0 ? 1 : algebraicSign1;
        algebraicSign2 = algebraicSign2 === 0 ? 1 : algebraicSign2;

        return algebraicSign1 !== algebraicSign2;
    },

    /**
     * Detects a stationary point.
     *
     * @param trace
     * @param y1
     * @param y2
     */
    isStationaryPoint: function (trace, y1, y2) {
        if (trace.slope === 'up') {
            if (y1 > y2) {
                trace.slope = 'down';
                return true;
            } else {
                return false;
            }
        }

        if (trace.slope === 'down') {
            if (y1 < y2) {
                trace.slope = 'up';
                return true;
            } else {
                return false;
            }
        }

        return false;
    },

    /**
     * Detects an inflection point.
     *
     * @param p_i_1
     * @param p_i
     * @param p_i1
     */
    isInflectionPoint: function (p_i_1, p_i, p_i1) {


        return false;
    },

    /**
     * Guess the next y value from given energy level.
     *
     * @param initialSettings
     */
    guessNextY: function (x, y, initialSettings) {
        var q = Math.sqrt(
            2 * initialSettings.m / Math.pow(initialSettings.constants.h_reduced, 2)
        ) * Math.sqrt(
            initialSettings.V(x) - initialSettings.energyStart
        );

        var y_next = Math.exp(q * initialSettings.d_x) * y;

        /* add some extra y distance according to the energy level */
        y_next += y_next * Math.pow(initialSettings.energyLevel, 2) / 2;

        return y_next;
    }
};
