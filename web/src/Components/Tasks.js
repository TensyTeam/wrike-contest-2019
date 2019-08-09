import React from "react"

import axios from 'axios'

import {TOKEN} from '../keys'


export default class Token extends React.Component {
    constructor (props) {
        super(props)
		this.state = {
            cont: '',
		}
    }

    render() {
        axios.post(LINK + 'api/tasks').then((res) => {
			this.state.cont = res
        })

		// const headers = {
		// 	Authorization: 'bearer ' + TOKEN,
		// }

		// axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}` 
		// axios.get('https://www.wrike.com/api/v4/tasks', {headers: headers}).then((res) => {this.state.cont = res})

        return (
            <p>{ this.state.cont }</p>
        )
    }
}