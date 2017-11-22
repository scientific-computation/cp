<!-- load js libraries -->
<script src="/js/vendor/jquery-3.2.1.min.js"></script>
<script src="/js/vendor/plotly-1.2.0.min.js"></script>
<script src="/js/equations.js"></script>

<!-- load style sheets -->
<link rel="stylesheet/less" type="text/css" href="/less/main.less" />
<!--script>less = { env: 'development'};</script-->
<script src="/js/vendor/less-2.7.2.min.js"></script>
<!--script>less.watch();</script-->
<script> less.postProcessCSS = function() { alert(123); }; </script>
<script type="text/javascript">

    $(document).data('less-loaded', false);
    less.pageLoadFinished.then(function() {
        $(document).data('less-loaded', true);
        $(document).trigger('loaded', ['less']);
    });

    $(document).data('jquery-loaded', false);
    $(document).ready(function() {
        $(document).data('jquery-loaded', true);
        $(document).trigger('loaded', ['jquery']);
    });

    $(document).bind('loaded', function(e, type) {
        if ($(document).data('jquery-loaded') && $(document).data('less-loaded')) {
            if (typeof window.main === 'function') {
                window.main();
            }
        }
    });

</script>

