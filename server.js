const express = require('express');
const app = express();
const db = require('./db');
app.use(require('cors')());

//don't forget your body parser!

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/api/departments', (req, res, next) => {
  db.readDepartments()
    .then(departments => res.send(departments))
    .catch(next);
});

app.get('/api/users', (req, res, next) => {
  db.readUsers()
    .then(users => res.send(users))
    .catch(next);
});

app.post('/api/departments', (req, res, next) => {
  db.createDepartment('english')
    .then(response => res.send(response))
    .catch(next);
});

app.post('/api/users', (req, res, next) => {
  db.createUser()
    .then(response => res.send(response))
    .catch(next);
});

app.use((req, res, next) => {
  next({ status: 404, message: `page not found - ${req.method} - ${req.url}` });
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err.toString() });
});

const port = process.env.PORT || 3000;

db.sync().then(async () => {
  console.log(await db.createDepartment('math'));

  console.log('synced');
  app.listen(port, () => console.log(`listening on port ${port}`));
});
