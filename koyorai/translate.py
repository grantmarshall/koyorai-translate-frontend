from flask import Blueprint, render_template, request
from uuid import uuid4

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
    data = bytes(request_data['data'], 'utf-8')

    # TODO(grantmarshall): Implement the insertion logic for the chunk
    print({
        session_id: session_id,
        data_type: data_type,
        data_size: data_size,
        ms_offset: ms_offset,
        data: data
    })

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

    # TODO(grantmarshall): Implement the insertion logic for a new session

    return session, 200
