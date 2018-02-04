$(document).ready(function() {
    $("body").mouseup(function(e) {
        var subject = $(".w3-modal");

        if (e.target.id != subject.attr('class') && !subject.has(e.target).length) {
            subject.fadeOut();
            $("div").animate({
                scrollTop: 0
            }, "fast");
           

        }
    });
});