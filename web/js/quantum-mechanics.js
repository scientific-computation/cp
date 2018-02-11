/*
 * Numeric calculation of quantum mechanic motions.
 *
 * @version 1.0 (2018-01-30)
 * @author  Björn Hempel <bjoern@hempel.li>
 */

/* some initial calculation values */
window.tPrecision = 0.01;

/* some initial motion equation values */
window.initialSettings = {
    /* y₋₁: first step */
    y_i_1: 0,

    /* y₀: next step */
    y_i: .3,

    /* Δx: step width */
    d_x: .01,

    /* x: start point x */
    x: 0,

    /* x_max: max. x */
    x_max: 1,

    /* E = (n²⋅π²⋅ℏ²)/(2⋅m⋅L) | m = ℏ²/2 ∧ L = 1 ∧ n = 3 */
    energy:  window.numericalAnalysis.calculateEnergy(3)
};

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
            range: [-0.1, 1.1]
        },
        yaxis: {
            title: 'V(x) / 4',
            range: [-5, 70]
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
    traces['trace-e1-numeric'] = window.helper.getDefaultTraceConfig({
        id: 'trace-e1-numeric',
        name: 'E3 (numeric)'
    }, 1);
    traces['trace-e1-numeric-normalized'] = window.helper.getDefaultTraceConfig({
        id: 'trace-e1-numeric-normalized',
        name: 'E3 Normalized (numeric)'
    }, 1);
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
    traces['trace-e4-analytic'] = window.helper.getDefaultTraceConfig({
        id: 'trace-e4-analytic',
        name: 'E4 (analytic)'
    });
    traces['trace-e5-analytic'] = window.helper.getDefaultTraceConfig({
        id: 'trace-e5-analytic',
        name: 'E5 (analytic)'
    });

    /* set x to 0 */
    var coordinates = {
        x: initialSettings.x,
        y_i_1: initialSettings.y_i_1,
        y_i: initialSettings.y_i
    };

    var traceNumericRaw = traces['trace-e1-numeric'];

    traceNumericRaw.x.push(coordinates.x);
    traceNumericRaw.y.push(coordinates.y_i_1);
    coordinates.x += initialSettings.d_x;

    traceNumericRaw.x.push(coordinates.x);
    traceNumericRaw.y.push(coordinates.y_i);
    coordinates.x += initialSettings.d_x;

    var zeroCounter = 0;
    var currentAlgebraicSign = true;

    do {
        var y_i1 = window.numericalAnalysis.numerov(coordinates, initialSettings, initialSettings.d_x, coordinates.y_i_1, coordinates.y_i, initialSettings.energy);

        traceNumericRaw.x.push(coordinates.x);
        traceNumericRaw.y.push(y_i1);
        coordinates.x += initialSettings.d_x;

        coordinates.y_i_1 = coordinates.y_i;
        coordinates.y_i   = y_i1;

        if (currentAlgebraicSign) {
            if (coordinates.y_i < 0) {
                zeroCounter++;
                currentAlgebraicSign = false;
            }
        } else {
            if (coordinates.y_i > 0) {
                zeroCounter++;
                currentAlgebraicSign = true;
            }
        }
    } while (zeroCounter < 3);

    /* copy trace 0 to trace 1 and normalize it to A = 1 */
    traces['trace-e1-numeric-normalized'].x = traceNumericRaw.x.slice();
    traces['trace-e1-numeric-normalized'].y = traceNumericRaw.y.slice();
    window.numericalAnalysis.normalizeTrace(traces['trace-e1-numeric-normalized']);

    /* create some five analytic wave function φ_n(x) = √(2/L)⋅sin(n⋅π⋅x/L) | n = 1 .. 5 */
    for (var n = 1; n <= 5; n++) {
        var traceKey = Object.keys(traces)[n + 1];
        var trace    = traces[traceKey];

        var current_x = 0;
        var max_x     = 1;
        do {
            trace.x.push(current_x);
            trace.y.push(Math.sqrt(2) * Math.sin(n * Math.PI * current_x));

            current_x += initialSettings.d_x;
        } while (current_x < max_x);
    }

    /* set energy */
    for (var n = 1; n <= 5; n++) {
        var traceKey = Object.keys(traces)[n + 1];
        var trace    = traces[traceKey];

        window.numericalAnalysis.moveTraceY(trace, window.numericalAnalysis.calculateEnergy(n) / 4);
    }
    window.numericalAnalysis.moveTraceY(traces['trace-e1-numeric'], window.numericalAnalysis.calculateEnergy(3) / 4);
    window.numericalAnalysis.moveTraceY(traces['trace-e1-numeric-normalized'], window.numericalAnalysis.calculateEnergy(3) / 4);

    /* refresh the output (delete and redraw) */
    for (var key in traces) {
        var trace = traces[key];

        window.helper.deleteTrace(window.idDivPlotly, trace.id);
        Plotly.addTraces(window.idDivPlotly, trace);
    }
};

