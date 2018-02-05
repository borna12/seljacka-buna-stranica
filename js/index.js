$(document).ready(function() {
    $("body").mouseup(function(e) {
        var subject2 = $("#html5box-html5-lightbox");
        var subject = $(".w3-modal");
        if (e.target.id != subject2.attr('id') && !subject2.has(e.target).length) {

            if (e.target.id != subject.attr('class') && !subject.has(e.target).length) {
                subject.fadeOut();
                $("div").animate({
                    scrollTop: 0
                }, "fast");
            }
        };
    })
});