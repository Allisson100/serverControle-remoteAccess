require("dotenv").config();
const express = require("express");
const cors = require("cors");

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
    ngrokUrl: null,
    // automatico sistema
    hash: null,
  },
];

app.post("/api/register-connection", async (req, res) => {
  try {
    const { clientId, ngrokUrl, hash } = req.body;

    if (!clientId || !ngrokUrl || !hash) {
      return res.status(400).json({ error: "Invalid customer datas" });
    }

    // buscar no banco se o hash não é null
    // se não for null tem que setar no banco o que esta vindo da req, pois é o primeiro acesso
    if (!dbMock?.[0]?.hash) {
      dbMock[0].hash = hash;
    }

    // Se o banco encontrar esse hash então deve compará-lo de acordo com o clientId
    // Para saber se o cara não esta acessando de outro pc o servidor
    if (dbMock?.find((mock) => mock?.clientId === clientId)?.hash !== hash) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    dbMock[0].ngrokUrl = ngrokUrl;

    res.status(200).json({ message: "Successfully connected" });
  } catch (error) {
    res.status(500).json({ message: "Error to connect" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (dbMock?.[0]?.email !== email || dbMock?.[0]?.password !== password) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!dbMock?.[0]?.ngrokUrl) {
      return res.status(401).json({ message: "Local server not running" });
    }

    if (dbMock?.[0]?.isUserBlocked) {
      return res.status(401).json({ message: "User blocked" });
    }

    res.status(200).json({
      message: "Sucesso",
      userInfos: {
        connectionUrl: dbMock?.[0]?.ngrokUrl,
        isUserBlocked: dbMock?.[0]?.isUserBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Conexão registrada com sucesso" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
