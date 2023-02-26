from flask import Blueprint, render_template, request
from uuid import uuid4

bp = Blueprint('translate', __name__, url_prefix='/translate')


@bp.route('/app')
def app():
    """Retrieve the tl app frontend."""
    return render_template('translate.html')


@bp.route('/translation', methods=['GET', 'POST'])
def update():
    """Endpoint to post audio data for tl or get most recent tl in session."""
    if request.method == 'GET':
        return {}, 200
    else:
        print(request.json)
        return {}, 200


@bp.route('/session', methods=['GET'])
def start_session():
    """Endpoint to start a tl session."""
    uuid = uuid4()
    timestamp = request.args.get('timestamp')

    # TODO(grantmarshall): Implement the insertion logic for a new session

    return {
        'sessionId': uuid,
        'sessionStartTs': timestamp
    }, 200
