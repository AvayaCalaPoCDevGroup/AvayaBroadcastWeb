/*
Declaramos las contsantes para las librerias que usaremos
express -> ]HTTP Framework
http -> conexiones HTTPS
FS -> lector de Archivos

*/
require('log-timestamp');

globalString = undefined;

//Creamos un array de Usuarios Conectados
var connectedUsers = {};
var arr2 = [];

const express = require('express'),
  http = require('http'),
  cookieParser = require('cookie-parser');
const request = require('request'),
  session = require('express-session');
const crypto = require('crypto'),
  fs = require("fs");



//Funcion para encriptar
function encrypt(plainText) {

  const key = crypto.pbkdf2Sync(secretKey, salt, 65536, 32, digest);
  const iv = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64')
  encrypted += cipher.final('base64');
  return encrypted;
}

//Funcion para des encriptar
function decrypt(strToDecrypt) {

  const key = crypto.pbkdf2Sync(secretKey, salt, 65536, 32, digest);
  const iv = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(strToDecrypt, 'base64');
  decrypted += decipher.final();
  return decrypted;
}


/*const privateKey = fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/chain.pem', 'utf8');*/
/*
Declaramos las constantes para el arreglo options, en el arreglo se apunta hacia la ruta de los certificados.

*/

//Funcion para manipualr Arrays
function quitar(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

/*const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/cert.pem', 'utf8'),
  ca: fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/chain.pem', 'utf8')
};*/

//Declaramos la variable app que tendrá todas las opciones para nuestra aplicacion
// Express
// server (creamos el servidor http con el arreglo de los certificados)
// Declaramos la libreria que suaremos Socket.IO y que escuche las peticiones en el servidor que acabamos de createServer
//
app = express();
  server = http.createServer(app);
  io = require('socket.io').listen(server);





//Llamamos la funcions io.on para declarar los evebtos de nuestro Servidor

//Cuando se Conecta
io.on('connection', function(socket) {
  //Imprimimos en consola que se ha conectado el usuario




  //cuando un usairo se registra y esperamos lo datos en la funcion username
  socket.on('reg', function(username) {

    //registramos un socket con ese username
    socket.username = username;
    //Lo agregamos al array de usuarios conectados
    connectedUsers[username] = socket;
    //imprimimos en consola que este usuario se ha conectado
    globalString = username;

    arr2.push(globalString); // add at the end
    uniqueArray = arr2.filter(function(elem, pos) {
      return arr2.indexOf(elem) == pos;
    });
    console.log("Se ha conectado:" + username);
    console.log(uniqueArray);
    socket.emit('data', {
      to: "9860",
      message: uniqueArray
    });
  });



  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      console.log("Desconección Forzada");
      socket.connect();
    }
    console.log("Se ha desconectado un usuario" + socket.username);


  });

  //funcion p2p (TTS) esperamos los datos (data)
  socket.on('p2p', function(data) {
    //Se imprime en consola los Datos(data) que recibimos del Cliente
    console.log(data);
    //declaramos la constante to y como los datos vienen en formato json podemos acceder a sus propiedades
    const to = data.to,
      message = data.message,
      extra = data.extra;
    //Aqui vemos si el usuario conectado tiene la propiedad to
    if (connectedUsers.hasOwnProperty(to)) {
      //Si la tiene , imprimimos el mensaje
      console.log("enviando a:" + to);
      //Emitimos la señal de p2p al usuario conectado
      connectedUsers[to].emit('p2p', {
        //Con los datos, usario, mensaje y extra (idioma)
        username: socket.username,
        message: message,
        extra: extra

      });
    }
  });


  //funcion tts (TTS) esperamos los datos (data)
  socket.on('tts', function(data) {
    //Se imprime en consola los Datos(data) que recibimos del Cliente
    console.log(data);
    //declaramos la constante to y como los datos vienen en formato json podemos acceder a sus propiedades
    const to = data.to,
      message = data.message,
      sender = data.sender
    //Aqui vemos si el usuario conectado tiene la propiedad to
    if (connectedUsers.hasOwnProperty(to)) {
      //Si la tiene , imprimimos el mensaje
      console.log("enviando a:" + to + " from: " + sender);
      //Emitimos la señal de p2p al usuario conectado
      connectedUsers[to].emit('tts', {
        //Con los datos, usario, mensaje y extra (idioma)
        username: socket.username,
        message: message,
        sender: sender

      });
    }
  });

  socket.on('image', function(data) {
    console.log(data);
    const to = data.to,
      message = data.message;
    if (connectedUsers.hasOwnProperty(to)) {
      console.log("Se ha conectado:" + to);
      connectedUsers[to].emit('image', {
        username: socket.username,
        message: message
      });
    }
  });
//Envio de Video
  socket.on('video', function(data) {
    console.log(data);
    const to = data.to,
      message = data.message;
    if (connectedUsers.hasOwnProperty(to)) {
      console.log("Se ha conectado:" + to);
      connectedUsers[to].emit('video', {
        username: socket.username,
        message: message
      });
    }
  });
//Mostrar imagen
  socket.on('image2', function(data) {
    console.log(data);
    const to = data.to,
      message = data.message;
    if (connectedUsers.hasOwnProperty(to)) {
      console.log("Se ha conectado:" + to);
      connectedUsers[to].emit('image2', {
        username: socket.username,
        message: message
      });
    }
  });

  socket.on('alert', function(data) {
    console.log("Alert");
    console.log(data);
    const to = data.to,
      message = data.message;
    if (connectedUsers.hasOwnProperty(to)) {
      console.log("Se ha conectado:" + to);
      connectedUsers[to].emit('alert', {
        username: socket.username,
        message: message
      });
    }
  });

});






var bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(express.static('static'));
app.use(cookieParser());
app.use(session({
                  secret: "paioimasd",
                  saveUninitialized: true,
                  resave: true,
                  expires: new Date(Date.now() + (30 * 60 * 1000))
                }));

/*app.use(basicAuth({
    users: { 'jlramirez': 'jlramirezbc9861!' }
}));*/

//Al memomento de obtener el directorio raiz del proyecto de NodeJS, declaramaos 2 funciones req (Request) res(Repsonses)

app.get('/', function(req,res){
  if(req.session.islogged){
    if(req.session.islogged == 1000){
      res.sendFile(__dirname+'/home.html');
    } 
  } else {
    res.sendFile(__dirname+'/Login.html');
  }
});

app.get('/static/home.html', function(req,res){
  res.redirect('/');
});

app.get('/logout', function(req,res){
  req.session.destroy();
  res.redirect('https://breeze2-196.collaboratory.avaya.com/services/AAADEVPoCDemoPage/Demos');
});

app.post('/login', function(req, res) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  console.log("Login req.body: " + req.body.action);

  // var basic = 'Basic ' + Buffer.from(encrypt("WIPq2vKvT2161JzJT0TQRg==") + ':' + encrypt("QRN3vX+joBln8ySFkapj5QA85tNHgWYFUZmPxS/my2GPNgORHiY9hfR0BkvKCCrn")).toString('base64');
  var basic = 'Basic V0lQcTJ2S3ZUMjE2MUp6SlQwVFFSZz09OlFSTjN2WCtqb0Jsbjh5U0ZrYXBqNVFBODV0TkhnV1lGVVptUHhTL215MkdQTmdPUkhpWTloZlIwQmt2S0NDcm4='
  var usr = encrypt(req.body.email);
  var pwd = encrypt(req.body.pass);
  var email = req.body.email;
  var country = encrypt(req.body.country);
  var client = encrypt(req.body.client);

  request.post(
    {
      headers :{
        "Authorization": basic,
        "Content-Type": "multipart/form-data"
      },
      url : "https://breeze2-196.collaboratory.avaya.com/services/AAADEVOAuth2/Token/Authentication",
      method : "POST",
      formData : {
        "username" : usr,
        "password" : pwd,
        "pais" : country,
        "cliente" : client,
        "grant_type" : "access"
      }
    }, function(err, response, body){
      if(err) console.log("error: "+err);
      console.log("Body: " +body);
      //console.log("Response: " + JSON.stringify(response));

      bodyObject = JSON.parse(body);

      //Solo verifico que la respuesta sea de credenciales validas, no refresco el token por que en la app no hago peticiones
      if(bodyObject.token_access != undefined || bodyObject.token_refresh != undefined) 
      {
        req.session.islogged = 1000;
        res.send({ resp: 'authorized'});

        //Grabamos el acceso en el log-->se comento por que el log ahora lo leva OAUTH
        // request({
        //   'method': 'POST',
        //   'url': 'https://breeze2-132.collaboratory.avaya.com/services/AAADEVLOGGER/VantageTTSAccess?usuario='+email+'&pais='+country+'&cliente='+client,
        //   'headers': {
        //   }
        // }, function (error, response) { 
        //   if (error) throw new Error(error);
        //   console.log("Registro en logger: " + response.body);
        // });
      } else {
        res.send({ resp: 'unauthorized'});
      }
    }
  );
});

app.post('/websockets/alert', function(req, res) {
  var dest1 = req.body.destino,
    url1 = req.body.mensaje;
  var io2 = require('socket.io-client');
  var socket2 = io2.connect('https://aaadevbroadcast.appspot.com', {
    reconnect: true
  });
  socket2.emit('reg', '123456789');
  socket2.emit('alert', {
    to: dest1,
    message: url1
  });
  res.send('Notificacion Enviada');
});

app.post('/websockets/tts', function(req, res) {
  var dest1 = req.body.destino,
    mensaje = req.body.mensaje,
    idioma = req.body.idioma;
  var io2 = require('socket.io-client');
  var socket2 = io2.connect('https://aaadevbroadcast.appspot.com', {
    reconnect: true
  });
  socket2.emit('reg', '123456789');
  socket2.emit('p2p', {
    to: dest1,
    message: mensaje,
    extra: idioma
  });
  res.send('Notificacion Enviada');
});

app.post('/websockets/pantalla', function(req, res) {
  var dest1 = req.body.destino,
    mensaje = req.body.mensaje
    sender = req.body.sender;
  var io2 = require('socket.io-client');
  var socket2 = io2.connect('https://aaadevbroadcast.appspot.com', {
    reconnect: true
  });
  socket2.emit('reg', '123456789');
  socket2.emit('tts', {
    to: dest1,
    message: mensaje,
    sender: sender
  });
  res.send('Notificacion Enviada');

});


app.post('/websockets/logo', function(req, res) {
  var dest1 = req.body.destino,
    mensaje = req.body.mensaje;
  var io2 = require('socket.io-client');
  var socket2 = io2.connect('https://aaadevbroadcast.appspot.com', {
    reconnect: true
  });
  socket2.emit('reg', '123456789');
  socket2.emit('image', {
    to: dest1,
    message: mensaje
    });
  res.send('Notificacion Enviada');

});


//Indicamos que
var puertoApp = process.env.PORT || 8080;
server.listen(puertoApp, () => {

  console.log('Corriendo Server puerto ' + puertoApp);

})

module.exports = app;