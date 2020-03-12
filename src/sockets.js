module.exports = io => {

    let nickSockets = {};

    io.on('connection', socket => {

        socket.on('sendNickName', function(data, cb) {
            if (data in nickSockets) {
                cb(false);
              } else {
                cb(true);
                socket.nickName = data;
                nickSockets[socket.nickName] = socket;
                io.sockets.emit('sendNickNames', Object.keys(nickSockets));
              }
        });

        socket.on('sendGlobalMessage', data => {
            io.sockets.emit('sendServerGlobalMessage', {nick: socket.nickName, msg: data});
        });

        socket.on('sendPrivateMessage', data => {
            nickSockets[data.nick].emit('sendServerPrivateMessage', {nick: socket.nickName, msg: data.msg});
        });

        socket.on('disconnect', data => {
            if(!socket.nickName) return;
            delete nickSockets[socket.nickName]; 
            io.sockets.emit('sendNickNames', Object.keys(nickSockets));
        });

    });
}