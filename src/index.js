
const path = require("path")
const http =require("http")
const express = require("express")
const socket = require("socket.io")
const {generateMessages} = require('./utils/messages.js')
const { addUser,removeUser,getUser,getUsersInRoom } = require("./utils/users.js")

const app=express()
const server = http.createServer(app)
const io= socket(server)
const port=process.env.port ||3000
const viewsPath = path.join(__dirname, "../public")
//app.set("views",viewsPath)
app.use(express.static(viewsPath))

server.listen(port,() => {
    console.log("the server is started")
})
io.on('connection',(socket)=> {
    console.log("web socket started")
    socket.on('join',({userName,roomName},callback) => {
        console.log(userName)
       const{error,user} = addUser({id:socket.id,userName,roomName})
       if(error) {
           callback(error)
       }
       if(user == undefined)
       {
           callback('Session timed Out')
       }
       else{
       socket.join(user.room)
       socket.emit('onconnect',generateMessages('welcome','Admin'))
       socket.broadcast.to(user.room).emit('onconnect',generateMessages(user.name+" has Joined",'Admin'))
       io.to(user.room).emit('userData',{
           room: user.room,
           users:getUsersInRoom(user.room)
       })
    }
    }) 
   
    socket.on('message',(message,callback) => {
        const user = getUser(socket.id)
        socket.emit('onconnect',generateMessages(message,'you'))
        socket.broadcast.to(user.room).emit('onconnect',generateMessages(message,user.name))
        callback()
    })
    socket.on('location',(coords)=> {
        const user =getUser(socket.id)
        io.to(user.room).emit('location',generateMessages("https://google.com/maps?q=${coords.latitude},${coords.longitude}",user.name))
    })

    socket.on('disconnect',() => {
        const user =removeUser(socket.id)
        if(user){
        io.to(user.room).emit('onconnect',generateMessages( user.name +' has left','Admin'))
        io.to(user.room).emit('userData',{
            room: user.room,
            users:getUsersInRoom(user.room)
        })
        }
    })
})
    