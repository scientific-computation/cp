/*
 * Numeric calculation of projectile motions.
 *
 * @version 1.0 (2017-12-12)
 * @author  Björn Hempel <bjoern@hempel.li>
 */

/* some initial calculation values */
window.tPrecision = 0.2;

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

/**
 * Main start function.
 *
 * @version 1.0 (2017-12-12)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.main = function() {
    window.calculate(window.initialSettings, window.tPrecision);
};

/**
 * The numeric calculator.
 *
 * @version 1.0 (2017-12-12)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.calculate = function(initialSettings, tPrecision) {

    //Plotly.purge('');

    /* some initial design values */
    var traceOpacity = 1.0;
    var traceWidth   = 1;

    /* calculate some initial values */
    initialSettings.vx0 = Math.cos(initialSettings.alpha) * initialSettings.v0;
    initialSettings.vy0 = Math.sin(initialSettings.alpha) * initialSettings.v0

    /* layout graph */
    var layout = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'x(t)'
        },
        yaxis: {
            title: 'y(t)'
        }
    };

    /* build the trace container (runge kutta method - 4. order) */
    var traceRungeKuttaMethodOfFourthOrderWithFriction = {
        x: [],
        y: [],
        name: 'Runge-Kutta method of 4. order (with air friction)',
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
        name: 'Runge-Kutta method of 4. order (without air friction)',
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
    initialSettings.gamma = 0;
    var values = {
        x:  initialSettings.x0,
        vx: initialSettings.vx0,
        y:  initialSettings.y0,
        vy: initialSettings.vy0
    }; 
    do {
        traceRungeKuttaMethodOfFourthOrderWithoutFriction.x.push(values.x);
        traceRungeKuttaMethodOfFourthOrderWithoutFriction.y.push(values.y);

        values = equations.deltaRungeKuttaOfFourthOrderProjectileMotion(values, tPrecision, initialSettings);
    } while (values.y > 0);

    /* calculate the analytic equation without friction */
    var values = equations.analyticPosition({x: initialSettings.x0, y: initialSettings.y0}, tPrecision, initialSettings);
    do {
        traceAnalytic.x.push(values.x);
        traceAnalytic.y.push(values.y);

        values = equations.analyticPosition(values, tPrecision, initialSettings);
    } while (values.y > 0);

    /* initialize the data output (result and error) */
    var data = [traceRungeKuttaMethodOfFourthOrderWithFriction, traceRungeKuttaMethodOfFourthOrderWithoutFriction, traceAnalytic];

    /* build the graph and error graph */
    Plotly.newPlot(
        'graph-oscillator-harmonic-damped',
        data,
        layout,
        {
            displayModeBar: false,
            scrollZoom: false,
            editable: false,
            staticPlot: true
        }
    );
};

