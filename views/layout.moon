html = require "lapis.html"

class extends html.Widget
    content: =>
        html_5 ->
            head ->
                title @title or "ClickMine"
                link rel: "stylesheet", href: @build_url "static/css/game.css"
                script src: @build_url "static/js/jquery-3.1.0.min.js"
            body ->
                @content_for "inner"
