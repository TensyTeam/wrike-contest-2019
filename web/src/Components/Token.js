import React from "react"

import axios from 'axios'

import {LINK} from '../keys'


export default class Token extends React.Component {
    constructor (props) {
        super(props)
		this.state = {
            token: props.token,
		}
	}

	componentDidMount() {
		const code = String(document.location.search.split('=').pop())

		axios.get(LINK + 'api/token?code=' + code).then(res => { // post
			console.log(res['data']['access_token'])
			this.setState({token: res['data']['access_token']})
		})
	}

    render() {
        return (
            <p><a href="/tasks">{ this.state.token }</a></p>
        )
    }
}