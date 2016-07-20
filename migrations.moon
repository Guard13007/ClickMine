import create_table, types, add_column from require "lapis.db.schema"

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
}
