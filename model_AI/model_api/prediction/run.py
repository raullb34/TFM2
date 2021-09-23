#!/usr/bin/python3

# See LICENSE for details.

import ssl
from flask_cors import CORS
from flask import Flask, Blueprint, redirect, request

from prediction import config
from prediction.api.v1 import api
from prediction.core import cache, limiter
from prediction.api.predict_ns import predict_ns

app = Flask(__name__)

VERSION = (1, 0)
AUTHOR = 'Raul'


def get_version():
    """
    This function returns the API version that is being used.
    """

    return '.'.join(map(str, VERSION))


__version__ = get_version()

    

namespaces = [ predict_ns ]


@app.route('/')
def register_redirection():
    """
    Redirects to dcoumentation page.
    """

    return redirect(f'{request.url_root}/{config.URL_PREFIX}', code=302)


def initialize_app(flask_app):
    """
    This function initializes the Flask Application, adds the namespace and registers the blueprint.
    """

    CORS(flask_app)

    v1 = Blueprint('api', __name__, url_prefix=config.URL_PREFIX)
    api.init_app(v1)

    limiter.exempt(v1)
    cache.init_app(flask_app)

    flask_app.register_blueprint(v1)
    flask_app.config.from_object(config)

    for ns in namespaces:
        api.add_namespace(ns)


def main():
    initialize_app(app)
    separator_str = ''.join(map(str, ["=" for i in range(175)]))
    print(separator_str)
    print(f'Debug mode: {config.DEBUG_MODE}')
    print(f'Version: {get_version()}')
    print(f'Base URL: http://localhost:{config.PORT}{config.URL_PREFIX}')
    print(separator_str)
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG_MODE)


if __name__ == '__main__':
    main()