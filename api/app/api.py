from flask import request, jsonify
from app import app

import requests

from sets import LINK, CODE, SECRET


@app.route('/')
def auth():
	return '<a href="https://www.wrike.com/oauth2/authorize/v4?client_id={}&response_type=code&redirect_uri={}login">Authorize</a>'.format(CODE, LINK)

@app.route('/login')
def token():
	code = request.args.get('code')

	data = {
		'client_id': CODE,
		'client_secret': SECRET,
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': LINK + 'qwe',
	}

	cont = requests.post('https://www.wrike.com/oauth2/token', data=data)

	return jsonify({'cont': cont.text})