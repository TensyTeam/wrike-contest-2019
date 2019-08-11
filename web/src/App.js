import React from 'react';
import { BrowserRouter, Route, Switch, Redirect, browserHistory } from "react-router-dom";

import Home from './Components/Home';
import Video from './Components/Video';
import Popup from './Components/Popup';
import Auth from './Components/Auth';
import Token from './Components/Token';


class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
			popup: { active: false, current: null },
			redirect: { status: false, path: '/' },
			token: '',
        }
		this.onPopup = this.onPopup.bind(this);
		this.onRedirect = this.onRedirect.bind(this);
	}

	componentWillMount() {
		if (localStorage.getItem('token') !== null) {
			this.setState({ token: localStorage.getItem('token') });
		} else {
			localStorage.setItem('token', '');
		}
	}

    componentDidMount() {
        console.log(1);
	}

    onPopup(_active, _current) {
		this.setState({ popup: { active: _active, current: _current } });
	}

    onRedirect(_path) {
        this.setState({ redirect: { status: true, path: _path } });
	}

	changeToken(cont) {
		localStorage.setItem('token', cont);
		this.setState({ token: cont });
	}

    render() {
        return (
            <BrowserRouter>
				{this.state.popup.active &&
					<Popup
                        popup={this.state.popup}
						onPopup={this.onPopup}
						onRedirect={this.onRedirect}
					/>
				}
				<Switch>
					{this.state.redirect.status === true &&
						<React.Fragment>
							<Redirect to={ this.state.redirect.path }/>
							{this.setState({ redirect: { status: false, path: this.state.redirect.path } })}
						</React.Fragment>
					}
					<Route exact path="/">
						<Home
                            popup={this.state.popup}
							onPopup={this.onPopup}
							onRedirect={this.onRedirect}
						/>
					</Route>
					<Route path="/video">
						<Video
                            popup={this.state.popup}
							onPopup={this.onPopup}
							onRedirect={this.onRedirect}
							token={this.state.token}
						/>
					</Route>
					<Route path="/auth">
						<Auth
							change={this.changeToken}
						/>
					</Route>
					<Route path="/token">
						<Token
							token={ this.state.token }
							change={this.changeToken}
						/>
					</Route>
				</Switch>
			</BrowserRouter>
        );
    }
}

export default App;
