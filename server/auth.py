from flask import Blueprint, request, jsonify
import json
import ytmusicapi

auth = Blueprint('auth', __name__)

@auth.route("/login", methods=["POST"])
def login():
    headers = request.json.get("headers")
    try:
        jsonHeaders = json.loads(headers)
        brandAccountNumber = jsonHeaders["X-Goog-PageId"] if "X-Goog-PageId" in jsonHeaders else ""
        ytmusic = ytmusicapi.YTMusic(headers, brandAccountNumber) 
        return jsonify(ytmusic.get_account_info()), 200
    except ytmusicapi.exceptions.YTMusicUserError:
        return jsonify({"errors": ["Oops! Invalid Credentials."]}), 401
