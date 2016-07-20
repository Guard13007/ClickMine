var stuff = {};

var punch = $("<a href='#'>punch a tree</a>").click(function() {
    stuff.logs = stuff.logs + 1;

    if ($("#logs").length) {
        $("#logs").replaceWith("<li id='logs'>" + stuff.logs + " logs</li>");
    } else {
        $("#have").append("<li id='logs'>" + stuff.logs + " logs</li>");
    }
});

$(document).ready(function() {
    $("#do").append("<div id='loading'>loading...</div>");

    $.post("https://clickmine.guard13007.com/get", {request: "stuff"}, function(data, status) {
        $("#loading").remove();

        if (status == "success") {
            stuff = data;
            $("#do").append(punch);
        } else {
            $("#do").append("something went wrong, please try refreshing the page");
        }
    });
});
