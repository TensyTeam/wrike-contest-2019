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

	cards(token) {
		const cont = String(document.location.search.split('=').pop())

		axios.post(LINK + 'api/cards?token=' + token, {cont: cont}).then(res => {
			console.log(res['data'])
		})
	}

	componentWillMount() {
		const token = localStorage.getItem('token')
		this.cards(token)
	}

    render() {
        return (
			<p></p>
        )
    }
}