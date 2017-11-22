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
    var tPrecision = 0.01;

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
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaEulerSpringPendulumDamped(m, k, gamma, values, tPrecision)
        traceEulerMethod.x.push(t);
        traceEulerMethod.y.push(values.x);
    }

    /* calculate the runge kutta equation (2. order) */
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        traceRungeKuttaMethodOfSecondOrder.x.push(t);
        traceRungeKuttaMethodOfSecondOrder.y.push(0);
    }

    /* calculate the runge kutta equation (4. order) */
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        traceRungeKuttaMethodOfFourthOrder.x.push(t);
        traceRungeKuttaMethodOfFourthOrder.y.push(0);
    }

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

