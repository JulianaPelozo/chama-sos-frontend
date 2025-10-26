const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


const USER = { username: "admin", password: "1234" };

const SECRET = "meuSegredoSuperSeguro";


app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === USER.username && password === USER.password) {
        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }

    return res.status(401).json({ error: "Usuário ou senha inválidos" });
});

app.get("/dashboard", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token ausente" });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido" });
        res.json({ message: `Bem-vindo ao painel, ${user.username}!` });
    });
});

app.listen(3000, () => console.log("✅ Servidor rodando em http://localhost:3000"));
