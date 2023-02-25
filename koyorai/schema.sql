DROP TABLE IF EXISTS translation_session;
DROP TABLE IF EXISTS audio_chunks;
DROP TABLE IF EXISTS translations;

CREATE TABLE translation_session(
    id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE audio_chunks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    translation_session_id INTEGER NOT NULL,
    insert_ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_ts TIMESTAMP NOT NULL,
    FOREIGN KEY (translation_session_id) REFERENCES translation_session (id)
);

CREATE TABLE translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    translation_session_id INTEGER NOT NULL,
    audio_chunk_id INTEGER NOT NULL,
    insert_ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (translation_session_id) REFERENCES translation_session (id),
    FOREIGN KEY (audio_chunk_id) REFERENCES audio_chunks (id)
);