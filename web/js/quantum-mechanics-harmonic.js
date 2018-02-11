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
    y_i: .3,

    /* Δx: step width */
    d_x: .01,

    /* x: start point x */
    x: -8,

    /* x_max: max. x */
    x_max: 8,

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
    energyLevel: 1,

    /* V(x): potential function */
    V: function (x) {
        return 0 * x;
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

    /* the analytic energy eigenvalue function */
    analyticEnergyFunction: function (n) {
        return (Math.pow(n, 2) * Math.pow(Math.PI, 2) * Math.pow(window.initialSettings.constants.h_reduced, 2)) /
            (2 * window.initialSettings.m * Math.pow(window.initialSettings.L, 2));
    }
};

/* recalculate some initial settings */
window.initialSettings.constants   = window.constants;
window.initialSettings.energyStart = window.numericalAnalysis.calculateEnergy(window.initialSettings.energyLevel, window.initialSettings);
window.initialSettings.omega       = Math.sqrt(window.initialSettings.k / window.initialSettings.m);

/* plotly id */
window.idDivPlotly = 'graph-quantum-mechanics';

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
            range: [-0.5, 1 / window.initialSettings.energyScale]
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
    // traces['trace-e1-numeric'] = window.helper.getDefaultTraceConfig({
    //     id: 'trace-e1-numeric',
    //     name: String('E%s (numeric)').replace(/%s/g, window.initialSettings.energyLevel)
    // }, 1);
    // traces['trace-e1-numeric-normalized'] = window.helper.getDefaultTraceConfig({
    //     id: 'trace-e1-numeric-normalized',
    //     name: String('E%s Normalized (numeric)').replace(/%s/g, window.initialSettings.energyLevel)
    // }, 1);
    traces['trace-e1-analytic'] = window.helper.getDefaultTraceConfig({
        id: 'trace-e1-analytic',
        name: 'E1 (analytic)'
    });
    traces['trace-e2-analytic'] = window.helper.getDefaultTraceConfig({
        id: 'trace-e2-analytic',
        name: 'E2 (analytic)'
    });
    traces['trace-e3-analytic'] = window.helper.getDefaultTraceConfig({
        id: 'trace-e3-analytic',
        name: 'E3 (analytic)'
    });
    // traces['trace-e4-analytic'] = window.helper.getDefaultTraceConfig({
    //     id: 'trace-e4-analytic',
    //     name: 'E4 (analytic)'
    // });
    // traces['trace-e5-analytic'] = window.helper.getDefaultTraceConfig({
    //     id: 'trace-e5-analytic',
    //     name: 'E5 (analytic)'
    // });

    // /* Calculates the schrödinger equation with numerov algorithm */
    // var traceNumericRaw = traces['trace-e1-numeric'];
    // window.numericalAnalysis.numerovHelper(traceNumericRaw, initialSettings);
    //
    // /* copy trace 0 to trace 1 and normalize it to A = 1 */
    // traces['trace-e1-numeric-normalized'].x = traceNumericRaw.x.slice();
    // traces['trace-e1-numeric-normalized'].y = traceNumericRaw.y.slice();
    // window.numericalAnalysis.normalizeTrace(traces['trace-e1-numeric-normalized']);

    /* create some five analytic wave function φ_n(x) = √(2/L)⋅sin(n⋅π⋅x/L) | n = 1 .. 5 */
    for (var n = 0; n <= 2; n++) {
        var traceKey = Object.keys(traces)[n];
        var trace    = traces[traceKey];

        var current_x = window.initialSettings.x;
        var max_x     = window.initialSettings.x_max;
        do {
            var current_y = initialSettings.analyticWaveFunction(current_x, n);

            trace.x.push(current_x);
            trace.y.push(current_y);

            current_x += initialSettings.d_x;
        } while (current_x < max_x);
    }

    /* set energy */
    // for (var n = 0; n <= 0; n++) {
    //     var traceKey = Object.keys(traces)[n];
    //     var trace    = traces[traceKey];
    //
    //     window.numericalAnalysis.moveTraceY(trace, window.numericalAnalysis.calculateEnergy(n, initialSettings) / initialSettings.energyScale);
    // }
    // window.numericalAnalysis.moveTraceY(traces['trace-e1-numeric'], window.numericalAnalysis.calculateEnergy(initialSettings.energyLevel, initialSettings) / initialSettings.energyScale);
    // window.numericalAnalysis.moveTraceY(traces['trace-e1-numeric-normalized'], window.numericalAnalysis.calculateEnergy(initialSettings.energyLevel, initialSettings) / initialSettings.energyScale);

    /* refresh the output (delete and redraw) */
    for (var key in traces) {
        var trace = traces[key];

        window.helper.deleteTrace(window.idDivPlotly, trace.id);
        Plotly.addTraces(window.idDivPlotly, trace);
    }
};

