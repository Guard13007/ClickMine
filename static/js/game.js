// These are displayed under "do..." when available
var Actions = {
    logs: {
        requires: {}, //
        uses: {}, //
        label: "punch a tree",
        count: 1, //
    },
    wooden_planks: {
        requires: {logs: 1}, //
        uses: {logs: 1},
        label: "make wooden planks",
        count: 4,
    },
};

// These are displayed under "have..." when available
var Resources = {
    logs: 0,
    wooden_planks: 0,
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
        output = "<li id='r_" + resource_name + "'>" + Resources[resource_name] + " " + resource_name;
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
        Resources[str_used_resource] -= Actions[gained_resource].uses[used_resource];
        // update display of used resources
        str_used_resource = used_resource + "";
        updateResourcesDisplay(str_used_resource);
    }

    Resources[gained_resource] += Actions[gained_resource].count;
    updateResourcesDisplay(gained_resource);

    updateActionsDisplay();
}

// Okay, let's get started!
$(document).ready(function() {
    updateActionsDisplay();
    updateResourcesDisplay();
});
