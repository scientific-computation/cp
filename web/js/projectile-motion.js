/**
 * Calculates a damped harmonic oscillator.
 *
 * @version 1.0 (2017-11-28)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.main = function() {

    /* some initial values */
    var initialSettings = {
        m:     1.0,
        gamma: 0.1,
        x0:    0.0,
        g:     10.0,
        v0:    10.0,
        x0:    0.0,
        y0:    10.0,
        alpha: 0.8
    };

    var tMin         = 0;
    var tMax         = 20;
    var tPrecision   = 0.05;
    var traceOpacity = 1.0;
    var traceWidth   = 1;


    /* layout graph */
    var layout = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'time [t]'
        },
        yaxis: {
            title: 'amplitude [x(t)]'
        }
    };

    /* build the trace container (runge kutta method - 4. order) */
    var traceRungeKuttaMethodOfFourthOrder = {
        x: [],
        y: [],
        name: 'Runge-Kutta method of 4. order',
        type: 'scatter',
        opacity: traceOpacity,
        line: {
            width: traceWidth
        }
    };

    /* build the trace container (analytic solution) */
    var traceAnalytic = {
        x: [],
        y: [],
        name: 'Analytic solution',
        type: 'scatter',
        opacity: traceOpacity,
        line: {
            width: traceWidth
        }
    };

    /* calculate the runge kutta equation (4. order) */
    var values = {x: initialSettings.x0, vx: initialSettings.v0, y: initialSettings.x0, vy: initialSettings.v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaOfFourthOrderProjectileMotion(values, tPrecision, initialSettings);
        traceRungeKuttaMethodOfFourthOrder.x.push(t);
        traceRungeKuttaMethodOfFourthOrder.y.push(values.x);
    }

    /* calculate the analytic equation without friction */
    var values = {x: initialSettings.x0, y: initialSettings.y0};
    do {
        values = equations.analyticPosition(values, initialSettings);

        traceAnalytic.x.push(values.x);
        traceAnalytic.y.push(values.y);

        values.x += tPrecision;
    } while (values.y > 0);

    /* initialize the data output (result and error) */
    var data = [traceRungeKuttaMethodOfFourthOrder, traceAnalytic];

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
