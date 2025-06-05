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

@playlists.route("/playlists/<playlistId>", endpoint="add_to_playlist", methods=["POST"])
@require_authentication
def add_to_playlist(playlistId):
    ytmusic = initYTMusic(request)
    data = request.get_json()
    if "videoIds" in data:
        ytmusic.add_playlist_items(playlistId=playlistId, videoIds=data["videoIds"])
    return jsonify({"message": "playlist item added successfully!"}), 200

@playlists.route("/playlists/<playlistId>", endpoint="remove_from_playlist", methods=["DELETE"])
@require_authentication
def remove_from_playlist(playlistId):
    ytmusic = initYTMusic(request)
    data = request.get_json()
    if "videoItems" in data:
        ytmusic.remove_playlist_items(playlistId=playlistId, videos=data["videoItems"])
    return jsonify({"message": "playlist items removed successfully!"}), 200

@playlists.route("/playlists/<playlistId>/tracks", endpoint="get_playlist_tracks", methods=["GET"])
@require_authentication
def get_playlist_tracks(playlistId):
    ytmusic = initYTMusic(request)
    playlistInfo = ytmusic.get_playlist(playlistId=playlistId, limit=None)
    tracks = playlistInfo["tracks"]
    return jsonify(tracks), 200

@playlists.route("/playlists/<playlistId>/related-tracks", endpoint="get_playlist_related_tracks", methods=["GET"])
@require_authentication
def get_playlist_related_tracks(playlistId):
    ytmusic = initYTMusic(request)
    videoId = request.args.get("videoId") if request.args.get("videoId") != "" else ""
    relatedTracks = ytmusic.get_watch_playlist(limit=25, videoId=videoId, radio=True)
    tracks = []
    if (len(relatedTracks) and "tracks" in relatedTracks):
        tracks = relatedTracks["tracks"]
    return jsonify(tracks), 200

@playlists.route("/playlists/watch-playlist", endpoint="get_watch_playlist", methods=["GET"])
@require_authentication
def get_watch_playlist():
    ytmusic = initYTMusic(request)
    videoId = request.args.get("videoId") if request.args.get("videoId") != "" else ""
    watchPlaylist = ytmusic.get_watch_playlist(limit=25, videoId=videoId, radio=True)
    # add the title "Radio" to the playlist
    watchPlaylist["title"] = "Radio"
    return jsonify(watchPlaylist), 200



