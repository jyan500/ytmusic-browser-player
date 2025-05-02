import ytmusicapi
import json
import requests
import time
from pytubefix import YouTube
from pytubefix.cli import on_progress

"""
passes in request object, and returns authenticated YTMusic instance. 
Note that this function assumes that you have already been authenticated!
"""
def initYTMusic(request: dict):
	headers = request.headers["Authorization"]
	jsonHeaders = json.loads(headers)
	brandAccountNumber = jsonHeaders["x-Goog-Pageid"] if "x-Goog-Pageid" in jsonHeaders else ""
	return ytmusicapi.YTMusic(headers, brandAccountNumber) 

"""
Takes array of dictionaries, page and perPage, and performs slicing to get the right segment for pagination
"""
def paginate(data: [dict], page: int, perPage: int) -> dict:
	totalPages = len(data) % int(perPage)
	# zero indexed, i.e if 10 per page, page 1 should return indices 0 to 9 inclusive
	start = ((page-1) * perPage)
	# end
	end = start + perPage
	data = data[start:end]
	return {
		"data": data,
		"pagination": {
			"page": page,
			"perPage": perPage,
			"totalPages": totalPages,
		}
	}

"""
Uses pytubefix to return an audio-only streaming URL
"""
def getPlaybackURL(videoId):
	url = f"https://www.youtube.com/watch?v={videoId}"
	yt = YouTube(url, client="WEB", on_progress_callback=on_progress)
	ys = yt.streams.get_audio_only()
	return ys.url
