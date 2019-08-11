import React from 'react'
import { Redirect } from 'react-router-dom'

import {CLIENT_ID, LINK} from '../sets'


export default class Auth extends React.Component {
    constructor (props) {
        super(props)
		this.change = props.change
    }

    componentDidMount() {
        this.change('')

        window.location.href = 'https://www.wrike.com/oauth2/authorize/v4?client_id=' + CLIENT_ID + '&response_type=code&scope=Default,amReadOnlyUser,amReadWriteUser&redirect_uri=' + LINK + 'token'
    }

    render() {
        return (
            <p></p>
        )
    }
}