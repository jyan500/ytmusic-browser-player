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
    return jsonify(playlists), 200

@playlists.route("/playlists/<playlistId>", endpoint="get_playlist", methods=["GET"])
@require_authentication
def get_playlist(playlistId):
    ytmusic = initYTMusic(request)
    playlistInfo = ytmusic.get_playlist(playlistId=playlistId, limit=1)
    # remove the tracks attribute
    return jsonify({k: v for k, v in playlistInfo.items() if k != "tracks"}), 200

@playlists.route("/playlists/<playlistId>/tracks", endpoint="get_playlist_tracks", methods=["GET"])
@require_authentication
def get_playlist_tracks(playlistId):
    perPage = int(request.args.get("perPage")) if request.args.get("perPage") != "" else 10
    page = int(request.args.get("page")) if request.args.get("page") != "" else 1
    ytmusic = initYTMusic(request)
    playlistInfo = ytmusic.get_playlist(playlistId=playlistId, limit=None)
    tracks = playlistInfo["tracks"]
    return jsonify(tracks), 200

@playlists.route("/playlists/<playlistId>/related-tracks", endpoint="get_playlist_related_tracks", methods=["GET"])
@require_authentication
def get_playlist_related_tracks(playlistId):
    ytmusic = initYTMusic(request)
    watchPlaylist = ytmusic.get_watch_playlist(playlistId=playlistId)
    result = []
    if len(watchPlaylist) > 0 and "related" in watchPlaylist:
        browseId = watchPlaylist["related"] 
        result = ytmusic.get_song_related(browseId)
    return jsonify(result, 200)


