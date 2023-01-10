const express = require ("express");
const app = express();
//const path = require("path");
//const hbs = require("hbs");
const collection=require("./mongodb");
//const { read } = require("fs");
//const templatePath= path.join(__dirname,'./templates')
//const bcrypt = require("bcrypt");


app.use(express.json())
//app.set("view engine","hbs")
//app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))

/*
app.get("/", (req,res)=>{
    res.render("login")
})
app.get("/signup", (req,res)=>{
    res.render("signup")
})*/

app.post("/signup", async (req, res) => {
    var data = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    };
    if (
      req.body.name !== "" &&
      req.body.password !== "" &&
      req.body.email !== ""
    ) {
      const checkEmail = await collection.findOne({ email: req.body.email });
      const checkName = await collection.findOne({ name: req.body.name });
      try {
        if (checkEmail && checkName) {
          // se checkEmail e checkName existirem, significa que o email e o nome já estão sendo usados
          res.send("Este Email e este Usuário já estão sendo utilizados");
        } else if (checkEmail) {
          res.send("Este Email já está sendo utilizado");
        } else if (checkName) {
          res.send("Este Usuário já está sendo utilizado");
        } else if (req.body.password !== req.body.passwordConfirmation) {
          res.send("As senhas não coincidem");
        } else {
          // se não houver problemas, salve o novo usuário
          await collection.insertMany([data]);
          res.send("Registrado com sucesso!");
        }
      } catch (error) {
        res.send("Ocorreu um erro: " + error.message);
      }
    } else {
      res.send("Insira informações válidas");
    }
  });


app.post("/login", async (req, res) => {
  // Tente encontrar o usuário pelo nome
  var user = await collection.findOne({ name: req.body.name });

  // Se não encontrar o usuário pelo nome, tente encontrar pelo e-mail
  if (!user) {
    user = await collection.findOne({ email: req.body.name });
  }

  // Se não encontrar o usuário nem pelo nome nem pelo e-mail, as credenciais estão incorretas
  if (!user) {
    res.send("As credências estão incorretas");
    return;
  }

  // Se a senha for correta, o login é efetuado
  if (req.body.password === user.password) {
    res.send("logado");
  } else {
    // Senão, a senha está incorreta
    res.send("A senha está incorreta");
  }
});


app.listen(3000,()=>{
    console.log("sevidor on . . .")
})
