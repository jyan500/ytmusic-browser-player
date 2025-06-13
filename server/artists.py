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
    try:
        artist = ytmusic.get_artist(channelId=browseId)
        return jsonify(artist), 200
    except Exception as e:
        print(e.message())
        return jsonify({"message": "Failed to locate artist"}, 500)

@artists.route("/artists/albums/<browseId>", endpoint="get_artist_album", methods=["GET"])
@require_authentication
def get_artist_album(browseId):
    browseParams = request.args.get("params") if request.args.get("params") != "" else ""
    ytmusic = initYTMusic(request)
    artistAlbums = ytmusic.get_artist_albums(channelId=browseId, params=browseParams)
    return jsonify([]), 200

