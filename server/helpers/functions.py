import ytmusicapi
import json
import requests
import time
from pytubefix import YouTube
from pytubefix.cli import on_progress
import yt_dlp

"""
passes in request object, and returns authenticated YTMusic instance. 
Note that this function assumes that you have already been authenticated!
"""
def initYTMusic(request: dict):
	headers = request.headers["Authorization"]
	jsonHeaders = json.loads(headers)
	brandAccountNumber = jsonHeaders["X-Goog-PageId"] if "X-Goog-PageId" in jsonHeaders else ""
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
	yt = YouTube(url, on_progress_callback=on_progress)
	ys = yt.streams.get_audio_only()
	return ys.url

def getPlaybackURLFallback(videoId):
	URL = f"https://www.youtube.com/watch?v={videoId}"
	# URL = f"https://music.youtube.com/watch?v={videoId}"

	# ydl_opts = {
	# 	'format': 'm4a/bestaudio/best',
	# 	# ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
	# 	# 'postprocessors': [{  # Extract audio using ffmpeg
	# 	# 'key': 'FFmpegExtractAudio',
	# 	# 'preferredcodec': 'm4a',
	# 	# }]
	# }
	# speeds up execution:
	# https://www.reddit.com/r/youtubedl/comments/1eqhyk0/how_to_just_extract_download_links_with_extract/
	# https://stackoverflow.com/questions/74893626/getting-youtube-audio-stream-with-yt-dlp-not-using-pafy
	ydl_opts = {
		'extractor_args': {'youtube': {'player_client': ['tv'], "player_skip": ["webpage", "initial_data"]}},
	}
	# ydl_opts = {}

	url = ""
	availableQualities = ["high", "medium", "low"]
	filtered = []
	with yt_dlp.YoutubeDL(ydl_opts) as ydl:
		# get all information about the youtube video and ensure the response is json serializable
		info = ydl.sanitize_info(ydl.extract_info(URL, download=False))
		formats = info['formats']
		for formatObj in formats:
			if formatObj["resolution"] == "audio only" and formatObj["protocol"] == "https":
				filtered.append(formatObj)

		for filteredFormat in filtered:
			for quality in availableQualities:
				# bottleneck string comparison here, checking for substring in
				# a string that should resemble something like this: "251 - audio only (medium)"
				if quality in filteredFormat["format"]:
					# we've found the highest quality we can, break
					url = filteredFormat["url"]
					break
	if url == "":
		print(f"ERROR: Could not extract audio only URL from {URL}")

	return url
