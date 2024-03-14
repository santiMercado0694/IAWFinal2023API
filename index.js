require('dotenv').config({ path: "src/.env" })
const swagger = require('./swagger.js');
const cors = require('cors');
const compression = require('compression');
const webpush = require('webpush');

const express = require('express'),
      bodyParser = require('body-parser'),
      app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

webpush.setVapidDetails(VAPID_SUBJECT,VAPID_PUBLIC_KEY,VAPID_PRIVATE_KEY);

//Swagger
app.use(
    '/swagger',
    swagger.serve, 
    swagger.setup
  );

//Routes Ecommerce
app.use(require('./src/routes.js'));

//Routes Web Push
app.post('/subscribe', (req, res) => {
  // Get pushSubcription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({title: 'Push Test'});

  // Pass object into sendNotification
  webpush.sendNotification(subscription, payload).catch(err => console.error(err));
});


const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

