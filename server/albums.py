import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    initYTMusic,
)

albums = Blueprint('albums', __name__)

@albums.route("/albums/<browseId>", endpoint="get_album", methods=["GET"])
@require_authentication
def get_album(browseId):
    ytmusic = initYTMusic(request)
    album = ytmusic.get_album(browseId)
    return jsonify(album), 200

