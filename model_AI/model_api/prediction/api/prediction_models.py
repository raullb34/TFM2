#!/usr/bin/python3

# See LICENSE for details.

from flask_restx import fields
from prediction.run import api

fake_model_payload = api.model('News', {
    'text':
    fields.String(
        dexscription='news text',
        example='Lorem ipsum',
        required=False,
        default=None),
}, description = 'body text news')

fake_model = api.model('Predict', {
    'fake':
    fields.Float(
        dexscription='fake percentage',
        example=10,
        required=False,
        default=None),
},
description='fake status information')

