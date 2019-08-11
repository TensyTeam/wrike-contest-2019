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
            host: null
		}
		this.onStart = this.onStart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createCard = this.createCard.bind(this);
	}

	componentWillMount() {
        this.onStart();
    }

    componentDidMount() {
        const token = localStorage.getItem('token')

        const room = document.location.pathname.split('/')[document.location.pathname.split('/').length - 2]
        const workspace = document.location.search.split('&')[0].split('=').pop()
        const user = document.location.search.split('=').pop()
        const type = document.location.pathname.split('/').pop()

        console.log('!', token)

        if (token == '') {
            localStorage.setItem('room', room)
            localStorage.setItem('workspace', workspace)
            localStorage.setItem('user', user)
            localStorage.setItem('type', type)

            window.location.href = LINK + 'auth'
        } else {
            this.getTasks(token)
        }
    }

    getTasks(token) {
        axios.get(LINK + 'api/tasks?token=' + token).then((res) => {
            let _tasks = res['data'];
            let _tasks_filter = [];
            for(let m = 0; m < _tasks.length; m++) {
                for(let i = 0; i < _tasks[m].users.length; i++) {
                    let _name_surname = (_tasks[m].users[i].name + _tasks[m].users[i].surname).replace(/\s/g, '').toLowerCase();
                    if(_name_surname === localStorage.getItem('user')) {
                        _tasks_filter.push(_tasks[m]);
                    }
                }
            }
            this.setState({tasks: _tasks_filter})
        })
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

		axios.post(LINK + 'api/create?token=' + token, json).then(res => {
			console.log(res['data'])
		})
	}

    createCard() {
        console.log('CREATE')

        let token = localStorage.getItem('token')
        let _name = document.getElementById('create_card').value
        let _id_folder = 'Tensy' // !
        this.createTask(token, _id_folder, { name: _name, status: 'Active' })

        this.getTasks(token)
    }

    onStart() {
        let _position = document.location.pathname.split('/').pop();
        let _room = document.location.pathname.split('/')[document.location.pathname.split('/').length - 2];
        console.log(_position, _room);
        this.setState({ position: _position, room: _room });
        // WebRTC
        let namespace = 'space';
        let link = 'https://tensyteam.ru/';
        const socket_io = openSocket( link + namespace);

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
                {this.state.position === 'student' &&
                    <div className="video-control" onClick={()=>{this.props.onFinish()}}>
                        <div className="iconbar"><i className="fas fa-sign-out-alt"></i> Finish</div>
                    </div>
                }
                <div className="cards">
                    <div className="card" id="create_card_block">
                        <input placeholder="Write new task here" id="create_card" />
                        <div className="injected_btn" onClick={()=>{this.createCard()}}>Create</div>
                    </div>
                    {this.state.tasks.map(item =>
                        <div className="card" key={item.id}>
                            <div className="card_shadow" id={item.id}>Loading</div>
                            <div className="card_title">{item.name}</div>
                            <div className="card_contacts">
                                <span className="photos">
                                {item.users.map(user =>
                                    <span className="photo" key={item.id + user.avatar}>
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
                </div>
                <div className="video-connect">
                    <div className="iconbar">
                        {this.state.position} <i id="connect" className="fas fa-circle fa-error"></i>
                    </div>
                </div>
                <video id="local" autoPlay></video>
                <video id="remote" autoPlay></video>
            </div>
        );
    }
};

export default Video;
