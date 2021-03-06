import create_table, types, add_column, drop_column, drop_table, rename_table from require "lapis.db.schema"

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

    [4]: =>
        drop_table "stuffs"

        create_table "stuffs", {
            {"id", types.serial primary_key: true}
            {"user_id", types.foreign_key unique: true}

            {"logs", types.integer default: 0}
            {"saplings", types.integer default: 0}
            {"apples", types.integer default: 0}
        }

    [5]: =>
        add_column "stuffs", "wooden_planks", types.integer default: 0
        add_column "stuffs", "crafting_tables", types.integer default: 0

    [6]: =>
        add_column "stuffs", "sticks", types.integer default: 0
        add_column "stuffs", "wooden_axes", types.integer default: 0

    [7]: =>
        rename_table "stuffs", "resources"

    [8]: =>
        add_column "resources", "wooden_pickaxes", types.integer default: 0
        add_column "resources", "wooden_shovels", types.integer default: 0
        add_column "resources", "wooden_swords", types.integer default: 0

    [9]: =>
        add_column "resources", "cobblestone", types.integer default: 0
        add_column "resources", "dirt", types.integer default: 0

    [10]: =>
        add_column "users", "digest", types.text default: "none"
        add_column "resources", "stone_axes", types.integer default: 0
        add_column "resources", "stone_pickaxes", types.integer default: 0
        add_column "resources", "stone_shovels", types.integer default: 0
        add_column "resources", "stone_swords", types.integer default: 0
        add_column "resources", "coal", types.integer default: 0

    [11]: =>
        add_column "resources", "gravel", types.integer default: 0
        add_column "resources", "flint", types.integer default: 0
        add_column "resources", "clay", types.integer default: 0
        add_column "resources", "torches", types.integer default: 0
        add_column "resources", "tree_farms", types.integer default: 0
        add_column "resources", "ideas", types.integer default: 0

    [12]: =>
        add_column "resources", "fence_posts", types.integer default: 0
        add_column "resources", "fence_gates", types.integer default: 0
}
