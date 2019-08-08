import React from "react";

import {CLIENT_ID, LINK} from '../keys'


export default class Auth extends React.Component {
    render() {
        return (
            <a href={ 'https://www.wrike.com/oauth2/authorize/v4?client_id=' + CLIENT_ID + '&response_type=code&redirect_uri=' + LINK + 'token' }>
				Authorize
			</a>
        );
    }
};
