import React from 'react'
import { Redirect } from 'react-router-dom'

import axios from 'axios'

import { LINK } from '../keys'


export default class Token extends React.Component {
    constructor (props) {
        super(props)
		this.state = {
            token: props.token,
		}
	}

	getToken() {
		const code = String(document.location.search.split('=').pop())

		axios.get(LINK + 'api/token?code=' + code).then(res => { // post
			console.log(res['data']['access_token'])
			this.setState({token: res['data']['access_token']})
		})
	}

	componentWillMount() {
		this.getToken()
	}

    render() {
        return (
            <Redirect to="/video" />
        )
    }
}