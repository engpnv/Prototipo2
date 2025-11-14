
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', socket => {
  socket.on('redirecionar', pagina => {
    io.emit('redirecionar', pagina);
  });
  socket.on('limpar', pagina => {
    io.emit('limpar', pagina);
  });
  socket.on('pagina', data => {
    io.emit('pagina', data);
  });
  socket.on('mensagem', msg => {
    io.emit('mensagem', msg);
  });
  socket.on('permiteEntrada', status => {
    io.emit('permiteEntrada', status);
  });
  socket.on('criarMensagem', msg => {
    io.emit('criarMensagemOperador', msg);
  });
  socket.on('respostaUsuario', msg => {
    io.emit('mensagem', 'Usuário digitou: ' + msg);
  });

});

const os = require('os');

// função para listar todos os IPs locais da máquina
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (let name of Object.keys(interfaces)) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

const PORT = 3000;

http.listen(PORT, () => {
  const ips = getLocalIPs();
  console.log(`Servidor rodando na porta ${PORT}`);
  if (ips.length > 0) {
    console.log("Acesse nos navegadores:");
    ips.forEach(ip => {
      console.log(` - Usuário:   http://${ip}:${PORT}/index.html`);
      console.log(` - Operador:  http://${ip}:${PORT}/operador.html`);
    });
  } else {
    console.log("Não encontrei IP local. Use http://localhost:" + PORT);
  }
});

