from auth import auth

class Router:
    def __init__(self, app):
        self.app = app
        self.app.register_blueprint(auth)
        
