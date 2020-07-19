
$(document).ready( () => {
    const socket = io()
    const messageTemplate =document.querySelector('#message-template').innerHTML
    const messageRightTemplate =document.querySelector('#message-right-template').innerHTML
    const locationTemplate = document.querySelector('#location-template').innerHTML
    const locationRightTemplate =document.querySelector('#location-right-template').innerHTML
    const sidebarTemplate = document.querySelector('#usersdata-template').innerHTML

    const autoScroll =() => {
        const $message =  document.getElementById('messages')
         const $newMessage =  $message.lastElementChild
      
        const newMessageStyle = getComputedStyle($newMessage)   
        
        const newMessageMargin = parseInt(newMessageStyle.marginBottom)
        console.log(document.body.scrollTop)
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

        const visibleHeight =$newMessage.offsetHeight

        const containerHeight =$newMessage.scrollHeight
       
        const scrollOffset = $newMessage.scrollTop + visibleHeight
      console.log(visibleHeight,containerHeight,scrollOffset,newMessageHeight)
        if(containerHeight- newMessageHeight <= scrollOffset){
            $message.scrollTop = $message.scrollHeight
        }
        


    }
socket.on('onconnect',(message)=> {
    if(message.userName === 'you') {
        const html =Mustache.render(messageRightTemplate,{
            message:message.text,
            createdAt:moment(message.createdAt).format('hh:mm a'),
            userName:message.userName
        })
    document.getElementById('messages').insertAdjacentHTML("beforeend",html)
    autoScroll()
    }
    else{
    const html =Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('hh:mm a'),
        userName:message.userName
    })
    document.getElementById('messages').insertAdjacentHTML("beforeend",html)
    autoScroll()
}
   
    
})
socket.on('location',(url)=> {
    if(url.userName === 'you') {
        const urlhtml = Mustache.render(locationRightTemplate,{
            url:url.text,
            createdAt: moment(url.createdAt).format('hh:mm a'),
            userName:url.userName
        })
        document.getElementById('messages').insertAdjacentHTML("beforeend",urlhtml)
        autoScroll()
    }
    else{
    const urlhtml = Mustache.render(locationTemplate,{
        url:url.text,
        createdAt: moment(url.createdAt).format('hh:mm a'),
        userName:url.userName
    })
    document.getElementById('messages').insertAdjacentHTML("beforeend",urlhtml)
    autoScroll()
}
})
 
socket.on('userData',({room,users}) => {
    const usersHTML = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    
    document.querySelector('#usersData').innerHTML= usersHTML;
})

$("#sendMessage").click((e)=> {
    $("#sendMessage").attr('disabled','disabled')
    const message =$("#message").val();
    console.log(message);
    if(!message || message.trim().length === 0) {
        e.preventDefault();
       $("#sendMessage").removeAttr('disabled','disabled')
    }
    else{
       socket.emit('message',message,() => {
        $("#sendMessage").removeAttr('disabled','disabled')
        console.log('message delivered')
        $("#message").val("");
    })
}
})

$("#getLocation").click(() => {
    $("#getLocation").attr('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        $("#getLocation").removeAttr('disabled','disabled')
        socket.emit("location",{latitude:position.coords.latitude,longitude:position.coords.longitude})
    })
    
})
const{displayName:userName,roomName} = Qs.parse(location.search, {ignoreQueryPrefix:true})
socket.emit('join',{userName,roomName},(error) => {
   alert(error)
   location.href = '/'
})
});