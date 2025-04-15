import ytmusicapi
import json

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