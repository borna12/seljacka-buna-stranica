$(document).ready(function() {
    $("body").mouseup(function(e) {
        var subject = $(".w3-modal");

        if (e.target.id != subject.attr('class') && !subject.has(e.target).length) {
            subject.fadeOut();
            $("div").animate({
                scrollTop: 0
            }, "fast");
            $("video")[0].load();
            $("video")[1].load();
            $("video")[2].load();
            $("video")[3].load();
            $("video")[4].load();
            $("video")[5].load();

        }
    });
});