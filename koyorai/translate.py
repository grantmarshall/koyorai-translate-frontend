from base64 import b64decode
from flask import Blueprint, render_template, request
from uuid import uuid4

from koyorai.db import get_db

bp = Blueprint('translate', __name__, url_prefix='/translate')


@bp.route('/app')
def app():
    """Retrieve the tl app frontend."""
    return render_template('translate.html')


@bp.route('/latest')
def latest():
    """Retrieve the latest translation for a given session."""
    # TODO(grantmarshall): Implement the retrieval logic for translations
    # For now, just retrieve the latest 30 sec window translation

    return {}, 200


@bp.route('/upload', methods=['POST'])
def update():
    """Endpoint to post audio data for tl or get most recent tl in session."""
    request_data = request.json
    session_id = request_data['id']
    data_type = request_data['type']
    data_size = request_data['size']
    ms_offset = request_data['timestamp']
    data = b64decode(request_data['data'])

    db = get_db()
    db.execute(
        'INSERT INTO audio_chunks'
        ' (session_id, user_ts, data_type, data_size, chunk)'
        ' VALUES (?, ?, ?, ?, ?)',
        (session_id, ms_offset, data_type, data_size, data))
    db.commit()
    print('Data received for session {}'.format(session_id))

    return {}, 200


@bp.route('/session')
def start_session():
    """Endpoint to start a tl session."""
    if request.args.get('timestamp') is None:
        return {
            'message': 'missing timestamp'
        }, 400

    session = {
        'sessionId': uuid4(),
        'sessionStartTs': request.args.get('timestamp')
    }
    db = get_db()
    db.execute('INSERT INTO translation_session (session_uuid, start_ts)'
        ' VALUES (?, ?)',
        (str(session['sessionId']), int(session['sessionStartTs'])))
    db.commit()
    print('Session {} started'.format(session['sessionId']))

    return session, 200
