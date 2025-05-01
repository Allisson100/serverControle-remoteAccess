require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const { createUser } = require("./controllers/userController");
const User = require("./models/User");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server control running");
});

const dbMock = [
  {
    // gerar manualmente
    email: "allisson@teste.com",
    // gerar manualmente
    password: "123",
    // gerar manualmente
    isUserBlocked: false,
    // gerar manualmente
    clientId: "123456",

    // automatico sistema
    newUrl: null,
    // automatico sistema
    hash: null,
  },
];

app.post("/api/register-connection", async (req, res) => {
  try {
    const { clientId, newUrl, hash } = req.body;

    if (!clientId || !newUrl || !hash) {
      return res.status(400).json({ error: "Invalid customer data" });
    }

    // Busca o usuário com o clientId informado
    const user = await User.findOne({ clientId: clientId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Se o hash ainda não estiver salvo (primeiro acesso), salva agora
    if (!user.hash) {
      user.hash = hash;
    }

    // Se o hash do banco for diferente do enviado → tentativa de acesso não autorizada
    if (user.hash !== hash) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Atualiza a URL de conexão
    user.newUrl = newUrl;
    await user.save();

    res.status(200).json({ message: "Successfully connected" });
  } catch (error) {
    res.status(500).json({ message: "Error to connect" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!user.newUrl) {
      return res.status(401).json({ message: "Local server not running" });
    }

    if (user.isUserBlocked) {
      return res.status(401).json({ message: "User blocked" });
    }

    res.status(200).json({
      message: "Sucesso",
      userInfos: {
        connectionUrl: user.newUrl,
        isUserBlocked: user.isUserBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ error: "Erro ao criar usuário", details: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
