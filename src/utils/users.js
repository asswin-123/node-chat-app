
const users =[]
// adduser,removeuser,getuer,getuserinroom

const addUser = ({id,userName,roomName}) => {

    //clean data
    const name = userName.trim().toLowerCase()
    const room = roomName.trim().toLowerCase()

    //validation
    if(!name || !room) {
        return {
            error:'displayName and roomName are required'
        }
    }
    
    //checking for existing users
    const existingUser = users.find((user) => {
        return user.room=== room && user.name === name
    })

    //return error if user exists
    if(existingUser) {
        return {
            error:'displayName already exists'
        }
    }

    const user ={id,name,room}
    users.push(user)
    return {user};
}

const removeUser = (id) => {

    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index !== -1){
    return users.splice(index, 1)[0]
    }
}



//shorthand representation to get user,it can be done also like getusersinroom
const getUser = (id) =>users.find((user) => user.id === id)
    

const getUsersInRoom =(room) =>{
 return users.filter((user) =>user.room === room)
}


module.exports ={
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
}

