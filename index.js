// Server Config 
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./format');
const {userJoin , currentUser,userLeaves,getRoomUsers} = require('./user');


// MiddleWare Configuration
const app = express();
const Host = http.createServer(app);
const io = socketio(Host);

// Static Folder
app.use(express.static(path.join(__dirname,'frontend'))); 
const system = "System:";

//Websocket Initialize 
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);
       //Initial Message
      socket.emit('message',formatMessage(system,'Websocket Chat'));
   

      //Users Join Info
     socket.broadcast.to(user.room).emit('message',formatMessage(system,`${user.username} Joined`));
    

      //room Information Extraction 
      io.to(user.room).emit('roomUsers',{
        room:user.room,
        users: getRoomUsers(user.room)
       
    });
});
  
    
   
//chat Message 
    socket.on('chatMessage',msg=>{
        const user = currentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
// User Disconnect
    socket.on('disconnect',()=>{
       
       const user = userLeaves(socket.id);
       if(user){
        io.to(user.room).emit('message',formatMessage(system,`${user.username} Disconnect`));
         
      //room Information Extraction 
      io.to(user.room).emit('roomUsers',{
        room:user.room,
        users: getRoomUsers(user.room)
       
    });
    
    }
    
    });
    
});



const PORT = 3000 || process.env.PORT;

Host.listen(PORT,()=>{
    console.log("Server Starts @",PORT);
});

