
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect("mongodb+srv://carloslosada:V7vqtmobeSkYe6zJ@cluster0.y7sw3lq.mongodb.net/LoginData")
.then(()=>{
    console.log("mongodb conetado");
})
.catch(()=>{
    console.log("falhou amigo");
})

const LogInSchema= new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const collection=new mongoose.model("logincollections",LogInSchema)
//const collection=new mongoose.model("test1",LogInSchema)

module.exports=collection