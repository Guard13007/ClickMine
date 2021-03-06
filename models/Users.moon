import Model from require "lapis.db.model"
import trim from require "lapis.util"

class Users extends Model
	@constraints: {
		name: (value) =>
			if not value
				return "You must have a username."

			value = trim value

			if value\find "%W"
				return "Usernames can only contain alphanumeric characters."

			if Users\find name: value
				return "That username is already taken."

			lower = value\lower!
			if (lower == "admin") or (lower == "administrator") or (lower == "new") or (lower == "create")
				return "That username is already taken."
	}

    @relations: {
        {"resources", has_one: "Resources"}
    }
