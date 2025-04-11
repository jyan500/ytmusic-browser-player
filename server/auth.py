from flask import Blueprint, request, jsonify
import ytmusicapi

from base.views import BaseView

auth = Blueprint('auth', __name__)

@auth.route("/login", methods=["POST"])
def login():
    headers = request.json["headers"]
    try:
        ytmusic = ytmusicapi.YTMusic(headers) 
        return jsonify(ytmusic.get_account_info()), 200
    except ytmusicapi.exceptions.YTMusicUserError:
        return jsonify({"errors": ["Oops! Invalid Credentials."]}), 401