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
      req.body.name != null &&
      req.body.password != null &&
      req.body.email != null &&
      req.body.passwordConfirmation
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

app.get("/name/:email", async (req, res) => {
  collection.findOne({ email: req.params.email })
      .then(estudante => {
        if (estudante) {
          const nome = estudante.name;
          res.status(200).json({ nome});
        } else {
          res.status(404).json({ mensagem: `Estudante com matrícula ${req.params.email} não encontrado.` });
        }
      })
      .catch(error => {
        res.status(500).json({ mensagem: `Erro ao buscar estudante com matrícula ${req.params.email}: ${error.message}` });
      });
  });


app.listen(3001,()=>{
    console.log("sevidor on . . .")
})
