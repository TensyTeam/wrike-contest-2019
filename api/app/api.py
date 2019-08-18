from flask import request, jsonify
from app import app

import json

import requests

from keys import LINK, CLIENT_ID, CLIENT_SECRET


def users(ids, token):
	if type(ids) == str:
		ids = [ids]
	
	#

	users = []

	#

	headers = {
		'Authorization': 'bearer {}'.format(token),
	}

	for id_ in ids:
		response = json.loads(requests.get('https://www.wrike.com/api/v4/users/{}'.format(id_), headers=headers).text)['data'][0]
		
		users.append({
			'id': id_,
			'name': response['firstName'],
			'surname': response['lastName'],
			'avatar': response['avatarUrl'],
		})
	
	return users


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

	params = {} # {
	# 	'fields': ['sharedIds'],
	# }

	cont = requests.get('https://www.wrike.com/api/v4/tasks?fields=["description","responsibleIds"]', headers=headers, params=params)

	response = json.loads(cont.text)

	tasks = []

	for task in response['data']:
		tasks.append({
			'id': task['id'],
			'name': task['title'],
			'cont': task['description'],
			# 'author': users(task['accountId'], token),
			'users': users(task['responsibleIds'], token),
			'status': task['status'],
			'time': task['dates'],
			'link': task['permalink'],
		})

	return jsonify(tasks[::-1])

@app.route('/cards', methods=['POST'])
def cards():
	token = request.args.get('token')
	x = request.json

	headers = {
		'Authorization': 'bearer {}'.format(token),
	}

	#

	params = {}

	if 'name' in x:
		params['title'] = x['name']

	if 'cont' in x:
		params['description'] = x['cont']

	if 'status' in x:
		params['status'] = x['status']

	#

	cont = requests.put('https://www.wrike.com/api/v4/tasks/{}'.format(x['id']), headers=headers, params=params)

	return cont.text

@app.route('/create', methods=['POST'])
def create():
	token = request.args.get('token')
	x = request.json

	headers = {
		'Authorization': 'bearer {}'.format(token),
	}

	# Определить папку

	folders = json.loads(requests.get('https://www.wrike.com/api/v4/folders', headers=headers).text)['data']

	for folder in folders:
		if folder['title'] == x['id']:
			x['id'] = folder['id']

	print('-{}-{}'.format(x['user'], x['id']))

	# Параметры

	params = {}

	if 'name' in x:
		params['title'] = x['name']

	if 'cont' in x:
		params['description'] = x['cont']

	if 'status' in x:
		params['status'] = x['status']

	if x['user']:
		params['responsibles'] = json.dumps([x['user']])

	#

	lin = 'https://www.wrike.com/api/v4/folders/{}/tasks'.format(x['id'])

	print(lin, params)

	cont = requests.post(lin, headers=headers, data=params)

	print(cont.text)

	cont_id = json.loads(cont.text)['data'][0]['id']

	return cont_id

@app.route('/delete', methods=['POST'])
def delete():
	token = request.args.get('token')
	x = request.json

	headers = {
		'Authorization': 'bearer {}'.format(token),
	}

	#

	params = {
		'removeResponsibles': json.dumps([x['user']]),
	}

	lin = 'https://www.wrike.com/api/v4/tasks/{}'.format(x['id'])

	cont = requests.put(lin, headers=headers, data=params)

	return cont.text

# @app.route('/i', methods=['POST'])
# def i():
# 	token = request.args.get('token')

# 	headers = {
# 		'Authorization': 'bearer {}'.format(token),
# 	}

# 	cont = json.loads(requests.get('https://www.wrike.com/api/v4/account', headers=headers).text)

# 	print(cont)

# 	return cont['data'][0]['id']