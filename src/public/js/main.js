// Socket.io client side connection
const socket = io.connect();

var nickname = "DefaultNick";
var globalMessage;
var chat;

function sendNickName() {
    nickname = document.getElementById("nickname").value;
    socket.emit('sendNickName', nickname, function(cb) {
        if (cb) {
            document.getElementById("nickCard").style.display = "none";
            document.getElementById("ChatContainer").style.display = "block";
            document.getElementById("header").innerHTML += '<p>' + nickname + '</p>';
        } else {
            chat = document.getElementById("nickError");
            chat.innerHTML += '<div class = "alert alert-danger">This nick name already exits</div>';
        }
    }); 
}

function sendGlobalMessage() {
    globalMessage = document.getElementById("globalMessage");
    socket.emit('sendGlobalMessage', globalMessage.value);
    globalMessage.value = "";
    globalMessage.focus();
}

function createPrivateChat(data){
    if (document.getElementById(data + nickname) || document.getElementById(nickname + data)) {
        console.log("Ya existe el chat privado");
        return;
        
    } else {
        chatName = nickname+data;
        card = chatName+"Card";

        html = `<div id="${card}" class="card" style="margin-top: 10px; min-width: 300px;">
                                        <!-- CARD HEADER-->
                                        <div class="card-header bg-dark text-white">
                                            <div class="row">
                                            <h4 class="col-11">${data}</h3>
                                            <button type="button" onclick="closePrivateChat(${card})" class="close"><span aria-hidden="true">&times;</span></button>
                                            </div>
                                        </div>

                                        <!-- CARD BODY-->
                                        <div id="${chatName}" class="card-body" style="max-height: 200px; overflow: auto;"></div>

                                        <!-- CARD FOOTER -->
                                        <div id="message-form" class="card-footer">
                                            <div class="input-group">
                                                <input type="text" id="message${data}" class="form-control" />
                                                <div class="input-group-append">
                                                    <button class="btn btn-warning" onclick="sendPrivateMessage(${data}, message${data})">
                                                        <i class="fa fa-paper-plane"></i> Send
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                    
        document.getElementById("privateChats").innerHTML += html;
    }
}

function sendPrivateMessage(dataNick, dataMsg) {
    dNick = dataNick.id;
    dMsg = dataMsg.value;
    socket.emit('sendPrivateMessage', {nick: dNick, msg: dMsg});

    if (document.getElementById(nickname + dNick)) {
        chat = document.getElementById(nickname + dNick);
        chat.innerHTML += '<b>' + nickname + '</b>: ' + dMsg + '<br/>';

    } else if (document.getElementById(dNick + nickname)) {
        chat = document.getElementById(dNick + nickname);
        chat.innerHTML += '<b>' + nickname + '</b>: ' + dMsg + '<br/>';
    } 

    privateMessage = document.getElementById("message"+dNick);
    privateMessage.value = "";
    privateMessage.focus();
}

function closePrivateChat(card){
    document.getElementById(card.id).remove();
}

socket.on('sendNickNames', function(data){
    data.splice(data.indexOf(nickname), 1);
    let html = '';
    for(i = 0; i < data.length; i++) {
      html += `<p id=${data[i]} class="dinamicP" onclick="createPrivateChat(this.id)"><i class="fa fa-user"></i> ${data[i]}</p>`; 
    }
    nickNames = document.getElementById("nickNames");
    nickNames.innerHTML = html;
});

socket.on('sendServerGlobalMessage', function(data){
    chat = document.getElementById("chat");
    chat.innerHTML += '<b>' + data.nick + '</b>: ' + data.msg + '<br/>';
});

socket.on('sendServerPrivateMessage', function(data){
    createPrivateChat(data.nick);
    dataNick = data.nick;

    if (document.getElementById(nickname + dataNick)) {
        chat = document.getElementById(nickname + dataNick);
        chat.innerHTML += '<b>' + data.nick + '</b>: ' + data.msg + '<br/>';

    } else if (document.getElementById(dataNick + nickname)) {
        chat = document.getElementById(dataNick + nickname);
        chat.innerHTML += '<b>' + data.nick + '</b>: ' + data.msg + '<br/>';
    } 
});