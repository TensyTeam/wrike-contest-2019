from flask import request, jsonify
from app import app

import requests

from keys import LINK, CLIENT_ID, CLIENT_SECRET, TOKEN


@app.route('/')
def auth():
	return '<a href="https://www.wrike.com/oauth2/authorize/v4?client_id={}&response_type=code&redirect_uri={}login">Authorize</a>'.format(CLIENT_ID, LINK)

@app.route('/login')
def token():
	code = request.args.get('code')

	data = {
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET,
		'grant_type': 'authorization_code',
		'code': code,
	}

	cont = requests.post('https://www.wrike.com/oauth2/token', data=data)

	return cont.text

@app.route('/tasks')
def tasks():
	headers = {
		'Authorization': 'bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjI0OTg5MzIsXCJpXCI6NjQ0ODQxNyxcImNcIjo0NjEzMDA2LFwidVwiOjY0Mzc4MzIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NjUxOTAxMTN9.wZA1aP04twbWNKcsYkdhZvNdBHnwLcYpIFj8VCNx-B4',
	}

	params = {}

	cont = requests.get('https://www.wrike.com/api/v4/tasks', headers=headers, params=params)

	return cont.text