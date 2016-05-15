exports.up = function(db, callback) {
  db.createTable("events", {
    event_id: { type: "int", primaryKey: true, autoIncrement: true },
    title: { type: "text", notNull: true },
    place: { type: "text" },
    start_time: { type: "timestamptz", notNull: true },
    end_time: { type: "timestamptz" },
    category: { type: "text", notNull: true },
    attributes: { type: "jsonb" },
    scraped_from: { type: "text", notNull: true }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("events", callback);
};
