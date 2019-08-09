import React from "react"

import axios from 'axios'

// import {CLIENT_ID, CLIENT_SECRET} from '../keys'


export default class Token extends React.Component {
    constructor (props) {
        super(props)
		this.state = {
            cont: '',
		}
    }

    render() {
		const code = String(document.location.search.split('=').pop())

		axios.post(LINK + 'api/token?code=' + code).then((res) => {
			this.state.cont = res
		})

		// const data = {
		// 	'client_id': CLIENT_ID,
		// 	'client_secret': CLIENT_SECRET,
		// 	'grant_type': 'authorization_code',
		// 	'code': code,
		// }

		// axios.post('https://www.wrike.com/oauth2/token', data).then((res) => {this.state.cont = res})

        return (
            <p>{ this.state.cont }</p>
        )
    }
}