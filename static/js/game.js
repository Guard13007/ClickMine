// These are displayed under "do..." when available
var Actions = {
    logs: {
        label: "punch a tree",
        random: {saplings: 1/6, apples: 1/30},
    },
    wooden_planks: {
        uses: {logs: 1},
        label: "make wooden planks",
        count: 4,
    },
    crafting_tables: {
        uses: {wooden_planks: 4},
        label: "make a crafting table",
    },
    sticks: {
        uses: {wooden_planks: 2},
        label: "make sticks",
        count: 4,
    },
    wooden_axes: {
        requires: {crafting_tables: 1},
        uses: {sticks: 2, wooden_planks: 3},
        label: "make a wooden axe",
    },
    wooden_pickaxes: {
        requires: {crafting_tables: 1},
        uses: {sticks: 2, wooden_planks: 3},
        label: "make a wooden pickaxe",
    },
    wooden_shovels: {
        requires: {crafting_tables: 1},
        uses: {sticks: 2, wooden_planks: 1},
        label: "make a wooden shovel",
    },
    wooden_swords: {
        requires: {crafting_tables: 1},
        uses: {sticks: 1, wooden_planks: 2},
        label: "make a wooden sword",
    },
};

// These are displayed under "have..." when available
var Resources = {
    saplings: 0,
    apples: 0,
};

// Updates displayed Actions under "do..."
function updateActionsDisplay(action_name) {
    // can update all or a specific one
    if (!action_name) {
        for (action in Actions) {
            str_action = action + "";
            updateActionsDisplay(str_action);
        }

        return;
    }

    // figure out if it is available
    var available = true;
    for (required_resource in Actions[action_name].requires) {
        str_required_resource = required_resource + "";
        if (Resources[str_required_resource] < Actions[action_name].requires[required_resource]) {
            available = false;
        }
    }

    // if available, and not already there, add it
    if (available && ($("#a_" + action_name).length == 0)) {
        $("#do").append("<li id='a_" + action_name + "'><a href='#' onclick='act(\"" + action_name + "\")'>" + Actions[action_name].label + "</a></li>");
    }

    // if there, and not available, remove it
    if (!available && ($("#a_" + action_name).length > 0)) {
        $("#a_" + action_name).remove();
    }
}

// Updates displayed Resources under "have..."
function updateResourcesDisplay(resource_name) {
    // can update all or a specific one
    if (!resource_name) {
        for (resource in Resources) {
            str_resource = resource + "";
            updateResourcesDisplay(str_resource);
        }

        return;
    }

    // <li id='r_NAME'># NAME(s)</li>
    if (Resources[resource_name] > 0) {
        output = "<li id='r_" + resource_name + "'>" + Resources[resource_name] + " " + resource_name.replace("_", " ");
        if (Resources[resource_name] == 1) {
            output = output.substring(0, output.length - 1);
        }

        output += "</li>";

        if ($("#r_" + resource_name).length) {
            $("#r_" + resource_name).replaceWith(output);
        } else {
            $("#have").append(output);
        }
    } else {
        if ($("#r_" + resource_name).length) {
            $("#r_" + resource_name).remove();
        }
    }
}

// Called by clickable items under "do..."
function act(gained_resource) {
    for (used_resource in Actions[gained_resource].uses) {
        // remove used resources
        str_used_resource = used_resource + "";
        Resources[str_used_resource] -= Actions[gained_resource].uses[used_resource];
        // update display of used resources
        updateResourcesDisplay(str_used_resource);
    }

    // update gained resource
    Resources[gained_resource] += Actions[gained_resource].count;
    updateResourcesDisplay(gained_resource);

    // check for and get random resources
    for (random_resource in Actions[gained_resource].random) {
        if (Math.random() < Actions[gained_resource].random[random_resource]) {
            str_random_resource = random_resource + "";
            Resources[str_random_resource] += 1; //hardcoded..not good :/
            updateResourcesDisplay(str_random_resource);
        }
    }

    updateActionsDisplay();
}

// Saves your game and notifies success/failure
function save() {
    $("#account").append("<li id='status'>saving...</li>");

    $.post("https://clickmine.guard13007.com/update", {request: "resources", resources: Resources}, function(data, status) {
        if (status == "success") {
            $("#status").replaceWith("<li id='status' style='color:green;'>saved!</li>").fadeOut(1300, function() { $("#status").remove(); });
        } else {
            $("#status").replaceWith("<li id='status' style='color:red;'>something went wrong, please try saving again</li>").fadeOut(3000, function() { $("#status").remove(); });
        }

        console.log("save: " + status);
        console.log(data);
    });
}

function saveLoop() {
    save();
    setTimeout(saveLoop, 60000);
}

// Okay, let's get started!
$(document).ready(function() {
    $("#do").append("<li id='status'>loading...</li>");

    // fill out Actions table with defaults
    for (action in Actions) {
        if (!Actions[action].requires) {
            Actions[action].requires = {};
        }
        if (!Actions[action].uses) {
            Actions[action].uses = {};
        }
        if (!Actions[action].random) {
            Actions[action].random = {};
        }
        if (!Actions[action].count) {
            Actions[action].count = 1;
        }

        for (resource in Actions[action].uses) {
            str_resource = resource + "";
            Actions[action].requires[str_resource] = Actions[action].uses[resource];
        }

        str_action = action + "";
        if (!Resources[str_action]) {
            Resources[str_action] = 0;
        }
    }

    $.post("https://clickmine.guard13007.com/get", {request: "resources"}, function(data, status) {
        if (status == "success") {
            // load data
            for (resource in data) {
                str_resource = resource + "";
                Resources[str_resource] = data[resource];
            }

            $("#status").remove();

            // update displayed info
            updateActionsDisplay();
            updateResourcesDisplay();

            $("#account").append("<li><a href='#'>save</a>").click(function() { save(); });

            setTimeout(saveLoop, 60000);

            window.onbeforeunload = function() { save(); }; // apparently this is the way to do it...

        } else {
            $("#status").replaceWith("<li id='status'>something went wrong, please try refreshing the page</li>");
        }

        console.log("load: " + status);
        console.log(data);
    });
});
