import ytmusicapi
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, origins=["chrome-extension://onipncecgacdedpmnaaogjhehppmekhe", "http://localhost:5000"])

@app.route("/")
def hello():
    return "Hello, Flask!"

@app.route("/authenticate", methods=["POST"])
def authenticate():
    # headers = request.json
    # ytmusicapi.setup(headers_raw=headers)
    return {
        "token": "abcd"
    }


if __name__ == "__main__":
    app.run(debug=True, port=5001)