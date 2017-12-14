/*
 * Numeric calculation of projectile motions.
 *
 * @version 1.0 (2017-12-12)
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
window.idDivPlotly = 'graph-oscillator-harmonic-damped';

/**
 * Main start function.
 *
 * @version 1.0 (2017-12-12)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.main = function() {
    /* layout graph */
    var layout = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'x(t)',
            range: [-2, 18]
        },
        yaxis: {
            title: 'y(t)',
            range: [-2, 14]
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
            window.initialSettings.gamma = parseFloat($('#settings-gamma').find(':selected').val());
            window.tPrecision = parseFloat($('#settings-delta-t').find(':selected').val());

            window.calculate(window.initialSettings, window.tPrecision);

    	    evt.preventDefault();
        }
    );
};

/**
 * Delete trace helper.
 *
 * @version 1.0 (2017-12-13)
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
 * The numeric calculator.
 *
 * @version 1.0 (2017-12-12)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.calculate = function(initialSettings, tPrecision) {

    /* some initial design values */
    var traceOpacity = 1.0;
    var traceWidth   = 1;

    /* calculate some initial values */
    initialSettings.vx0 = Math.cos(initialSettings.alpha) * initialSettings.v0;
    initialSettings.vy0 = Math.sin(initialSettings.alpha) * initialSettings.v0

    /* build the trace container (runge kutta method - 4. order) */
    var traceRungeKuttaMethodOfFourthOrderWithFriction = {
        x: [],
        y: [],
        id: 'trace-rk4-with-friction',
        name: 'RK4 (with air friction γ = ' + window.initialSettings.gamma + ')',
        type: 'scatter',
        opacity: traceOpacity,
        line: {
            width: traceWidth + 1
        }
    };

    /* build the trace container (runge kutta method - 4. order) */
    var traceRungeKuttaMethodOfFourthOrderWithoutFriction = {
        x: [],
        y: [],
        id: 'trace-rk4-without-friction',
        name: 'RK4 (without air friction)',
        type: 'scatter',
        opacity: traceOpacity,
        line: {
            width: traceWidth + 1
        }
    };

    /* build the trace container (analytic solution) */
    var traceAnalytic = {
        x: [],
        y: [],
        id: 'trace-analytic-with-friction',
        name: 'Analytic solution (without air friction)',
        type: 'scatter',
        opacity: traceOpacity,
        line: {
            width: traceWidth
        }
    };

    /* calculate the runge kutta equation (4. order) */
    var values = {
        x:  initialSettings.x0,
        vx: initialSettings.vx0,
        y:  initialSettings.y0,
        vy: initialSettings.vy0
    };
    do {
        traceRungeKuttaMethodOfFourthOrderWithFriction.x.push(values.x);
        traceRungeKuttaMethodOfFourthOrderWithFriction.y.push(values.y);

        values = equations.deltaRungeKuttaOfFourthOrderProjectileMotion(values, tPrecision, initialSettings);
    } while (values.y > 0);

    /* calculate the runge kutta equation (4. order) */
    var values = {
        x:  initialSettings.x0,
        vx: initialSettings.vx0,
        y:  initialSettings.y0,
        vy: initialSettings.vy0
    }; 
    do {
        traceRungeKuttaMethodOfFourthOrderWithoutFriction.x.push(values.x);
        traceRungeKuttaMethodOfFourthOrderWithoutFriction.y.push(values.y);

        values = equations.deltaRungeKuttaOfFourthOrderProjectileMotion(values, tPrecision, $.extend({}, initialSettings, {gamma: 0}));
    } while (values.y > 0);

    /* calculate the analytic equation without friction */
    var values = equations.analyticPosition({x: initialSettings.x0, y: initialSettings.y0}, 0, initialSettings);
    do {
        traceAnalytic.x.push(values.x);
        traceAnalytic.y.push(values.y);

        values = equations.analyticPosition(values, tPrecision, initialSettings);
    } while (values.y > 0);

    /* initialize the data output (result and error) */
    window.deleteTrace(window.idDivPlotly, 'trace-rk4-with-friction');
    Plotly.addTraces(window.idDivPlotly, traceRungeKuttaMethodOfFourthOrderWithFriction);

    window.deleteTrace(window.idDivPlotly, 'trace-rk4-without-friction');
    Plotly.addTraces(window.idDivPlotly, traceRungeKuttaMethodOfFourthOrderWithoutFriction);

    window.deleteTrace(window.idDivPlotly, 'trace-analytic-with-friction');
    Plotly.addTraces(window.idDivPlotly, traceAnalytic);
};

