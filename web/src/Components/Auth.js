import React from 'react'
import { Redirect } from 'react-router-dom'

import {CLIENT_ID, LINK} from '../keys'


export default class Auth extends React.Component {
    componentDidMount() {
        window.location.href = 'https://www.wrike.com/oauth2/authorize/v4?client_id=' + CLIENT_ID + '&response_type=code&redirect_uri=' + LINK + 'token'
    }

    render() {
        return (
            <p></p>
        )
    }
}