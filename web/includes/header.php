<!-- load js libraries -->
<script src="/js/vendor/jquery-3.2.1.min.js"></script>
<script src="/js/vendor/plotly-1.31.2.min.js"></script>
<script src="/js/vendor/math-3.20.2.min.js"></script>
<!--script src="/js/vendor/mathjax-2.7.2.min.js"-->
<script src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML'></script>
<script src="/js/equations.js"></script>
<script src="/js/numerical-analysis.js"></script>
<script src="/js/helper.js"></script>

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

