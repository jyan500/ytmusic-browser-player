import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    initYTMusic,
    getPlaybackURL,
    getPlaybackURLFallback,
)

home = Blueprint('home', __name__)

@home.route("/home", endpoint="get_home", methods=["GET"])
@require_authentication
def get_home():
    ytmusic = initYTMusic(request)
    home = ytmusic.get_home(limit=10)
    exclusionList = ["Shows for you", "From the community"]
    parsed = list(filter(lambda content: content["title"] not in exclusionList, home))
    return jsonify(parsed), 200

