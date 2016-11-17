// These are displayed under "do..." when available
var Actions = {
    logs: {
        label: "punch a tree",
        random: {saplings: 1/6, apples: 1/20},
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
    cobblestone: {
        requires: {wooden_pickaxes: 1},
        label: "go mining",
        singular_name: true,
        fn: function() {
            var cobble = Math.floor(Resources.wooden_pickaxes / 120);
            if (Resources.stone_pickaxes > 0) {
                cobble += Math.floor(Resources.stone_pickaxes / 50);
                if (Math.random() < Math.min(stone_pickaxes ^ 0.1 - 1, 0.99)) { // 1000 is roughly 99% chance
                    gain("coal", Math.floor(Math.random() * 32) + 1);
                }
            }
            if (cobble > 0) {
                gain("cobblestone", cobble);
            }
            //if (Resources.wooden_pickaxes)
            //  stone_pickaxes / X = + cobble
            //     diff x per type, rarer = more bonus
            //  max of (stone_pickaxes ^ 0.1 - 1 and 1) is percent chance of duplication of everything
            // some chance of breaking pickaxes that goes up with count (but is less than duplication chance), and is less with better pickaxes

            // stone_pickaxes, iron_pickaxes, gold_pickaxes, diamond_pickaxes
        },
    },
    dirt: { //NOTE technically possible without shovel...
        //requires: {wooden_shovels: 1},
        label: "dig",
        //random: {gravel: 1/30, clay: 1/60}, // gravel/clay should be singular but not have an action...
        //TODO resource definitions have to be separate from actual resources that you have!!
        // finish the listing of items and blocks before continuing to create them, then
        //  decide how to handle the properties and uses and methods that different things should have
        singular_name: true,
    },
    stone_axes: {
        requires: {crafting_tables: 1},
        user: {sticks: 2, cobblestone: 3},
        label: "make a stone axe",
    },
    stone_pickaxes: {
        require: {crafting_tables: 1},
        uses: {sticks: 2, cobblestone: 3},
        label: "make a stone pickaxe",
    },
    stone_shovels: {
        requires: {crafting_tables: 1},
        uses: {sticks: 2, cobblestone: 1},
        label: "make a stone shovel",
    },
    stone_swords: {
        requires: {crafting_tables: 1},
        uses: {sticks: 1, cobblestone: 2},
        label: "make a stone sword",
    },
};

// These are displayed under "have..." when available
var Resources = {
    saplings: 0, // these ones are here manually, the rest are added on load
    apples: 0,
    coal: 0,
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
        if ((Resources[resource_name] == 1) && Actions[resource_name] && !Actions[resource_name].singular_name) {
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

function gain(resource, count) {
    if (!count) {
        count = 1;
    }

    resource = resource + ""; // this is just in case I pass a non-string...
    Resources[resource] += count;
    updateResourcesDisplay(resource);
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

    if (Actions[gained_resource].fn) {
      Actions[gained_resource].fn();
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
        if (!Actions[action].singular_name) {
            Actions[action].singular_name = false;
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
