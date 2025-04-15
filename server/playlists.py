import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication

playlists = Blueprint('playlists', __name__)

@playlists.route("/playlists", methods=["GET"])
@require_authentication
def get_playlists():
    headers = request.headers["Authorization"]
    jsonHeaders = json.loads(headers)
    brandAccountNumber = jsonHeaders["x-Goog-Pageid"] if "x-Goog-Pageid" in jsonHeaders else ""
    ytmusic = ytmusicapi.YTMusic(headers, brandAccountNumber) 
    return jsonify(ytmusic.get_library_playlists()), 200
