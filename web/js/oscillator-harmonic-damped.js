/**
 * Calculates a damped harmonic oscillator.
 *
 * @version 1.0 (2017-11-22)
 * @author  Björn Hempel <bjoern@hempel.li>
 */
window.main = function() {

    /* some initial values */
    var m            = 1.0;
    var k            = 1.0;
    var gamma        = 0.1;
    var x0           = 10.0;
    var v0           = 0.0;
    var tMin         = 0;
    var tMax         = 100;
    var tPrecision   = 0.005;
    var traceOpacity = 1.0;
    var traceWidth   = 1;

    /* build the trace container (euler method) */
    var traceEulerMethod = {
        x: [],
        y: [],
        name: 'Euler method',
        type: 'scatter',
        opacity: traceOpacity,
        line: {
            width: traceWidth
        }
    };
    var traceEulerMethodError = jQuery.extend(true, {}, traceEulerMethod);

    /* build the trace container (runge kutta method) */
    var traceRungeKuttaMethodOfSecondOrder = {
        x: [],
        y: [],
        name: 'Runge-Kutta method of 2. order',
        type: 'scatter',
        opacity: traceOpacity,
        line: {
            width: traceWidth
        }
    };
    var traceRungeKuttaMethodOfSecondOrderError = jQuery.extend(true, {}, traceRungeKuttaMethodOfSecondOrder);

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
    var traceRungeKuttaMethodOfFourthOrderError = jQuery.extend(true, {}, traceRungeKuttaMethodOfFourthOrder);

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
    var traceAnalyticError = jQuery.extend(true, {}, traceAnalytic);

    /* calculate the euler equation */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaEulerSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceEulerMethod.x.push(t);
        traceEulerMethod.y.push(values.x);
    }

    /* calculate the runge kutta equation (2. order) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfSecondOrder.x.push(t);
        traceRungeKuttaMethodOfSecondOrder.y.push(values.x);
    }

    /* calculate the runge kutta equation (4. order) */
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        traceRungeKuttaMethodOfFourthOrder.x.push(t);
        traceRungeKuttaMethodOfFourthOrder.y.push(equations.analyticSpringPendulumDamped(m, k, gamma, x0, v0, t));
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

    /* calculates the errors (deviation) */
    for (var t = 0; t < traceAnalytic.x.length; t++) {
        traceEulerMethodError.x.push(traceEulerMethod.x[t]);
        traceEulerMethodError.y.push(traceAnalytic.y[t] - traceEulerMethod.y[t]);

        traceRungeKuttaMethodOfSecondOrderError.x.push(traceRungeKuttaMethodOfSecondOrder.x[t]);
        traceRungeKuttaMethodOfSecondOrderError.y.push(traceAnalytic.y[t] - traceRungeKuttaMethodOfSecondOrder.y[t]);

        traceRungeKuttaMethodOfFourthOrderError.x.push(traceRungeKuttaMethodOfFourthOrder.x[t]);
        traceRungeKuttaMethodOfFourthOrderError.y.push(traceAnalytic.y[t] - traceRungeKuttaMethodOfFourthOrder.y[t]);

        traceAnalyticError.x.push(traceAnalytic.x[t]);
        traceAnalyticError.y.push(traceAnalytic.y[t] - traceAnalytic.y[t]);
    }

    /* initialize the error output */
    var dataError = [traceEulerMethodError, traceRungeKuttaMethodOfSecondOrderError, traceRungeKuttaMethodOfFourthOrderError, traceAnalyticError];

    var layout = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'time [t]'
        },
        yaxis: {
            title: 'error analytic - numeric'
        }
    };

    Plotly.newPlot(
        'graph-oscillator-harmonic-damped-error',
        dataError,
        layout,
        {
            displayModeBar: false,
            scrollZoom: false,
            editable: false,
            staticPlot: true
        }
    );
};

