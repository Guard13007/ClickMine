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

            // temporary button!
            $("#have").append("<a href='#'>save</a>").click(function() {
                $.post("https://clickmine.guard13007.com/update", {request: "stuff", stuff: stuff}, function(data, status) {
                    console.log(data);
                    console.log(status);
                });
            });

        } else {
            $("#do").append("something went wrong, please try refreshing the page");

            console.log(status);
            console.log(data);
        }
    });
});
