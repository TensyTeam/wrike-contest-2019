import React from "react";
import openSocket from 'socket.io-client';
import $ from 'jquery';


class Video extends React.Component {
    constructor (props) {
		super(props)
		this.state = {
            position: null,
			responce: [],
            room: null
		}
		this.onStart = this.onStart.bind(this);
	}

	componentWillMount() {
        this.onStart();
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
        if(_position === 'student') {
            localStorage.setItem(this.props.user.id, 'host');
            peer.onicecandidate = e => {
                if(e.candidate && localStorage.getItem(this.props.user.id) === 'host' && e.candidate.type === localStorage.getItem(this.props.user.id)) {
                    localStorage.setItem(this.props.user.id, 'srflx');
                    yourCandidate = e.candidate;
                    socket_io.emit('cand1', {description: JSON.stringify(yourCandidate), room: document.location.pathname.split('/')[document.location.pathname.split('/').length - 2] });
                } else if(e.candidate && localStorage.getItem(this.props.user.id) === 'srflx' && e.candidate.type === localStorage.getItem(this.props.user.id)) {
                    localStorage.setItem(this.props.user.id, 'none');
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
