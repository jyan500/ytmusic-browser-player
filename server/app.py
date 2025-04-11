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


# @app.route("/")
# def hello():
#     return "Hello, Flask!"

# @app.route("/authenticate", methods=["POST"])
# def authenticate():
#     headers = request.json["headers"]
#     try:
#         ytmusic = ytmusicapi.YTMusic(headers) 
#         return jsonify(ytmusic.get_account_info()), 200
#     except ytmusicapi.exceptions.YTMusicUserError:
#         return jsonify({
#             errors: ["Oops! Invalid Credentials. Make sure you're logged into music.youtube.com"]
#         }), 401


if __name__ == "__main__":
    app.run(debug=True, port=5001)