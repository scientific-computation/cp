/**
 * Calculates a damped harmonic oscillator.
 *
 * @version 1.0 (2017-11-22)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.main = function() {

    /* some initial values */
    var m          = 1.0;
    var k          = 1.0;
    var gamma      = 0.1;
    var x0         = 10.0;
    var v0         = 0.0;
    var tMin       = 0;
    var tMax       = 100;
    var tPrecision = 0.1;

    /* build the trace container (euler method) */
    var traceEulerMethod = {
        x: [],
        y: [],
        name: 'Euler method',
        type: 'scatter'
    };

    /* build the trace container (runge kutta method) */
    var traceRungeKuttaMethodOfSecondOrder = {
        x: [],
        y: [],
        name: 'Runge-Kutta method of 2. order',
        type: 'scatter'
    };

    /* build the trace container (runge kutta method - 4. order) */
    var traceRungeKuttaMethodOfFourthOrder = {
        x: [],
        y: [],
        name: 'Runge-Kutta method of 4. order',
        type: 'scatter'
    };

    /* build the trace container (analytic solution) */
    var traceAnalytic = {
        x: [],
        y: [],
        name: 'Analytic solution',
        type: 'scatter'
    };

    /* calculate the euler equation */
    traceEulerMethod.x.push(0);
    traceEulerMethod.y.push(0);

    /* calculate the runge kutta equation (2. order) */
    traceRungeKuttaMethodOfSecondOrder.x.push(0);
    traceRungeKuttaMethodOfSecondOrder.y.push(0);

    /* calculate the runge kutta equation (4. order) */
    traceRungeKuttaMethodOfFourthOrder.x.push(0);
    traceRungeKuttaMethodOfFourthOrder.y.push(0);

    /* calculate the analytic equation */
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        traceAnalytic.x.push(t);
        traceAnalytic.y.push(equations.analyticSpringPendulumDamped(m, k, gamma, x0, v0, t));
    }


    /* initialize the output */
    var data = [traceEulerMethod, traceRungeKuttaMethodOfSecondOrder, traceRungeKuttaMethodOfFourthOrder, traceAnalytic];

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

