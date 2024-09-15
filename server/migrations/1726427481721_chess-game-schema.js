/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Users table
  pgm.createTable("users", {
    user_id: "id",
    username: { type: "varchar(50)", notNull: true, unique: true },
    email: { type: "varchar(100)", notNull: true, unique: true },
    password_hash: { type: "varchar(255)", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Games table
  pgm.createTable("games", {
    game_id: "id",
    white_player_id: {
      type: "integer",
      references: '"users"',
      onDelete: "set null",
    },
    black_player_id: {
      type: "integer",
      references: '"users"',
      onDelete: "set null",
    },
    start_time: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    end_time: "timestamp",
    status: { type: "varchar(20)", notNull: true },
    result: "varchar(20)",
    white_timer: "integer",
    black_timer: "integer",
  });

  // Game Histories table
  pgm.createTable("game_histories", {
    history_id: "id",
    game_id: {
      type: "integer",
      notNull: true,
      references: '"games"',
      onDelete: "cascade",
    },
    move_number: { type: "integer", notNull: true },
    from_square: { type: "integer", notNull: true },
    to_square: { type: "integer", notNull: true },
    piece: { type: "varchar(10)", notNull: true },
    captured_piece: "varchar(10)",
    is_check: { type: "boolean", notNull: true },
    is_checkmate: { type: "boolean", notNull: true },
    is_castling: { type: "boolean", notNull: true },
    is_promotion: { type: "boolean", notNull: true },
    promoted_to: "varchar(10)",
    board_state: { type: "jsonb", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Create indexes
  pgm.createIndex("games", "white_player_id");
  pgm.createIndex("games", "black_player_id");
  pgm.createIndex("game_histories", "game_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop indexes
  pgm.dropIndex("game_histories", "game_id");
  pgm.dropIndex("games", "black_player_id");
  pgm.dropIndex("games", "white_player_id");

  // Drop tables
  pgm.dropTable("game_histories");
  pgm.dropTable("games");
  pgm.dropTable("users");
};
