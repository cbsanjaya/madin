const functions = require('firebase-functions');
const { createProfile, deleteProfile } = require('./auth');

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile),
  authOnDelete: functions.auth.user().onDelete(deleteProfile)
}
