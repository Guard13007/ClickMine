lapis = require "lapis"

import respond_to, json_params from require "lapis.application"

Users = require "models.Users"
Stuffs = require "models.Stuffs"

class extends lapis.Application
    layout: "layout"

	[githook: "/githook"]: respond_to {
        GET: =>
            return status: 405 --Method Not Allowed

        POST: json_params =>
            if @params.ref == nil
                return { json: { status: "invalid request" } }, status: 400 --Bad Request

            if @params.ref == "refs/heads/master"
                os.execute "echo \"Updating server...\" >> logs/updates.log"
                result = 0 == os.execute "git pull origin >> logs/updates.log"
                result and= 0 == os.execute "moonc . 2>> logs/updates.log"
                result and= 0 == os.execute "lapis migrate production >> logs/updates.log"
                result and= 0 == os.execute "lapis build production >> logs/updates.log"
                if result
                    return { json: { status: "successful", message: "server updated to latest version" } }
                else
                    return { json: { status: "failure", message: "check logs/updates.log"} }, status: 500 --Internal Server Error
            else
                return { json: { status: "successful", message: "ignored non-master push" } }
    }

    [get: "/get"]: respond_to {
        GET: =>
            return status: 404
        POST: json_params =>
            if @params.request == "stuff"
                user = Users\find id: @session.id
                stuff = user\get_stuff!

                unless stuff
                    stuff = Stuffs\create {
                        user_id: user.id
                    }

                stuff.id = nil
                stuff.user_id = nil
                return json: stuff
    }

    [update: "/update"]: respond_to {
        GET: =>
            return status: 404
        POST: json_params =>
            if @params.request == "stuff"
                user = Users\find id: @session.id
                stuff = user\get_stuff!
                stuff\update @params.stuff
                return json: { status: "success" }
    }

    [index: "/"]: =>
    	@html ->
            if @session.id
                script src: @build_url "static/js/game.js"
                ul id: "do", ->
                    li "do..."
                ul id: "have", ->
                    li "you have..."
    		ul id: "account", ->
                li "account..."
	    		if @session.id
	    			li ->
	    				a href: @url_for("logout"), "log out"
	    		else
		    		li ->
    		    		a href: @url_for("create_user"), "make account"
    				li ->
    					a href: @url_for("login"), "log in"

    [create_user: "/create_user"]: respond_to {
    	GET: =>
    		@html ->
    			form {
    				action: "/create_user",
    				method: "POST",
    				enctype: "multipart/form-data"
    			}, ->
    				p "username: "
    				input type: "text", name: "user"
    				p "password: "
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
    				p "username: "
    				input type: "text", name: "user"
    				p "password: "
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
