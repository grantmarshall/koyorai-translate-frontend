import sqlite3

import click
from flask import current_app, g
import io
import soundfile as sf


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


@click.command('write-session')
@click.argument('id', nargs=1)
def write_session_command(id):
    db = get_db()
    chunks = [bytes(chunk['chunk']) for chunk in db.execute(
        'SELECT c.chunk AS chunk FROM audio_chunks c'
        ' WHERE c.session_id = ?'
        ' ORDER BY c.user_ts ASC',
        (id, )
    ).fetchall()]
    print('Found {} chunks in session {}'.format(len(chunks), id))
    data, samplerate = sf.read(io.BytesIO(b''.join(chunks)))
    outfile = '{}.ogg'.format(id)
    sf.write(outfile, data, samplerate)
    click.echo('Wrote out session {} to file {}'.format(id, outfile))


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(write_session_command)
