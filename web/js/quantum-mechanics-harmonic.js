/*
 * Numeric calculation of quantum mechanic motions.
 *
 * @version 1.0 (2018-01-30)
 * @author  Björn Hempel <bjoern@hempel.li>
 */

/* some initial calculation values */
window.tPrecision = 0.01;

window.constants = {
    h_reduced: 6.626070040 / (2 * Math.PI), /* 10⁻³⁴ */
};

/* some initial motion equation values */
window.initialSettings = {
    /* y₋₁: first step */
    y_i_1: 0,

    /* y₀: next step */
    y_i: 0,

    /* Δx: step width */
    d_x: .01,

    /* y: start point y */
    y: 7 * Math.pow(10, -8),

    /* y_max: maximal y */
    y_max: 10000,

    /* x: start point x */
    x: -8,

    /* x_max: maximal x */
    x_max: 8,

    /* inflection_max: the maximal number of inflections within two zero points */
    inflection_max: 2,

    /* m */
    m: Math.pow(window.constants.h_reduced, 2) / 2,

    /* k */
    k: 1 / 2,

    /* omega: ω² = k / m */
    omega: 0,

    /* L: width of potential well */
    L: 1,

    /* E = (n²⋅π²⋅ℏ²)/(2⋅m⋅L) | m = ℏ²/2 ∧ L = 1 ∧ n = 3 */
    energyStart: 0,

    /* energy scale */
    energyScale: 1,

    /* energy level */
    energyLevel: 0,

    /* V(x): potential function */
    V: function (x) {
        return window.initialSettings.k / 2 * Math.pow(x, 2);
    },

    /* the analytic wave function */
    analyticWaveFunction: function (x, n) {
        var part1 = Math.sqrt(1 / (Math.pow(2, n) * math.factorial(n)));
        var part2 = Math.pow(
            (window.initialSettings.m * window.initialSettings.omega) / (Math.PI * window.initialSettings.constants.h_reduced),
            1/4
        );
        var part3 = Math.exp(
            -(window.initialSettings.m * window.initialSettings.omega * Math.pow(x, 2)) / (2 * window.initialSettings.constants.h_reduced)
        );
        var part4 = window.numericalAnalysis.calculateHermitePolynomial(
            n,
            Math.sqrt(window.initialSettings.m * window.initialSettings.omega / window.initialSettings.constants.h_reduced) * x
        );

        return part1 * part2 * part3 * part4;
    },

    /* The analytic energy eigenvalue function (starts from 0). */
    analyticEnergyFunction: function (n) {
        return window.initialSettings.constants.h_reduced * window.initialSettings.omega * (n + 1 / 2);
    }
};

/* recalculate some initial settings */
window.initialSettings.constants   = window.constants;
window.initialSettings.omega       = Math.sqrt(window.initialSettings.k / window.initialSettings.m);

/* plotly id */
window.idDivPlotly = 'graph-quantum-mechanics-harmonic';

/**
 * Main start function.
 *
 * @version 1.0 (2018-01-30)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.main = function() {

    /* layout graph */
    var layout = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'x',
            range: [window.initialSettings.x - 0.1, window.initialSettings.x_max + 0.1]
        },
        yaxis: {
            title: 'V(x) / ' + window.initialSettings.energyScale,
            range: [-0.5, 4 / window.initialSettings.energyScale]
        }
    };

    /* create plotly instance */
    Plotly.newPlot(
        window.idDivPlotly,
        [],
        layout,
        {
            displayModeBar: false,
            scrollZoom: false,
            editable: false,
            staticPlot: true
        }
    );

    window.calculate(window.initialSettings, window.tPrecision);

    document.getElementById('equation-settings').addEventListener(
        'submit',
        function (evt) {
            window.initialiseSettings();
            window.calculate(window.initialSettings, window.tPrecision);

    	    evt.preventDefault();
        }
    );
};

/**
 * Initialise the initialSettings.
 *
 * @version 1.0 (2018-01-30)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.initialiseSettings = function() {
    window.tPrecision = parseFloat($('#settings-delta-t').find(':selected').val());

    window.initialSettings = {
        m:     parseFloat($('#settings-m').find(':selected').val()),
        gamma: parseFloat($('#settings-gamma').find(':selected').val()),
        x0:    parseFloat($('#settings-x0').find(':selected').val()),
        g:     10.0,
        v0:    parseFloat($('#settings-v0').find(':selected').val()),
        x0:    parseFloat($('#settings-x0').find(':selected').val()),
        y0:    parseFloat($('#settings-y0').find(':selected').val()),
        alpha: Math.round(Math.PI / 2 / 90 * parseFloat($('#settings-alpha').find(':selected').val()) * 10) / 10
    };
};

/* trace counter */
window.traceCounter = 0;

/**
 * The numeric calculator.
 *
 * @version 1.0 (2018-01-30)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.calculate = function(initialSettings, tPrecision) {

    /* initialize the trace container */
    var traces = {};

    /* prepare the needed traces */
    traces['potential'] = window.helper.getDefaultTraceConfig({
        id: 'potential',
        name: 'Potential V(x) = k/2⋅x²'
    }, 4);
    for (var n = 0; n <= 2; n++) {
        traces['trace-e' + n + '-analytic'] = window.helper.getDefaultTraceConfig({
            id: 'trace-e' + n + '-analytic',
            name: 'E' + window.helper.getUnderscoreNumber(n) + ' (analytic)'
        }, 2);
    }
    for (var n = 0; n <= 2; n++) {
        traces['trace-e' + n + '-numeric'] = window.helper.getDefaultTraceConfig({
            id: 'trace-e' + n + '-numeric',
            name: String('E' + window.helper.getUnderscoreNumber(n) + ' (numeric)')
        });
        traces['trace-e' + n + '-numeric-normalized'] = window.helper.getDefaultTraceConfig({
            id: 'trace-e' + n+ '-numeric-normalized',
            name: String('E' + window.helper.getUnderscoreNumber(n) + ' Normalized (numeric)')
        });
    }

    /* Calculates the first three schrödinger equations with numerov algorithm and normalize it */
    for (var n = 0; n <= 2; n++) {
        console.log('start energy level ' + n);

        var traceNumericRaw = traces['trace-e' + n + '-numeric'];

        /* solve the schrödinger equation */
        traceNumericRaw.up          = n % 2 === 0 ? true : false;
        traceNumericRaw.slope       = traceNumericRaw.up ? 'up' : 'down';
        initialSettings.energyLevel = n;
        traceNumericRaw.energyLevel = initialSettings.energyLevel;
        if (n === 0) {
            var result = {
                'E_guess': .2,
                'percent': 100
            };
        } else {
            var result = {
                'E_guess': window.numericalAnalysis.calculateEnergy(n, initialSettings),
                'percent': 100
            };
        }

        /* calculate the energy level */
        for (var i = 0; i < 1; i++) {
            if (result.percent > 0.5) {
                initialSettings.energyStart = result['E_guess'];
                traceNumericRaw.energyStart = initialSettings.energyStart;

                initialSettings.y_i_1 = initialSettings.y * Math.pow(-1, n);
                initialSettings.y_i = window.numericalAnalysis.guessNextY(initialSettings.x, initialSettings.y_i_1, initialSettings);

                traceNumericRaw.x = [];
                traceNumericRaw.y = [];

                var result = window.numericalAnalysis.numerovHelper(traceNumericRaw, initialSettings);

                console.log('result', result);
            }
        }

        /* normalize it */
        traces['trace-e' + n + '-numeric-normalized'].x = traceNumericRaw.x.slice();
        traces['trace-e' + n + '-numeric-normalized'].y = traceNumericRaw.y.slice();
        window.numericalAnalysis.normalizeTrace(traces['trace-e' + n + '-numeric-normalized']);

        /* set energy level: correct y value according the energy level (analytic and numeric solutions) */
        window.numericalAnalysis.moveTraceY(
            traces['trace-e' + n + '-numeric'],
            traces['trace-e' + n + '-numeric'].energyStart / initialSettings.energyScale
        );
        window.numericalAnalysis.moveTraceY(
            traces['trace-e' + n + '-numeric-normalized'],
            traces['trace-e' + n + '-numeric'].energyStart / initialSettings.energyScale
        );
    }

    /* add the potential plot */
    var traceKey = Object.keys(traces)[0];
    var trace    = traces[traceKey];
    var current_x = initialSettings.x;
    var max_x     = initialSettings.x_max;
    do {
        var current_y = initialSettings.V(current_x);

        trace.x.push(current_x);
        trace.y.push(current_y);

        current_x += initialSettings.d_x;
    } while (current_x < max_x);

    /* create the first three analytic wave functions */
    for (var n = 0; n <= 2; n++) {
        var traceKey = Object.keys(traces)[n + 1];
        var trace    = traces[traceKey];

        var current_x = initialSettings.x;
        var max_x     = initialSettings.x_max;
        do {
            var current_y = initialSettings.analyticWaveFunction(current_x, n);

            trace.x.push(current_x);
            trace.y.push(current_y);

            current_x += initialSettings.d_x;
        } while (current_x < max_x);

        /* set energy level: correct y value according the energy level (analytic and numeric solutions) */
        window.numericalAnalysis.moveTraceY(trace, window.numericalAnalysis.calculateEnergy(n, initialSettings) / initialSettings.energyScale);
    }

    /* refresh the output (delete and redraw) */
    for (var key in traces) {
        var trace = traces[key];

        window.helper.deleteTrace(window.idDivPlotly, trace.id);
        Plotly.addTraces(window.idDivPlotly, trace);
    }
};

