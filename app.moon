lapis = require "lapis"

import respond_to, json_params from require "lapis.application"

Users = require "models.Users"

class extends lapis.Application
	[githook: "/githook"]: respond_to {
        GET: =>
            return status: 404
        POST: json_params =>
            if @params.ref == "refs/heads/master"
                os.execute "echo \"Updating server...\" >> logs/updates.log"
                os.execute "git pull origin >> logs/updates.log"
                os.execute "moonc . 2>> logs/updates.log"
                os.execute "ldoc . >> logs/updates.log"
                os.execute "lapis migrate production >> logs/updates.log"
                os.execute "lapis build production >> logs/updates.log"
                return { json: { status: "successful" } } --TODO scan for actual success (exit codes?), return a server error or whatever for errors
            else
                return { json: { status: "ignored non-master push" } }
    }

    [get: "/get"]: respond_to {
        GET: =>
            return status: 404
        POST: json_params =>
            user = Users\find id: @session.id
            return {
                json: user
            }
    }

    [index: "/"]: =>
    	@html ->
            if @session.id
                script src: @build_url "static/js/jquery-3.1.0.min.js"
                script src: @build_url "static/js/game.js"
                ul id: "do"
                ul id: "have"
    		ul ->
	    		if @session.id
	    			li ->
	    				a href: @url_for("logout"), "Log out!"
	    		else
		    		li ->
    		    		a href: @url_for("create_user"), "Make an account."
    				li ->
    					a href: @url_for("login"), "Log in!"

    [create_user: "/create_user"]: respond_to {
    	GET: =>
    		@html ->
    			form {
    				action: "/create_user",
    				method: "POST",
    				enctype: "multipart/form-data"
    			}, ->
    				p "Username: "
    				input type: "text", name: "user"
    				p "Password: "
    				input type: "password", name: "password"
    				br!
    				input type: "submit"
    	POST: =>
			user, errMsg = Users\create {
				name: @params.user
				password: @params.password
			}
			if user
				@session.id = user.id
				return redirect_to: @url_for "index"
			else
				return errMsg
    }

    [login: "/login"]: respond_to {
    	GET: =>
    		@html ->
    			form {
    				action: "/login"
    				method: "POST"
    				enctype: "multipart/form-data"
    			}, ->
    				p "Username: "
    				input type: "text", name: "user"
    				p "Password: "
    				input type: "password", name: "password"
    				br!
    				input type: "submit"
    	POST: =>
			if user = Users\find name: @params.user
				if user.password == @params.password
					@session.id = user.id
    		return redirect_to: @url_for "index"
    }

    [logout: "/logout"]: =>
    	@session.id = nil
    	return redirect_to: @url_for "index"
