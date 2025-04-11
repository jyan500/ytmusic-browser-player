import os
import ytmusicapi

from flask import request

from .exceptions import APIException


class AuthMiddleware:

    @staticmethod
    def is_valid_token(auth_string):
        # because the headers are already in JSON string format,
        # they can be passed directly into ytmusicapi.YTMusic without
        # going through the setup() function first, since
        # this is the accepted format
        try:
            ytmusicapi.YTMusic(auth_string) 
            return True
        except ytmusicapi.exceptions.YTMusicUserError:
            return False

    def authenticate(self):
        auth_string = request.headers.get('Authorization')

        if not auth_header or not self.is_valid_token(auth_string):
            raise APIException('Unauthorized', 401)


def require_authentication(func):
    def wrapper(*args, **kwargs):
        AuthMiddleware().authenticate()
        return func(*args, **kwargs)

    return wrapper