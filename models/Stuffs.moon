import Model from require "lapis.db.model"

class Stuffs extends Model
    @relations: {
        {"user", belongs_to: "Users"}
    }
