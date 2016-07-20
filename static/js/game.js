var punch = $("<a>punch a tree</a>").click(function() {
    //
});

$(document).ready(function() {
    $("#do").append("<div id='loading'>loading...</div>");
    // send request for data, remove loading, add data
    $.post("https://clickmine.guard13007.com/get", {request: "stuff"}, function(data, status) {
        console.log(data);
        console.log(status);
        $("#loading").remove();
    });
});
