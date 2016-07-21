// this is where actual amounts of items are stored
var stuff = {};

// these are items in #do (they appear or disappear based on when they can be done)
var actions = {
    logs: {
        label: "punch a tree",
    },
    wooden_planks: {
        uses: {logs: 1},
        label: "make wooden planks",
        count: 4,
    },
    crafting_tables: {
        uses: {wooden_planks: 4},
        label: "make a crafting table",   //TODO? make this make crafting craft more things at once ?
        once: true,
    },
    sticks: {
        uses: {wooden_planks: 2},
        label: "make sticks",
        count: 4,
    },
    wooden_axes: {
        requires: {crafting_tables: 1},
        label: "make a wooden axe",    //TODO this needs to increase the amount of wood you get per punch
        uses: {sticks: 2, wooden_planks: 3},
    },

    //NOTE this is due to a weird bug I can't figure out
    nopes: {},
};

// called to update what actions can be done
function updateActions() {
    for (_stuff in actions) {
        console.log("Current action: " + _stuff); //tmp
        var able = true;

        for (require in actions[_stuff].requires) {
            if (stuff[require] < actions[_stuff].requires[require]) {
                able = false;
                console.log("Action " + _stuff + " cannot be done!"); //tmp
            }
        }

        // if it is able, and doesn't exist, add it
        if (able && !($("#a_" + _stuff).length)) {
            if (_stuff != "nopes") { //NOTE this is due to a weird bug I can't figure out
                console.log("Adding action " + _stuff); //tmp
                $("#do").append("<li id='a_" + _stuff + "'><a href='#'>" + actions[_stuff].label + "</a></li>").click(function() { act(toString(_stuff)); });
            }
        }

        // if it exists, and is not able, remove it
        if ($("#a_" + _stuff).length && !able) {
            $("#a_" + _stuff).remove();
            console.log("Removing action " + _stuff); //tmp
        }
    }
}

// call to update a stuff to be shown or not
function updateAstuff(_stuff) {
    //NOTE this is due to a weird bug I can't figure out
    if (_stuff == "nopes") return;

    if (stuff[_stuff] > 0) {
        stuff_display = "<li id='s_" + _stuff + "'>" + stuff[_stuff] + " " + _stuff;
        if (stuff[_stuff] == 1) {
            stuff_display = stuff_display.substring(0, stuff_display.length - 1);
        }

        stuff_display += "</li>";

        if ($("#s_" + _stuff).length) {
            $("#s_" + _stuff).replaceWith(stuff_display);
        } else {
            $("#have").append(stuff_display);
        }
    } else {
        if ($("#s_" + _stuff).length) {
            $("#s_" + _stuff).remove();
        }
    }
}

// this is called whenever a #do action is clicked
function act(stuff_do) {
    //NOTE this is due to a weird bug I can't figure out
    if (stuff_do == "nopes") return;

    // remove the resources that have been used
    for (used in actions[stuff_do].uses) {
        stuff[used] -= actions[stuff_do].uses[used];
        updateAstuff(used);
    }

    stuff[stuff_do] += actions[stuff_do].count;
    console.log(stuff_do + " increased by " + actions[stuff_do].count); //tmp

    updateActions();
    updateAstuff(stuff_do);
}

// saves your game to the server and notifies of success/failure
var save = function() {
    //NOTE this is due to a weird bug I can't figure out
    delete stuff.nopes;

    $("#account").append("<li id='status'>saving...</li>");

    $.post("https://clickmine.guard13007.com/update", {request: "stuff", stuff: stuff}, function(data, status) {
        if (status != "success") {
            $("#status").replaceWith("<li id='status' style='color:red;'>something went wrong, please try saving again</li>").fadeOut(1300, function() { $("#status").remove(); });
        } else {
            $("#status").replaceWith("<li id='status' style='color:green;'>saved!</li>").fadeOut(1300, function() { $("#status").remove(); });
        }

        console.log("save: " + status);
        console.log(data);
    });
};

// every 60 seconds, the game autosaves
function saveLoop() {
    save();
    setTimeout(saveLoop, 60000);
}

// this helper makes sure all actions are complete
function setupActions() {
    for (_stuff in actions) {
        if (!actions[_stuff].requires) {
            actions[_stuff].requires = {};
        }
        if (!actions[_stuff].uses) {
            actions[_stuff].uses = {};
        }
        for (use in actions[_stuff].uses) {
            actions[_stuff].requires[use] = actions[_stuff].uses[use];
        }
        if (!actions[_stuff].count) {
            actions[_stuff].count = 1;
        }
        if (!actions[_stuff].once) {
            actions[_stuff].once = false;
        }
    }

    updateActions();
}

$(document).ready(function() {
    $("#do").append("<div id='status'>loading...</div>");

    $.post("https://clickmine.guard13007.com/get", {request: "stuff"}, function(data, status) {
        if (status == "success") {
            stuff = data;

            $("#do").append("<li id='a_logs'><a href='#'>punch a tree</a></li>").click(function() { act("logs"); });

            setupActions();

            for (aStuff in stuff) {
                updateAstuff(aStuff);
            }

            $("#account").append("<a href='#'>manual save</a>").click(function(){save();});

            setTimeout(saveLoop, 60000);

        } else {
            $("#do").append("something went wrong, please try refreshing the page");
        }

        $("#status").remove();

        console.log("load: " + status);
        console.log(data);
    });
});
