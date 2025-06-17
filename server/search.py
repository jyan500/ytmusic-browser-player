import json
from flask import Blueprint, request, jsonify
import ytmusicapi
from base.auth_middleware import require_authentication
from helpers.functions import (
    initYTMusic,
    getPlaybackURL,
    getPlaybackURLFallback,
)

search = Blueprint('search', __name__)

@search.route("/search", endpoint="get_search_results", methods=["GET"])
@require_authentication
def get_search_results():
    searchParam = request.args.get("search")
    ytmusic = initYTMusic(request)
    results = ytmusic.search(query=searchParam)
    return jsonify(results), 200

@search.route("/search/suggestions", endpoint="get_search_suggestions", methods=["GET"])
@require_authentication
def get_search_suggestions():
    searchParam = request.args.get("search")
    ytmusic = initYTMusic(request)
    results = ytmusic.get_search_suggestions(query=searchParam, detailed_runs=True)
    return jsonify(results)
