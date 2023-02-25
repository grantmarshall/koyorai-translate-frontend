import os

from flask import Flask, render_template


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'koyorai.sqlite'),
    )

    if test_config is None:
        # Load from file if not in test
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Otherwise, use the test config
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Main home page of the site
    @app.route('/')
    def index():
        return render_template('home.html')

    from . import db
    db.init_app(app)

    from . import translate
    app.register_blueprint(translate.bp)

    return app
