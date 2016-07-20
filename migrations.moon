import create_table, types, add_column, drop_column from require "lapis.db.schema"

{
	[1]: =>
		create_table "users", {
			{"id", types.serial primary_key: true}
			{"name", types.text unique: true}
			{"password", types.text}
		}

    [2]: =>
        add_column "users", "logs", types.integer
        add_column "users", "saplings", types.integer
        add_column "users", "apples", types.integer

    [3]: =>
        drop_column "users", "logs"
        drop_column "users", "saplings"
        drop_column "users", "apples"

        create_table "stuffs", {
            {"id", types.serial primary_key: true}
            {"user_id", types.foreign_key unique: true}

            {"logs", types.integer}
            {"saplings", types.integer}
            {"apples", types.integer}
        }
}
