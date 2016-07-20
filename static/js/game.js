var stuff = {};

var actions = {
    wooden_planks: {
        uses: {logs: 1},
    },
    crafting_table: {
        uses: {wooden_planks: 4},
        label: "make a crafting table",
        once: true,
    },
    sticks: {
        uses: {wooden_planks: 2},
        count: 4,
    },
    wooden_axe: {
        requires: {crafting_table: 1},
        uses: {sticks: 2, wooden_planks: 3},
    },
};

for (stuff in actions) {
    console.log(stuff);
    console.log(actions[stuff]);
    // copy uses into requires
    // set count to 1 where it does not exist
    // set once to false where it is not true
    //TODO display appropriate content...which means this needs to be executed in loading!
}

function act(stuff) {
    //
}

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
        console.log("save: " + status);
        console.log(data);
    });
};

function saveLoop() {
    save();
    setTimeout(saveLoop, 60000);
}

$(document).ready(function() {
    $("#do").append("<div id='loading'>loading...</div>");

    $.post("https://clickmine.guard13007.com/get", {request: "stuff"}, function(data, status) {
        if (status == "success") {
            stuff = data;
            $("#do").append(punch); //TODO we need to append all accessible options, not just punch

            //TODO now we need to append haves, use function that needs to be developed above

            $("#account").append("<a href='#'>save</a>").click(function(){save();});

            setTimeout(saveLoop, 60000);

            console.log("load: " + status);
            console.log(data);

        } else {
            $("#do").append("something went wrong, please try refreshing the page");

            console.log("save failed: " + status);
            console.log(data);
        }

        $("#loading").remove();
    });
});
