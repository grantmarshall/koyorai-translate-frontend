from flask import Blueprint, render_template

bp = Blueprint('translate', __name__, url_prefix='/translate')


@bp.route('/app')
def app():
    """Retrieve the tl app frontend."""
    return render_template('translate.html')


@bp.route('/update', methods=['GET', 'POST'])
def update():
    """Endpoint to post audio data for tl or get most recent tl in session."""
    return {'message': 'not implemented'}, 501


@bp.route('/start_session', methods=['POST'])
def start_session():
    """Endpoint to start a tl session."""
    return {'message': 'not implemented'}, 501
