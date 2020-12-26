First time using React! It was a challenge to learn so many new things, especially later on when I started using Redux and Sockets, but it was so much fun and I enjoyed drinking every drop of Club Mate over night :-)

https://pranamorar.herokuapp.com

BackendIn the back, a Node.js Express Server and a PostgreSQL database are keeping everything together. User information gets stored in multiple ways in the database: aside from plain information like name, crushes lists and chat messages, user profile pictures get uploaded to AWS S3, with a reference in the database.

Passwords are being salted, hashed and encrypted with Node and Bcrypt. Cookie-Sessions authenticate already logged in users. The platform is protected from potential SQL injections and CSURF attacks.

Reset your password: upon request, a key with an expiration date of some minutes gets stored in a Redis database and gets send out via AWS SES. If the entered key checks out, the user can then change their password.Edit profileEdit your profile and add a profile picture or a bio to show your potential crushes who you are.

Like other users: a search functionality lets you search for all registered users by their name. Additionally, the latest users who signed up get recommended. After visiting another profile page, users can like others. Once that request gets accepted by the other profile, they can both see each others friends list.Live chatUsing the WebSocket protocol with Socket.io, a site wide live chat is available for all logged in users to interact with.

Frontend: in the front, reusable React components make use of the global Redux state and provide a intuitive and fast user experience.The mobile first styling in CSS may or may not look familiar, but for learning purposes it was the smartest thing one could've done.
# testenamoro
