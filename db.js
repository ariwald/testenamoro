//to use the database
const spicedPg = require("spiced-pg");
const db = spicedPg(
  process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/postgresql-lively-04914"
);

//used for post/welcome/register
module.exports.userRegister = (first, last, email, password) => {
  return db.query(
    `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
    [first, last, email, password]
  );
};

//used for post login
module.exports.getUsersEmail = function(email) {
  return db
    .query(`SELECT * FROM users WHERE email=$1`, [email])
    .then(({ rows }) => rows);
};

// used for table codes
module.exports.insertCode = (email, code) => {
  return db
    .query(
      `INSERT INTO codes (email, secret)
            VALUES ($1, $2)
            ON CONFLICT (email)
            DO
                UPDATE
                SET secret=$2,
                created_at=now()`,
      [email, code]
    )
    .then(({ rows }) => rows);
};

module.exports.selectCode = email => {
  return db
    .query(
      `SELECT * FROM codes
            WHERE email=$1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`,
      [email]
    )
    .then(({ rows }) => rows);
};

module.exports.updatePassword = (email, newPassword) => {
  // console.log("email db updatePassword: ", email);
  // console.log("password db updatePassword: ", newPassword);
  return db
    .query(
      `UPDATE users
            SET password=$2
            WHERE email=$1
            RETURNING id`,
      [email, newPassword]
    )
    .then(({ rows }) => rows);
};

module.exports.getAllInfoUser = id => {
  return db
    .query(
      `SELECT * FROM users
            WHERE id=$1`,
      [id]
    )
    .then(({ rows }) => {
      // console.log("rows: ", rows);
      return rows;
    });
};

module.exports.updatePic = (id, imageUrl) => {
  return db
    .query(
      `UPDATE users
            SET url=$2
            WHERE id=$1
            RETURNING url`,
      [id, imageUrl]
    )
    .then(({ rows }) => rows);
};

module.exports.bioUpdater = (id, bio) => {
  return db
    .query(
      `UPDATE users
        SET bio=$2
        WHERE id=$1
        RETURNING bio`,
      [id, bio]
    )
    .then(({ rows }) => {
      // console.log("rows: ", rows);
      return rows;
    });
};

module.exports.mostRecentUsers = function() {
  return db
    .query(
      `
        SELECT first, last, url, id FROM users ORDER BY id DESC LIMIT 3
        `
    )
    .then(({ rows }) => rows);
};

module.exports.getMatchingUsers = id => {
  return db
    .query(
      // `SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1 OR CONCAT(first, ' ', last) ILIKE $1 ORDER BY id LIMIT 4`
      `SELECT * FROM users
            WHERE first ILIKE $1
            LIMIT 4`,
      [id + "%"]
    )
    .then(({ rows }) => rows);
};

module.exports.getRelationshipStatus = (recipient_id, sender_id) => {
  return db
    .query(
      `SELECT * FROM friendships
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1)`,
      [recipient_id, sender_id]
    )
    .then(({ rows }) => {
      // console.log("getRelationshipStatus rows: ", rows);
      return rows;
    });
};

module.exports.makeFriendRequest = (recipient_id, sender_id) => {
  // console.log("recipient_id: ", recipient_id);
  // console.log("password db updatePassword: ", newPassword);
  return db
    .query(
      `INSERT INTO friendships (sender_id, recipient_id)
            VALUES ($1, $2)
            RETURNING id`,
      [recipient_id, sender_id]
    )
    .then(({ rows }) => {
      // console.log("makeFriendRequest rows: ", rows);
      return rows;
    });
};

module.exports.acceptFriendRequest = (recipient_id, sender_id) => {
  return db
    .query(
      `UPDATE friendships
            SET accepted=true
            WHERE sender_id=$2 AND recipient_id=$1
            RETURNING id`,
      [recipient_id, sender_id]
    )
    .then(({ rows }) => {
      // console.log("acceptFriendRequest rows: ", rows);
      return rows;
    });
};

module.exports.endFriendship = (recipient_id, sender_id) => {
  return db
    .query(
      `DELETE FROM friendships
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1);`,
      [recipient_id, sender_id]
    )
    .then(({ rows }) => {
      // console.log("endFriendship rows: ", rows);
      return rows;
    });
};

module.exports.getAllFriendsAndWannabes = id => {
  return db
    .query(
      `SELECT users.id, first, last, url, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
  ;`,
      [id]
    )
    .then(({ rows }) => {
      // console.log("getAllFriendsAndWannabes rows: ", rows);
      return rows;
    });
};

module.exports.getLastTenChatMessages = function() {
  return db
    .query(
      `SELECT users.id, chats.id as id, first, last, url, message
      FROM chats
      JOIN users
      ON user_id = users.id
      ORDER BY chats.id DESC LIMIT 10
  ;`
    )
    .then(({ rows }) => {
      // console.log("getLastTenChatMessages rows: ", rows);
      return rows;
    });
};

module.exports.insertChatMessages = function(user_id, message) {
  return db
    .query(
      `INSERT INTO chats (user_id, message)
        VALUES ($1, $2) RETURNING *`,
      [user_id, message]
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports.infoMessageSender = id => {
  return db
    .query(
      `SELECT chats.id as id, user_id, first, last, url, message FROM chats
            JOIN users
            ON chats.user_id=users.id
            WHERE chats.id=$1`,
      [id]
    )
    .then(({ rows }) => rows);
};

module.exports.searchOnlineUsers = arrayOfUsers => {
  return db
    .query(
      `SELECT id, first, last, url
            FROM users
            WHERE id = ANY ($1)`,
      [arrayOfUsers]
    )
    .then(({ rows }) => rows);
};
