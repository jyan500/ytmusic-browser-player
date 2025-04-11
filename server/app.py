import ytmusicapi
import json
from base.errorhandler import ErrorHandler
from flask import Flask
from flask_cors import CORS
from router import Router

# using https://github.com/theydvgaurav/flask-auth-middleware
app = Flask(__name__)
CORS(app)
Router(app)
ErrorHandler(app)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
    