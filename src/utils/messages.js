const generateMessages =(text,userName) => {
  return{
      text,
      createdAt: new Date().getTime(),
      userName
  }
}

module.exports ={
generateMessages
}