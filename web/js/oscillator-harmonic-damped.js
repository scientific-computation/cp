/**
 * Calculates a damped harmonic oscillator.
 *
 * @version 1.0 (2017-11-28)
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
            title: 'amplitude [x(t)]',
            range: [-11, 11]
        }
    };

    /* layout error graph */
    var layoutError = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'time [t]'
        },
        yaxis: {
            title: 'error analytic - numeric'
        }
    };

    /* layout phase space */
    var layoutPhaseSpace = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'position [x]',
            range: [-11, 11]
        },
        yaxis: {
            title: 'velocity [v(t)]',
            range: [-11, 11]
        }
    };

    /* layout energy */
    var layoutEnergy = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'time [t]'
        },
        yaxis: {
            title: 'energy [E(t)]',
            range: [0, 50]
        }
    };

    /* layout energy without attenuation */
    var layoutEnergyWithoutAttenuation = {
        title: '',
        showlegend: true,
        xaxis: {
            title: 'time [t]',
            range: [0, 10]
        },
        yaxis: {
            title: 'energy [E(t)]',
            range: [40, 100]
        }
    };

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
    var traceEulerMethodPhaseSpace = jQuery.extend(true, {}, traceEulerMethod);
    var traceEulerMethodEnergy = jQuery.extend(true, {}, traceEulerMethod);
    var traceEulerMethodEnergyWithoutAttenuation = jQuery.extend(true, {}, traceEulerMethod);

    /* build the trace container (runge kutta method) */
    var traceRungeKuttaMethodOfSecondOrder = {
        x: [],
        y: [],
        name: 'Runge-Kutta method of 2. order',
        type: 'scatter',
        opacity: traceOpacity,
        line: {
            width: traceWidth + 1
        }
    };
    var traceRungeKuttaMethodOfSecondOrderError = jQuery.extend(true, {}, traceRungeKuttaMethodOfSecondOrder);
    var traceRungeKuttaMethodOfSecondOrderPhaseSpace = jQuery.extend(true, {}, traceRungeKuttaMethodOfSecondOrder);
    var traceRungeKuttaMethodOfSecondOrderEnergy = jQuery.extend(true, {}, traceRungeKuttaMethodOfSecondOrder);
    var traceRungeKuttaMethodOfSecondOrderEnergyWithoutAttenuation = jQuery.extend(true, {}, traceRungeKuttaMethodOfSecondOrder);

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
    var traceRungeKuttaMethodOfFourthOrderPhaseSpace = jQuery.extend(true, {}, traceRungeKuttaMethodOfFourthOrder);
    var traceRungeKuttaMethodOfFourthOrderEnergy = jQuery.extend(true, {}, traceRungeKuttaMethodOfFourthOrder);
    var traceRungeKuttaMethodOfFourthOrderEnergyWithoutAttenuation = jQuery.extend(true, {}, traceRungeKuttaMethodOfFourthOrder);

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
    var traceAnalyticPhaseSpace = jQuery.extend(true, {}, traceAnalytic);
    var traceAnalyticEnergy = jQuery.extend(true, {}, traceAnalytic);
    var traceAnalyticEnergyWithoutAttenuation = jQuery.extend(true, {}, traceAnalytic);

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
        values = equations.deltaRungeKuttaOfSecondOrderSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfSecondOrder.x.push(t);
        traceRungeKuttaMethodOfSecondOrder.y.push(values.x);
    }

    /* calculate the runge kutta equation (4. order) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaOfFourthOrderSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfFourthOrder.x.push(t);
        traceRungeKuttaMethodOfFourthOrder.y.push(values.x);
    }

    /* calculate the analytic equation */
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        traceAnalytic.x.push(t);
        traceAnalytic.y.push(equations.analyticPositionSpringPendulumDamped(m, k, gamma, x0, v0, t));
    }

    /* calculate the phase space (euler) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaEulerSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceEulerMethodPhaseSpace.x.push(values.x);
        traceEulerMethodPhaseSpace.y.push(values.v);
    }

    /* calculate the runge kutta equation (2. order) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaOfSecondOrderSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfSecondOrderPhaseSpace.x.push(values.x);
        traceRungeKuttaMethodOfSecondOrderPhaseSpace.y.push(values.v);
    }

    /* calculate the runge kutta equation (4. order) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaOfFourthOrderSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfFourthOrderPhaseSpace.x.push(values.x);
        traceRungeKuttaMethodOfFourthOrderPhaseSpace.y.push(values.v);
    }

    /* calculate the analytic equation */
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        traceAnalyticPhaseSpace.x.push(equations.analyticPositionSpringPendulumDamped(m, k, gamma, x0, v0, t));
        traceAnalyticPhaseSpace.y.push(equations.analyticDerivationSpringPendulumDamped(m, k, gamma, x0, v0, t));
    }

    /* calculate the energy (euler) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaEulerSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceEulerMethodEnergy.x.push(t);
        traceEulerMethodEnergy.y.push(equations.energySpringPendulumDamped(k, m, values.x, values.v));
    }

    /* calculate the energy (runge kutta equation 2. order) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaOfSecondOrderSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfSecondOrderEnergy.x.push(t);
        traceRungeKuttaMethodOfSecondOrderEnergy.y.push(equations.energySpringPendulumDamped(k, m, values.x, values.v));
    }

    /* calculate the energy (runge kutta equation 4. order) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaOfFourthOrderSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfFourthOrderEnergy.x.push(t);
        traceRungeKuttaMethodOfFourthOrderEnergy.y.push(equations.energySpringPendulumDamped(k, m, values.x, values.v));
    }

    /* calculate the energy (analytic equation) */
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        var x = equations.analyticPositionSpringPendulumDamped(m, k, gamma, x0, v0, t);
        var v = equations.analyticDerivationSpringPendulumDamped(m, k, gamma, x0, v0, t);

        traceAnalyticEnergy.x.push(t);
        traceAnalyticEnergy.y.push(equations.energySpringPendulumDamped(k, m, x, v));
    }

    gamma = 0;

    /* calculate the energy (euler) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaEulerSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceEulerMethodEnergyWithoutAttenuation.x.push(t);
        traceEulerMethodEnergyWithoutAttenuation.y.push(equations.energySpringPendulumDamped(k, m, values.x, values.v));
    }

    /* calculate the energy (runge kutta equation 2. order) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaOfSecondOrderSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfSecondOrderEnergyWithoutAttenuation.x.push(t);
        traceRungeKuttaMethodOfSecondOrderEnergyWithoutAttenuation.y.push(equations.energySpringPendulumDamped(k, m, values.x, values.v));
    }

    /* calculate the energy (runge kutta equation 4. order) */
    var values = {x: x0, v: v0};
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        values = equations.deltaRungeKuttaOfFourthOrderSpringPendulumDamped(m, k, gamma, values, tPrecision);
        traceRungeKuttaMethodOfFourthOrderEnergyWithoutAttenuation.x.push(t);
        traceRungeKuttaMethodOfFourthOrderEnergyWithoutAttenuation.y.push(equations.energySpringPendulumDamped(k, m, values.x, values.v));
    }

    /* calculate the energy (analytic equation) */
    for (var t = tMin; t <= tMax; t = t + tPrecision) {
        var x = equations.analyticPositionSpringPendulumDamped(m, k, gamma, x0, v0, t);
        var v = equations.analyticDerivationSpringPendulumDamped(m, k, gamma, x0, v0, t);

        traceAnalyticEnergyWithoutAttenuation.x.push(t);
        traceAnalyticEnergyWithoutAttenuation.y.push(equations.energySpringPendulumDamped(k, m, x, v));
    }

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

    /* initialize the data output (result and error) */
    var data = [traceEulerMethod, traceRungeKuttaMethodOfSecondOrder, traceRungeKuttaMethodOfFourthOrder, traceAnalytic];
    var dataError = [traceEulerMethodError, traceRungeKuttaMethodOfSecondOrderError, traceRungeKuttaMethodOfFourthOrderError, traceAnalyticError];
    var dataPhaseSpace = [traceEulerMethodPhaseSpace, traceRungeKuttaMethodOfSecondOrderPhaseSpace, traceRungeKuttaMethodOfFourthOrderPhaseSpace, traceAnalyticPhaseSpace];
    var dataEnergy = [traceEulerMethodEnergy, traceRungeKuttaMethodOfSecondOrderEnergy, traceRungeKuttaMethodOfFourthOrderEnergy, traceAnalyticEnergy];
    var dataEnergyWithoutAttenuation = [
        traceEulerMethodEnergyWithoutAttenuation,
        traceRungeKuttaMethodOfSecondOrderEnergyWithoutAttenuation,
        traceRungeKuttaMethodOfFourthOrderEnergyWithoutAttenuation,
        traceAnalyticEnergyWithoutAttenuation
    ];

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
    Plotly.newPlot(
        'graph-oscillator-harmonic-damped-phase',
        dataPhaseSpace,
        layoutPhaseSpace,
        {
            displayModeBar: false,
            scrollZoom: false,
            editable: false,
            staticPlot: true
        }
    );
    Plotly.newPlot(
        'graph-oscillator-harmonic-damped-energy',
        dataEnergy,
        layoutEnergy,
        {
            displayModeBar: false,
            scrollZoom: false,
            editable: false,
            staticPlot: true
        }
    );
    Plotly.newPlot(
        'graph-oscillator-harmonic-damped-error',
        dataError,
        layoutError,
        {
            displayModeBar: false,
            scrollZoom: false,
            editable: false,
            staticPlot: true
        }
    );
    Plotly.newPlot(
        'graph-oscillator-harmonic-damped-energy-without-attenuation',
        dataEnergyWithoutAttenuation,
        layoutEnergyWithoutAttenuation,
        {
            displayModeBar: false,
            scrollZoom: false,
            editable: false,
            staticPlot: true
        }
    );
};
