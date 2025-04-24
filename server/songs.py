import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    initYTMusic,
    getPlaybackURL,
)

songs = Blueprint('songs', __name__)

@songs.route("/songs/<videoId>", endpoint="get_song", methods=["GET"])
@require_authentication
def get_song(videoId):
    ytmusic = initYTMusic(request)
    song = ytmusic.get_song(videoId)
    return jsonify(song), 200

@songs.route("/songs/<videoId>/playback", endpoint="get_song_playback", methods=["GET"])
@require_authentication
def get_song_playback(videoId):
    ytmusic = initYTMusic(request)
    playbackURL = getPlaybackURL(videoId)
    return {"videoId": videoId, "playbackURL": playbackURL }, 200

    