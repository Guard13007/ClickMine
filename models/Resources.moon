import Model from require "lapis.db.model"

class Resources extends Model
    @relations: {
        {"user", belongs_to: "Users"}
    }
