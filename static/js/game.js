var stuff = {};

var punch = $("<a href='#'>punch a tree</a>").click(function() {
    stuff.logs = stuff.logs + 1;

    //TODO this nees to be a function I can just call
    if ($("#logs").length) {
        $("#logs").replaceWith("<li id='logs'>" + stuff.logs + " logs</li>");
    } else {
        $("#have").append("<li id='logs'>" + stuff.logs + " logs</li>");
    }

    //TODO this also needs to be able to check if we've unlocked anything and append it
    //TODO this also needs to check if we've LOCKED something and remove it
});

var save = function() {
    //TODO display error appended to #account when this fails
    $.post("https://clickmine.guard13007.com/update", {request: "stuff", stuff: stuff}, function(data, status) {
        console.log(data);
        console.log(status);
    });
};

function saveLoop() {
    save();
    setTimeout(saveLoop, 60000);
}

$(document).ready(function() {
    $("#do").append("<div id='loading'>loading...</div>");

    $.post("https://clickmine.guard13007.com/get", {request: "stuff"}, function(data, status) {
        $("#loading").remove();

        if (status == "success") {
            stuff = data;
            $("#do").append(punch); //TODO we need to append all accessible options, not just punch

            //TODO now we need to append haves, use function that needs to be developed above

            $("#account").append("<a href='#'>save</a>").click(function(){save();});

            setTimeout(saveLoop, 60000);

        } else {
            $("#do").append("something went wrong, please try refreshing the page");

            console.log(status);
            console.log(data);
        }
    });
});
