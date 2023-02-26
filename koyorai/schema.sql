DROP TABLE IF EXISTS translation_session;
DROP TABLE IF EXISTS audio_chunks;
DROP TABLE IF EXISTS translations;

CREATE TABLE translation_session(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_uuid TEXT NOT NULL,
    start_ts TIMESTAMP NOT NULL
);

CREATE TABLE audio_chunks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    insert_ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_ts TIMESTAMP NOT NULL,
    data_type TEXT NOT NULL,
    data_size INTEGER NOT NULL,
    chunk BLOB NOT NULL,
    FOREIGN KEY (session_id) REFERENCES translation_session (id)
);

CREATE TABLE translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    audio_chunk_id INTEGER NOT NULL,
    insert_ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES translation_session (id),
    FOREIGN KEY (audio_chunk_id) REFERENCES audio_chunks (id)
);
