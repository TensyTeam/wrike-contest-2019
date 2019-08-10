import React from "react"

import axios from 'axios'

import {LINK, TOKEN} from '../keys'


export default class Token extends React.Component {
    constructor (props) {
        super(props)
		this.state = {
            token: props.token,
            cont: '',
		}
    }

    componentDidMount() {
        console.log('GET TASKS')

        axios.get(LINK + 'api/tasks?token=' + this.state.token).then((res) => {
            console.log(res['data']['data'])
            this.setState({tasks: res['data']['data']})
        })
    }

    render() {

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