import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    initYTMusic,
)

artists = Blueprint('artists', __name__)

@artists.route("/artists/<browseId>", endpoint="get_artist", methods=["GET"])
@require_authentication
def get_artist(browseId):
    ytmusic = initYTMusic(request)
    artist = ytmusic.get_artist(browseId)
    return jsonify(artist), 200

