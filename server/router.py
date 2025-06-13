from auth import auth
from playlists import playlists
from songs import songs
from home import home
from albums import albums
from artists import artists
from users import users

class Router:
    def __init__(self, app):
        self.app = app
        self.app.register_blueprint(auth)
        self.app.register_blueprint(playlists)
        self.app.register_blueprint(songs)
        self.app.register_blueprint(home)
        self.app.register_blueprint(albums)
        self.app.register_blueprint(artists)
        self.app.register_blueprint(users)
