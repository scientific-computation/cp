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
    m:     1.0,
    gamma: 0.1,
    x0:    0.0,
    g:     10.0,
    v0:    10.0,
    x0:    0.0,
    y0:    10.0,
    alpha: 0.8
};

/* plotly id */
window.idDivPlotly = 'graph-quantum-mechanics';

/**
 * Calculates the next psi step with numerov method.
 *
 */
window.numerow = function(d_x, x_i_1, x_i, energie) {
    var q_i_1 = energie;
    var q_i   = energie;
    var q_i1  = energie;

    var d_x_square = Math.pow(d_x, 2);

    var value1 = (2 - 5/6 * q_i * d_x_square) * x_i;
    var value2 = (1 + q_i_1 * d_x_square / 12) * x_i_1;
    var value3 = 1 + q_i1 * d_x_square / 12;

//console.log(value1, value2, value3);

    return (value1 - value2) / value3;    
};

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
            range: [-0.5, 1.5]
        },
        yaxis: {
            title: 'V(x)',
            range: [-15, 15]
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
 * Delete trace helper.
 *
 * @version 1.0 (2018-01-30)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.deleteTrace = function(idPlotly, idTrace) {
    if (document.getElementById(idPlotly) === null) {
        return false;
    }

    var data     = document.getElementById(idPlotly).data;
    var deleteId = -1;

    for (var i = 0; i < data.length; i++) {
        if (data[i].id === idTrace) {
            deleteId = i;
        }
    }

    if (deleteId < 0) {
        return false;
    }

    return Plotly.deleteTraces(idPlotly, deleteId);
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
 * Returns an initial config array for a trace.
 *
 * @version 1.0 (2018-01-30)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.getDefaultTraceConfig = function(config, traceWidthAdd, traceOpacityAdd) {
    var defaultTraceOpacity = 1.0;
    var defaultTraceWidth   = 1;

    var config = typeof config === "object" ? config : {};

    window.traceCounter++;

    var defaultTraceConfig = {
        x: [],
        y: [],
        id: 'trace-' + window.traceCounter,
        name: 'Trace ' + window.traceCounter,
        type: 'scatter',
        opacity: defaultTraceOpacity,
        line: {
            width: defaultTraceWidth
        }
    };

    if (traceWidthAdd) {
        defaultTraceConfig.line.width += traceWidthAdd;
    }

    if (traceOpacityAdd) {
        defaultTraceConfig.opacity += traceOpacityAdd;
    }

    var traceConfig = $.extend(true, {}, defaultTraceConfig, config);

    return traceConfig;
};

window.calculateArea = function (d_x, y_i, y_i1) {
    return (y_i + y_i1) / 2 * d_x;
}

window.normalizeTrace = function (trace) {

    var d_x = .01;
    var area = 0;

    for (var i = 1; i < trace.y.length; i++) {
        area += window.calculateArea(d_x, Math.pow(trace.y[i - 1], 2), Math.pow(trace.y[i], 2));
    }

    console.log('A² = ' + area);
    console.log('A = ' + Math.sqrt(area));

    for (var i = 0; i < trace.y.length; i++) {
        trace.y[i] /= Math.sqrt(area);
    }
};

/**
 * The numeric calculator.
 *
 * @version 1.0 (2018-01-30)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.calculate = function(initialSettings, tPrecision) {

    /* initialize the trace container */
    var traces = [];

    /* prepare the needed traces */
    traces.push(window.getDefaultTraceConfig({
        id: 'trace-e1-numeric',
        name: 'E1 (numeric)'
    }, 1));
    traces.push(window.getDefaultTraceConfig({
        id: 'trace-e1-numeric-normalized',
        name: 'E1 Normalized (numeric)'
    }, 1));
    traces.push(window.getDefaultTraceConfig({
        id: 'trace-e1-analytic',
        name: 'E1 (analytic)'
    }));
    traces.push(window.getDefaultTraceConfig({
        id: 'trace-e2-analytic',
        name: 'E2 (analytic)'
    }));
    traces.push(window.getDefaultTraceConfig({
        id: 'trace-e3-analytic',
        name: 'E3 (analytic)'
    }));

    var y_i_1  = 0;
    var y_i    = .2;
    var energy = 9 * Math.pow(Math.PI, 2);
    var d_x    = .01;
    var x      = 0;

    traces[0].x.push(x);
    traces[0].y.push(y_i_1);
    x += d_x;

    traces[0].x.push(x);
    traces[0].y.push(y_i);
    x += d_x;

    var zeroCounter = 0;
    var currentAlgebraicSign = true;

    do {
        var y_i1 = window.numerow(d_x, y_i_1, y_i, energy);

        traces[0].x.push(x);
        traces[0].y.push(y_i1);
        x += d_x;

        var y_i_1 = y_i;
        var y_i   = y_i1;

        if (currentAlgebraicSign) {
            if (y_i < 0) {
                zeroCounter++;
                currentAlgebraicSign = false;
            }
        } else {
            if (y_i > 0) {
                zeroCounter++;
                currentAlgebraicSign = true;
            }
        }
    } while (zeroCounter < 3);

    traces[1].x = traces[0].x.slice();
    traces[1].y = traces[0].y.slice();

    window.normalizeTrace(traces[1]);


    var d_x = 0.01;

    for (var n = 1; n <= 3; n++) {
        var current_x = 0;
        var max_x = 1;
        do {
            traces[n + 1].x.push(current_x);
            traces[n + 1].y.push(Math.sqrt(2) * Math.sin(n * Math.PI * current_x));

            current_x += d_x;        
        } while (current_x < max_x);
    }







    /* refresh the output (delete and redraw) */
    for (var index in traces) {
        var trace = traces[index];

        window.deleteTrace(window.idDivPlotly, trace.id);
        Plotly.addTraces(window.idDivPlotly, trace);
    }
};

