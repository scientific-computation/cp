window.helper = {
    /**
     * Returns an initial config array for a trace.
     *
     * @version 1.0 (2018-01-30)
     * @author  Björn Hempel <bjoern@hempel.li>
     */
    getDefaultTraceConfig: function(config, traceWidthAdd, traceOpacityAdd) {
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
    },

    /**
     * Delete trace helper.
     *
     * @version 1.0 (2018-01-30)
     * @author  Björn Hempel <bjoern@hempel.li>
     */
    deleteTrace: function(idPlotly, idTrace) {
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
    }
};
