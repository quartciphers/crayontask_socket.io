const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();

//Extract Username and Room_name through Query  
const {username,room}= Qs.parse(location.search,{
     ignoreQueryPrefix : true 
     
});

console.log(username,room);

//join chatroom
socket.emit('joinRoom',{username,room});

// Room users Info:
socket.on('roomUsers',({room,users})=>{
   roomInfo(room);
   usersInfo(users);
});


socket.on('message',message =>{

    console.log(message);
    sendTodom(message);
    // 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    const chatmsg = e.target.elements.msg.value;
    socket.emit('chatMessage',chatmsg);
    
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus(); 

});

function sendTodom(message){
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
   <p class="text">
       ${message.text}
   </p>`;
   document.querySelector('.chat-messages').appendChild(div);

}


function roomInfo(room){
  roomName.innerText = room;
}

function usersInfo(users){
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });

}

