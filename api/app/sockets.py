from app import app

from flask_socketio import SocketIO, emit


socketio = SocketIO(app)

@socketio.on('call', namespace='/space')
def rtc_call(mes):
        socketio.emit('call', {
                'description': mes['description'],
                'room': mes['room'],
        }, namespace='/space')

@socketio.on('answer', namespace='/space')
def rtc_answer(mes):
        socketio.emit('answer', {
                'description': mes['description'],
                'room': mes['room'],
        }, namespace='/space')

@socketio.on('cand1', namespace='/space')
def rtc_cond1(mes):
        socketio.emit('cand1', {
                'description': mes['description'],
                'room': mes['room'],
        }, namespace='/space')

@socketio.on('cand2', namespace='/space')
def rtc_cond2(mes):
        socketio.emit('cand2', {
                'description': mes['description'],
                'room': mes['room'],
        }, namespace='/space')

# @socketio.on('i', namespace='/space')
# def i(mes):
#         socketio.emit('i', {
#                 'id': mes['id'],
#         }, namespace='/space')

@socketio.on('notification', namespace='/space')
def notification(mes):
        socketio.emit('notification', {
                'room': mes['room'],
                'workspace': mes['workspace'],
                'user': mes['user'],
        }, namespace='/extension')

if __name__ == '__main__':
    socketio.run(app)