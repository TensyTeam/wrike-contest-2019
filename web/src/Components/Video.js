import React from 'react'

import openSocket from 'socket.io-client'
import $ from 'jquery'
import axios from 'axios'

import { LINK } from '../sets'


class Video extends React.Component {
    constructor (props) {
		super(props)
		this.state = {
            position: null,
			responce: [],
            room: null,
            token: props.token,
            tasks: [],
            host: null,
            socket_io: null,
            // user: null,
		}
		this.onStart = this.onStart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createCard = this.createCard.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.editTitle = this.editTitle.bind(this);
	}

	componentWillMount() {
        let namespace = 'space'
        let link = 'https://tensyteam.ru/'
        const socket_io = openSocket(link + namespace)
        this.setState({socket_io})

        this.onStart();
    }

    componentDidMount() {
        const token = localStorage.getItem('token')

        const room = document.location.pathname.split('/')[document.location.pathname.split('/').length - 2]
        const workspace = document.location.search.split('&')[0].split('=').pop()
        const user = document.location.search.split('=').pop()
        const type = document.location.pathname.split('/').pop()

        console.log('Token: ', token);

        localStorage.setItem('room', room)
        localStorage.setItem('workspace', workspace)
        localStorage.setItem('user', user)
        localStorage.setItem('type', type)
        localStorage.setItem('current', null)

        if (token == '') {
            window.location.href = LINK + 'auth'
        } else {
            this.getTasks(token)
        }

        // let socket_io = this.state.socket_io

        // let _position = document.location.pathname.split('/').pop();

        // if (_position === 'answer') {
        //     axios.post(LINK + 'api/i?token=' + token).then(res => {
        //         // if ('error' in res['data'] && res['data']['error'] == 'not_authorized') {
        //         //     window.location.href = LINK + 'auth'
        //         // }
        //
        //         console.log(res['data'])
        //
        //         socket_io.emit('i', {id: res['data']})
        //         this.setState({user: res['data']})
        //     })
        // } else {
        //     socket_io.on('i', function(mes) {
        //         console.log(mes['id'])
        //         // this.setState({user: mes['id']})
        //         localStorage.setItem('current', mes['id'])
        //     })
        // }
    }

    getTasks(token) {
        (async() => {
            let apiRes = null;
            try {
                apiRes = await axios.get(LINK + 'api/tasks?token=' + token).then((res) => {
                    let _tasks = res['data'];
                    let _tasks_filter = [];
                    let _current = null;
                    for(let m = 0; m < _tasks.length; m++) {
                        for(let i = 0; i < _tasks[m].users.length; i++) {
                            let _name_surname = (_tasks[m].users[i].name + _tasks[m].users[i].surname).replace(/\s/g, '').toLowerCase();
                            if(_name_surname === localStorage.getItem('user')) {
                                _tasks_filter.push(_tasks[m]);
                                _current = _tasks[m].users[i].id;
                            }
                        }
                    }
                    localStorage.setItem('current', _current)
                    this.setState({ tasks: _tasks_filter })
                });
            } catch (err) {
                console.log('%cOutdated', 'background: #e74c3c; color: #fff; padding: 5px; margin: 2px; border-radius: 4px');
            }
        })();
    }

    handleChange(_e, _id) {
        document.getElementById(_id).style.display='flex';
        let _status = _e.target.value;
        let _token = localStorage.getItem('token');
        this.editTask(_token, _id, {status: _status});
    }

    editTask(token, id, json) {
        json['id'] = id

        axios.post(LINK + 'api/cards?token=' + token, json).then(res => {
            console.log(res['data']);
            document.getElementById(id).style.display='none';
        })
    }

	createTask(token, folder, json) {
        json['id'] = folder
        json['user'] = localStorage.getItem('current') // this.state.user

		axios.post(LINK + 'api/create?token=' + token, json).then(res => {
            console.log(res['data'])

            const token = localStorage.getItem('token')
            this.getTasks(token)
		})
	}

    createCard() {
        console.log('Create')
        const token = localStorage.getItem('token')
        let _name = document.getElementById('create_card').value
        let _id_folder = 'Tensy' // !
        this.createTask(token, _id_folder, { name: _name, status: 'Active' })
    }

    deleteUser(_id) {
        console.log('Delete', _id)
    }

    editTitle(_title) {
        this.props.onPopup(true, 'edit');
        setTimeout(function() {
            document.getElementById('edit_title').value = _title;
        }, 1000);
    }

    onStart() {
        let _position = document.location.pathname.split('/').pop();
        let _room = document.location.pathname.split('/')[document.location.pathname.split('/').length - 2];
        console.log('%c' +_position + ' ' + _room, 'background: #2ecc71; color: #fff; padding: 5px; margin: 2px; border-radius: 4px');
        this.setState({ position: _position, room: _room });
        // WebRTC

        // const socket_io = this.state.socket_io
        let namespace = 'space'
        let link = 'https://tensyteam.ru/'
        const socket_io = openSocket(link + namespace)

        const stun = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
        const peer = new RTCPeerConnection(stun);

        let yourDescription;
        let otherDescription;
        let yourCandidate;
        let newCandidate;
        let candidatee;
        let room;

        function addcandidate(_data, _room, _type) {
            console.log(_type, _room, _data);

            setTimeout(function() {
                if (candidatee) {
                    console.log('CONNECT', candidatee);
                    document.getElementById('connect').classList.remove('fa-error');
                    document.getElementById('connect').classList.add('fa-success');
                    // sound
                    let audio = new Audio();
                    audio.src = 'sound.mp3';
                    audio.autoplay = true;
                    peer.addIceCandidate(JSON.parse(candidatee));
                } else {
                    addcandidate(candidatee, _room, _type);
                }
            }, 10);
        }

        //student
        if(_position === 'answer') {
            localStorage.setItem(this.state.host, 'host');
            peer.onicecandidate = e => {
                if(e.candidate && localStorage.getItem(this.state.host) === 'host' && e.candidate.type === localStorage.getItem(this.state.host)) {
                    localStorage.setItem(this.state.host, 'srflx');
                    yourCandidate = e.candidate;
                    socket_io.emit('cand1', {description: JSON.stringify(yourCandidate), room: document.location.pathname.split('/')[document.location.pathname.split('/').length - 2] });
                } else if(e.candidate && localStorage.getItem(this.state.host) === 'srflx' && e.candidate.type === localStorage.getItem(this.state.host)) {
                    localStorage.setItem(this.state.host, 'none');
                    yourCandidate = e.candidate;
                    socket_io.emit('cand1', {description: JSON.stringify(yourCandidate), room: document.location.pathname.split('/')[document.location.pathname.split('/').length - 2] });
                }
            }

            navigator.mediaDevices.getUserMedia({ video:true, audio:true })
            .then(stream => {
                const video_local = document.getElementById("local");
                video_local.autoplay = true;
                video_local.muted = true;
                video_local.srcObject = stream;
                peer.addStream(stream);
                return peer.createOffer();
            })
            .then(offer => {
                peer.setLocalDescription(new RTCSessionDescription(offer));
                yourDescription = peer.localDescription;
                socket_io.emit('call', {description: JSON.stringify(yourDescription), room: document.location.pathname.split('/')[document.location.pathname.split('/').length - 2] });
            })

            peer.ontrack = e => {
                document.getElementById("remote").srcObject = e.streams[0];
            }

            $(document).ready(function() {
                socket_io.on('answer', function(mes) {
                    if(mes['room'] === document.location.pathname.split('/')[document.location.pathname.split('/').length - 2]) {
                        peer.setRemoteDescription(JSON.parse(mes['description']))
                        .then(() => addcandidate(candidatee,room,'teacher'))
                    }
                });

                socket_io.on('cand2', function(mes) {
                    if(mes['room'] === document.location.pathname.split('/')[document.location.pathname.split('/').length - 2]) {
                        candidatee = mes['description'];
                        room = mes['room'];
                    }
                });
            });
        } else {
            //teacher
            peer.onicecandidate = e => {
                if(e.candidate && e.candidate.type === 'srflx') {
                    yourCandidate = e.candidate;
                    socket_io.emit('cand2', {description: JSON.stringify(yourCandidate), room: document.location.pathname.split('/')[document.location.pathname.split('/').length - 2] });
                }
            }

            $(document).ready(function() {
                socket_io.on('call', function(mes) {
                    if(mes['room'] === document.location.pathname.split('/')[document.location.pathname.split('/').length - 2]) {
                        navigator.mediaDevices.getUserMedia({ video:true, audio:true })
                        .then(stream => {
                            const video_local = document.getElementById("local");
                            video_local.autoplay = true;
                            video_local.muted = true;
                            video_local.srcObject = stream;
                            peer.addStream(stream);
                            peer.setRemoteDescription(JSON.parse(mes['description']));
                        })
                        .then(() => addcandidate(candidatee,room,'student'))
                        .then(() => peer.createAnswer())
                        .then(answer => {
                            peer.setLocalDescription(new RTCSessionDescription(answer));
                            yourDescription = peer.localDescription;
                            socket_io.emit('answer', {description: JSON.stringify(yourDescription), room: document.location.pathname.split('/')[document.location.pathname.split('/').length - 2]});
                        })

                        peer.ontrack = e => {
                            document.getElementById("remote").srcObject = e.streams[0];
                        }
                    }
                });

                socket_io.on('cand1', function(mes) {
                    if(mes['room'] === document.location.pathname.split('/')[document.location.pathname.split('/').length - 2]) {
                        candidatee = mes['description'];
                        room = mes['room'];
                    }
                });
            });
        }
    }

    render() {
        return (
            <div className="videos">
                <div className="cards">
                    {this.state.position === 'request' &&
                        <div className="card" id="create_card_block">
                            <input placeholder="Write new task here" id="create_card" />
                            <div className="injected_btn" onClick={()=>{this.createCard()}}>Create</div>
                        </div>
                    }
                    {this.state.tasks.length !== 0 ?
                        <>
                            {this.state.tasks.map(item =>
                                <div className="card" key={item.id}>
                                    <div className="card_shadow" id={item.id}>Loading</div>
                                    <div className="card_title" onClick={()=>{this.editTitle(item.name)}}>{item.name}</div>
                                    <div className="card_contacts">
                                        <span className="photos">
                                        {item.users.map(user =>
                                            <span className="photo" key={item.id + user.avatar} onClick={()=>{this.deleteUser(user.id)}}>
                                                <img src={user.avatar} />
                                            </span>
                                         )}
                                        </span>
                                        <span className="date">
                                            <a href={item.link} target="_blank">show on wrike</a>
                                        </span>
                                        <span>
                                            <select defaultValue={item.status} onChange={(_e)=>{this.handleChange(_e, item.id)}}>
                                                <option disabled>Статус</option>
                                                <option value="Active">Active</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Deferred">Deferred</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </>
                    :
                        <div className="loader">
                            <img src="/img/loader.png" alt="" />
                        </div>
                    }
                </div>
                <div className="video-connect">
                    <div className="iconbar">
                        {this.state.position === 'request' || this.state.position === 'answer' ? this.state.position : 'Error'} <i id="connect" className="fas fa-circle fa-error"></i>
                    </div>
                </div>
                <video id="local" autoPlay></video>
                <video id="remote" autoPlay></video>
            </div>
        );
    }
};

export default Video;
