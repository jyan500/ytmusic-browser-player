import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    initYTMusic,
)

users = Blueprint('users', __name__)

@users.route("/users/<channelId>", endpoint="get_user", methods=["GET"])
@require_authentication
def get_user(channelId):
    ytmusic = initYTMusic(request)
    user = ytmusic.get_user(channelId=channelId)
    return jsonify(user), 200
