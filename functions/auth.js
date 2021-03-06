const { db } = require('./admin');

const createProfile = (userRecord, context) => {
  const { email, uid, displayName } = userRecord;

  return db
    .collection('users')
    .doc(uid)
    .set({ email, displayName })
    .catch(console.error);
}

const deleteProfile = (userRecord, context) => {
  const { uid } = userRecord;
  return db
    .collection('users')
    .doc(uid)
    .delete()
    .catch(console.error);
}

module.exports = {
  createProfile,
  deleteProfile
}
