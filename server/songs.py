import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    initYTMusic,
    getPlaybackURL,
    getPlaybackURLFallback,
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
    try:
        playbackURL = getPlaybackURL(videoId)
        return {"videoId": videoId, "playbackURL": playbackURL }, 200
    except:
        print("Initial playback attempt failed. Attempting fallback.")
    try:
        playbackURL = getPlaybackURLFallback(videoId)
        return {"videoId": videoId, "playbackURL": playbackURL }, 200
    except:
        return jsonify({"message": "There was an error getting playback"}), 500

@songs.route("/songs/<videoId>/related-tracks", endpoint="get_song_related_tracks", methods=["GET"])
@require_authentication
def get_song_related_tracks(videoId):
    ytmusic = initYTMusic(request)
    relatedTracks = ytmusic.get_watch_playlist(limit=25, videoId=videoId, radio=True)
    tracks = []
    if (len(relatedTracks) and "tracks" in relatedTracks):
        tracks = relatedTracks["tracks"]
    return jsonify(tracks), 200

