import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    paginate, 
    initYTMusic
)

playlists = Blueprint('playlists', __name__)

@playlists.route("/playlists", endpoint="get_playlists", methods=["GET"])
@require_authentication
def get_playlists():
    perPage = int(request.args.get("perPage")) if request.args.get("perPage") != "" else 10
    page = int(request.args.get("page")) if request.args.get("page") != "" else 1
    ytmusic = initYTMusic(request)
    playlists = ytmusic.get_library_playlists(limit=None)
    return jsonify(paginate(playlists, page, perPage)), 200

@playlists.route("/playlists/<playlistId>", endpoint="get_playlist", methods=["GET"])
@require_authentication
def get_playlist(playlistId):
    ytmusic = initYTMusic(request)
    playlistInfo = ytmusic.get_playlist(playlistId=playlistId, limit=1)
    # remove the tracks attribute
    return jsonify({k: v for k, v in playlistInfo.items() if k != "tracks"}), 200

@playlists.route("/playlists/<playlistId>/tracks", endpoint="get_playlist_tracks", methods=["GET"])
@require_authentication
def get_playlist(playlistId):
    perPage = int(request.args.get("perPage")) if request.args.get("perPage") != "" else 10
    page = int(request.args.get("page")) if request.args.get("page") != "" else 1
    ytmusic = initYTMusic(request)
    playlistInfo = ytmusic.get_playlist(playlistId=playlistId, limit=None)
    tracks = playlistInfo["tracks"]
    # remove the tracks attribute
    return jsonify(paginate(tracks, page, perPage)), 200


