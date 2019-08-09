import React from "react"

import axios from 'axios'

import {LINK} from '../keys'


export default class Token extends React.Component {
    constructor (props) {
        super(props)
		this.state = {
            cont: '',
		}
    }

    render() {
		const code = String(document.location.search.split('=').pop())

		axios.get(LINK + 'api/token?code=' + code).then(res => { // post
			console.log(res['data']['access_token'])
			this.state.cont = res['data']['access_token']
		})

        return (
            <p>{ this.state.cont }</p>
        )
    }
}