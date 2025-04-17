from auth import auth
from playlists import playlists

class Router:
    def __init__(self, app):
        self.app = app
        self.app.register_blueprint(auth)
        self.app.register_blueprint(playlists)
