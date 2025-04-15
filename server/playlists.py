import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    paginate, 
    initYTMusic
)

playlists = Blueprint('playlists', __name__)

@playlists.route("/playlists", methods=["GET"])
@require_authentication
def get_playlists():
    perPage = int(request.args.get("perPage")) if request.args.get("perPage") != "" else 10
    page = int(request.args.get("page")) if request.args.get("page") != "" else 1
    ytmusic = initYTMusic(request)
    playlists = ytmusic.get_library_playlists(limit=None)
    return jsonify(paginate(playlists, page, perPage)), 200
