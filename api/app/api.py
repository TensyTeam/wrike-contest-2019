from flask import request, jsonify
from app import app

# import json

import requests

from keys import LINK, CLIENT_ID, CLIENT_SECRET, TOKEN


# @app.route('/')
# def auth():
# 	return '<a href="https://www.wrike.com/oauth2/authorize/v4?client_id={}&response_type=code&redirect_uri={}token">Authorize</a>'.format(CLIENT_ID, LINK)

@app.route('/token')
def token():
	code = request.args.get('code')

	data = {
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET,
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': '{}token'.format(LINK),
	}

	cont = requests.post('https://www.wrike.com/oauth2/token', data=data).text

	print(cont)

	return cont # jsonify(json.loads(cont))

@app.route('/tasks')
def tasks():
	token = request.args.get('token')

	headers = {
		'Authorization': 'bearer {}'.format(token),
	}

	params = {}

	cont = requests.get('https://www.wrike.com/api/v4/tasks', headers=headers, params=params)

	return cont.text