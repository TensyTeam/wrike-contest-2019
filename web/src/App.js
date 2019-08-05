import React from 'react';
import { BrowserRouter, Route, Switch, Redirect, browserHistory } from "react-router-dom";

import Home from './Components/Home';
import Video from './Components/Video';
import Popup from './Components/Popup';


class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
			popup: { active: false, current: null },
			redirect: { status: false, path: '/' }
        }
		this.onPopup = this.onPopup.bind(this);
		this.onRedirect = this.onRedirect.bind(this);
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
						/>
					</Route>
				</Switch>
			</BrowserRouter>
        );
    }
}

export default App;
