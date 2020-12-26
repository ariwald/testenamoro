const cryptoRandomString = require("crypto-random-string");
const secretCode = cryptoRandomString({ length: 6 });
const cookieSession = require("cookie-session");
const compression = require("compression");
const { sendEmail } = require("./ses");
const { s3Url } = require("./config");
const uidSafe = require("uid-safe");
const express = require("express");
const app = express();
//server and io-server must come after express
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
// const io = require("socket.io").listen(server);
const bcrypt = require("./bcrypt");
const multer = require("multer");
const csurf = require("csurf");
const path = require("path");
const s3 = require("./s3");
const db = require("./db");

let usersAndSockets = {};
let secrets;

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/"
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

if (process.env.NODE_ENV === "production") {
  secrets = process.env;
  // console.log(process.env.SESSION_SECRET);
} else {
  secrets = require("./secrets");
}

// const cookieSession = require('cookie-session');
const cookieSessionMiddleware = cookieSession({
  secret: secrets.SESSION_SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(csurf());
app.use(function(req, res, next) {
  res.cookie("mytoken", req.csrfToken());
  next();
});

//serving static files
app.use(express.static("./public"));

//compression middleware
app.use(compression());

// DO NOT TOUCH
//boilerplate code for image upload
//render the file and upload to the computer
const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    //2 mb file
    fileSize: 2097152
  }
});
/////////do not TOUCH
/////////do not TOUCH
/////////do not TOUCH

//ROUTES
app.get("/welcome", function(req, res) {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

// POST /register
app.post("/welcome", (req, res) => {
  bcrypt
    .hash(req.body.password)
    .then(password => {
      return db
        .userRegister(req.body.first, req.body.last, req.body.email, password)
        .then(data => {
          let id = data.rows[0].id;
          req.session.userId = id;
          req.session.first = req.body.first;
          req.session.last = req.body.last;
          res.json({ success: true });
        })
        .catch(err => {
          console.log("err in storing in the db: ", err);
          res.json({ success: false });
        });
    })
    .catch(err => {
      console.log("err in Post welcome-register: ", err);
      res.json({ success: false });
    });
});

app.post("/login", (req, res) => {
  let typedPassword = req.body.password;
  db.getUsersEmail(req.body.email)
    .then(results => {
      console.log("results: ", results);
      let userId = results[0].id;
      let userPassword = results[0].password;

      bcrypt
        .compare(typedPassword, userPassword)
        .then(result => {
          console.log("it is a match: ", result);
          if (result) {
            req.session.userId = userId;
            console.log("do u have a cookie?: ", req.session.userId);
            res.json({ success: true });
          }
        })
        .catch(err => {
          console.log("err in storing in the db: ", err);
          res.json({ success: false });
        });
    })
    .catch(err => {
      console.log("err in post/login: ", err);
      res.json({ success: false });
    });
});

app.post("/reset/start", (req, res) => {
  let email = req.body.email;
  let recipient = email;
  let message = "retrieve password code: " + secretCode;
  let subject = "Rede Social Code";
  if (req.session) {
    req.session.userId = null;
    delete req.session;
  }
  db.getUsersEmail(req.body.email)
    .then(results => {
      console.log("results: ", results);
      if (results.length > 0) {
        sendEmail(recipient, message, subject);
        db.insertCode(email, secretCode);
        res.json({ success: true });
      } else {
        console.log("error in /reset/start:");
        res.json({ success: false });
      }
    })
    .catch(err => {
      console.log("err in reset start: ", err);
      res.json({ success: false });
    });
});

app.post("/reset/verify", function(req, res) {
  if (req.session) {
    req.session.userId = null;
    delete req.session;
  }
  console.log("req.body.email: ", req.body.email);
  console.log("req.body.secretCode: ", req.body.secretCode);
  console.log("req.body.newPassword: ", req.body.newPassword);

  db.selectCode(req.body.email)
    .then(code => {
      console.log("code: ", code);
      if (code[0].secret == req.body.secretCode) {
        console.log("req.body.newPassword: ", req.body.newPassword);
        bcrypt
          .hash(req.body.newPassword)
          .then(hashPass => {
            console.log("hassPass: ", hashPass);
            db.updatePassword(req.body.email, hashPass).then(() => {
              res.json({ success: true });
            });
          })
          .catch(err => {
            console.log("err in hashing/updating :", err);
            res.json({ succes: false });
          });
      } else {
        res.json({ succes: false });
      }
    })
    .catch(err => {
      console.log("error in reset", err);
      res.json({ success: false });
    });
});

app.get("/user", (req, res) => {
  db.getAllInfoUser(req.session.userId)
    .then(data => {
      // console.log("user data from getAllInfoUser: ", data);
      res.json(data[0]);
    })
    .catch(err => console.log("err in getAllInfoUser: ", err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  console.log("file: ", req.file);
  const imageUrl = s3Url + req.file.filename;
  if (req.file) {
    // Insert in my db, new line: url!
    db.updatePic(req.session.userId, imageUrl)
      .then(data => {
        res.json(data);
      })
      .catch(err => console.log("err in updatePic: ", err));
  }
});

app.post("/bioEditor", (req, res) => {
  const { id, bio } = req.body;
  db.bioUpdater(id, bio)
    .then(data => {
      res.json(data[0]);
    })
    .catch(err => console.log("err in bioEditor : ", err));
});

app.get("/api/user/:id", (req, res) => {
  db.getAllInfoUser(req.params.id).then(data => {
    // console.log("data: ", data);
    res.json({
      data: data[0],
      loggedUser: req.session.userId
    });
  });
});

//same name as findPeople.js axios request
app.get("/findPeople.json", (req, res) => {
  db.mostRecentUsers().then(data => {
    console.log("data: ", data);
    res.json({
      data: data
    });
  });
});

//if there is no pic (!=404), upload default.jpg
app.get("/findPerson.json/:typedLetter", (req, res) => {
  db.getMatchingUsers(req.params.typedLetter)
    .then(data => {
      res.json(data);
    })
    .catch(err => console.log("err in server/getMatchingUsers: ", err));
});

app.get("/friends-status/:id", (req, res) => {
  console.log("This is the recipient (req.params.id) : ", req.params.id);
  console.log("This is the sender (req.session.userId): ", req.session.userId);
  db.getRelationshipStatus(req.session.userId, req.params.id)
    .then(data => {
      res.json(data[0]);
    })
    .catch(err => console.log("err in server getRelationshipStatus: ", err));
});

app.post("/make-friend-request/:id", (req, res) => {
  db.makeFriendRequest(req.session.userId, req.params.id).then(data => {
    res.json({
      success: true,
      data
    });
  });
});

app.post("/accept-friend-request/:id", (req, res) => {
  db.acceptFriendRequest(req.session.userId, req.params.id).then(data => {
    res.json({
      success: true,
      data
    });
  });
});

app.post("/end-friendship/:id", (req, res) => {
  db.endFriendship(req.session.userId, req.params.id).then(() => {
    res.json({
      success: true
    });
  });
});

app.get("/api/friends-wannabes", (req, res) => {
  db.getAllFriendsAndWannabes(req.session.userId).then(data => {
    res.json({
      success: true,
      data
    });
  });
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/welcome");
});

app.get("*", function(req, res) {
  if (!req.session.userId) {
    res.redirect("/welcome");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

server.listen(process.env.PORT || 8080, function() {
  console.log("8080 listens.");
});

//server side socket code
io.on("connection", function(socket) {
  if (!socket.request.session.userId) {
    return socket.disconnect(true);
  }

  let userId = socket.request.session.userId;

  socket.on("disconnect", () => {
    delete usersAndSockets[socket.id];
    let arrayOfUsers = [];
    Object.entries(usersAndSockets).map(onlineId => {
      arrayOfUsers.push(onlineId[1]);
    });
    db.searchOnlineUsers(arrayOfUsers)
      .then(data => {
        // emit online users to everyone connected
        io.sockets.emit("onlineUsers", data);
      })
      .catch(e => console.log("error in searchOnlineUsers: ", e));
  });

  usersAndSockets[socket.id] = userId;
  let arrayOfUsers = [];
  Object.entries(usersAndSockets).map(onlineId => {
    arrayOfUsers.push(onlineId[1]);
  });
  db.searchOnlineUsers(arrayOfUsers)
    .then(data => {
      io.sockets.emit("onlineUsers", data);
    })
    .catch(e => console.log("error in searchOnlineUsers: ", e));

  db.getLastTenChatMessages()
    .then(data => {
      socket.emit("chatMessages", data.reverse());
    })
    .catch(err => console.log("err in getLastTenChatMessages: ", err));

  socket.on("chatMessage", msg => {
    db.insertChatMessages(userId, msg)
      .then(data => {
        db.infoMessageSender(data[0].id)
          .then(message => {
            io.sockets.emit("chatMessage", message);
          })
          .catch(err => console.log("err in insertChatMessages: ", err));
      })
      .catch(err => console.log("err in infoMessageSender: ", err));
  });
});
