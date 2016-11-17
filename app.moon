lapis = require "lapis"
config = require("lapis.config").get!
bcrypt = require "bcrypt"

import respond_to, json_params from require "lapis.application"

Users = require "models.Users"
Resources = require "models.Resources"

class extends lapis.Application
    layout: "layout"

    @include "githook/githook"

    [get: "/get"]: respond_to {
        GET: =>
            return status: 405, "Method not allowed"

        POST: json_params =>
            if @params.request == "resources"
                if user = Users\find id: @session.id
                    resources = user\get_resources!

                    unless resources
                        resources = Resources\create {
                            user_id: user.id
                        }

                    resources.id = nil
                    resources.user_id = nil
                    return json: resources

            return json: { status: "invalid request" }, status: 400
    }

    [update: "/update"]: respond_to {
        GET: =>
            return status: 405, "Method not allowed"

        POST: json_params =>
            if @params.request == "resources"
                if user = Users\find id: @session.id
                    resources = user\get_resources!
                    resources\update @params.resources
                    return json: { status: "success" }

            return json: { status: "server failure" }, status: 500
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
            ul ->
                li "news..."
                li "v1.2.2 - more time required for certain actions, no more jumpy links"
                li "v1.2.1 - make fence posts and fence gates actually able to be crafted (whoops!)"
                li "v1.2 - actions require time to execute now, can think of things to build, stuff to be found while digging"
                li "v1.1 - now has version numbers and coal, merry christmas"

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
                    input type: "submit", value: "submit"

        POST: =>
            user, errMsg = Users\create {
                name: @params.user
                password: ""
                digest: bcrypt.digest @params.password, 10
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
                    input type: "submit", value: "submit"

        POST: =>
            if user = Users\find name: @params.user
                if bcrypt.verify @params.password, user.digest
                    @session.id = user.id
                elseif user.digest == "none" and user.password == @params.password
                    user\update {
                        password: "none"
                        digest: bcrypt.digest @params.password, 10
                    }
                    @session.id = user.id
            return redirect_to: @url_for "index"
    }

    [logout: "/logout"]: =>
        @session.id = nil
        return redirect_to: @url_for "index"
