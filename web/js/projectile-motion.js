/**
 * Calculates a damped harmonic oscillator.
 *
 * @version 1.0 (2017-11-28)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.main = function() {

    /* some initial calculation values */
    var tMin         = 0;
    var tMax         = 20;
    var tPrecision   = 0.05;

    /* some initial design values */
    var traceOpacity = 1.0;
    var traceWidth   = 1;

    /* some initial motion equation values */
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
    var traceRungeKuttaMethodOfFourthOrder = {
        x: [],
        y: [],
        name: 'Runge-Kutta method of 4. order (with friction)',
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
        name: 'Analytic solution (without friction)',
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
        values = equations.deltaRungeKuttaOfFourthOrderProjectileMotion(values, tPrecision, initialSettings);
        traceRungeKuttaMethodOfFourthOrder.x.push(values.x);
        traceRungeKuttaMethodOfFourthOrder.y.push(values.y);
    } while (values.y > 0);

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
