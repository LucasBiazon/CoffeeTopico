db = db.getSiblingDB('coffee_recs');
db.createUser({
  user: 'app_user',
  pwd: 'app_pass',
  roles: [{ role: 'readWrite', db: 'coffee_recs' }]
});
