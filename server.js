const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const arquivos = {
  "/": { arquivo: "testes.html", tipo: "text/html; charset=utf-8" },
  "/testes.html": { arquivo: "testes.html", tipo: "text/html; charset=utf-8" },
  "/index.js": { arquivo: "index.js", tipo: "text/javascript; charset=utf-8" },
  "/testes.js": { arquivo: "testes.js", tipo: "text/javascript; charset=utf-8" },
  "/img/headset-barracred.png": { arquivo: "img/headset-barracred.png", tipo: "image/png" }
};

const servidor = http.createServer((requisicao, resposta) => {
  const recurso = arquivos[requisicao.url];

  if (!recurso) {
    resposta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    resposta.end("Arquivo não encontrado.");
    return;
  }

  resposta.writeHead(200, { "Content-Type": recurso.tipo });
  fs.createReadStream(path.join(__dirname, recurso.arquivo)).pipe(resposta);
});

servidor.listen(3000, () => {
  console.log("Teste disponível em http://localhost:3000");
});
