import React from 'react'
import { Redirect } from 'react-router-dom'

import axios from 'axios'

import { LINK } from '../sets'


export default class Token extends React.Component {
    constructor (props) {
        super(props)
		this.state = {
			token: props.token,
		}
		this.change = props.change
		this.room = localStorage.getItem('room')
		this.workspace = localStorage.getItem('workspace')
		this.user = localStorage.getItem('user')
		this.type = localStorage.getItem('type')
		this.link = '/video/' + this.room + '/' + this.type + '?workspace=' + this.workspace + '&user=' + this.user
	}

	getToken() {
		const code = String(document.location.search.split('=').pop())

		axios.get(LINK + 'api/token?code=' + code).then(res => { // post
			console.log(res['data']['access_token'])
			this.change(res['data']['access_token'])
			// this.setState({token: res['data']['access_token']})
		})
	}

	componentWillMount() {
		// const room = localStorage.getItem('room')
		// const workspace = localStorage.getItem('workspace')
		// const user = localStorage.getItem('user')

		this.getToken()
	}

    render() {
        return (
			<p>
				{ this.state.token != '' && <Redirect to={ this.link } /> }
			</p>
        )
    }
}