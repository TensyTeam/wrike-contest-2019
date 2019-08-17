import React from "react";


class Choose extends React.Component {
    constructor (props) {
        super(props);
		this.state = {
			users: [],
            room: '',
            workspace: ''
		};
	};

	componentWillMount() {
        let usersTemp = [];
        const users = document.location.search.split('&')[1].substr(6);
        const length = users.split('*').length;
        for (let m = 0; m < length; m += 1) {
            usersTemp.push(users.split('*')[m]);
        }
        this.setState({ users: usersTemp });
        // room & workspace
        const roomTemp = document.location.pathname.split('/')[2];
        const workspaceTemp = document.location.search.split('&')[0].split('=').pop();
        this.setState({ room: roomTemp, workspace: workspaceTemp });
	}

    render() {
        return (
            <div className="choose">
                <div className="title gradient gradient_cold">{this.state.workspace}</div>
                {this.state.users.map((user) =>
                    <a href={"https://tensyteam.ru/video/" + this.state.room + "/request?workspace=" + this.state.workspace + "&user=" + user} className="user_block" key={user}>
                        {user}
                    </a>
                )}
            </div>
        );
    }
};

export default Choose;
