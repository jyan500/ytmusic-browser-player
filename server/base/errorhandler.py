from flask import jsonify
from .exceptions import APIException
import ytmusicapi
import re
from helpers.constants import ERROR_CODE_REGEX

class ErrorHandler:
    def __init__(self, app):
        app = app

        @app.errorhandler(APIException)
        def handle_exception(error):
            response = jsonify(error.to_dict())
            response.status_code = error.status_code
            return response

        # NEW: Handle YTMusicUserError explicitly
        @app.errorhandler(ytmusicapi.exceptions.YTMusicUserError)
        def handle_ytmusic_user_error(error):
            response = jsonify({
                "error": "YTMusic User Error",
                "message": str(error)
            })
            # parse for error code
            matches = re.findall(ERROR_CODE_REGEX, str(error))
            response.status_code = int(matches[0])  # or another appropriate code
            return response

         # NEW: Handle YTMusicUserError explicitly
        @app.errorhandler(ytmusicapi.exceptions.YTMusicServerError)
        def handle_ytmusic_server_error(error):
            response = jsonify({
                "error": "YTMusic Server Error",
                "message": str(error)
            })
            matches = re.findall(ERROR_CODE_REGEX, str(error))
            response.status_code = int(matches[0])  
            return response

        # Optional: Catch-all fallback
        @app.errorhandler(Exception)
        def handle_unexpected_error(error):
            response = jsonify({
                "error": "Internal Server Error",
                "message": str(error)
            })
            response.status_code = 500
            return response
