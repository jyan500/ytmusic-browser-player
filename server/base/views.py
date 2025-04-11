from flask import jsonify, make_response
from flask.views import View


class BaseView(View):
    @staticmethod
    def get_response(data, status_code=200):
        return make_response(jsonify(data), status_code)