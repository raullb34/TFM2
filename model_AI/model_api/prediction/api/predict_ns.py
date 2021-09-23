#!/usr/bin/python3

# See LICENSE for details.
import os
import flask
import datetime
import pandas as pd
import pickle
from flask_restx import Resource
from flask import jsonify

from prediction.run import api
from prediction.core import cache, limiter
from prediction.utils import handle400error, handle404error, handle500error
from prediction.api.prediction_models import fake_model, fake_model_payload
from prediction.model.predict_model import PredictModel

predict_ns = api.namespace('predict-fake-news', description='Provides warehouse information')
predict_model = PredictModel()

@predict_ns.route('/predicts')
class Prediction(Resource):
    @api.expect(fake_model_payload)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.marshal_with(fake_model, code=200, description='OK', as_list=True)
    @limiter.limit('fake_model/hour') 
    def post(self):
        """
        Generates a fake report for news passed.
        """

        # retrieve arguments
        try:
            obj = flask.request.get_json()
        except:
            return handle400error(predict_ns, 'The providen arguments are not correct. Please, check the swagger documentation at /v1')

        # check arguments
        if 'text' not in obj:
            return handle400error(predict_ns, 'No text present in request.')
        text = obj['text']

        base_result = predict_model.predict(text)
        result = base_result[0][0]
        print("result", result)
        fake_return = {
            'fake': result
        }
        return fake_return
