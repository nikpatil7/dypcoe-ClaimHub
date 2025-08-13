const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Simplified model since we only have one hardcoded guard
class User {
  static async findByUsername(username) {
    if (username === config.GUARD_CREDENTIALS.username) {
      return {
        username: config.GUARD_CREDENTIALS.username,
        password: config.GUARD_CREDENTIALS.password,
        role: 'guard'
      };
    }
    return null;
  }

  static async comparePassword(candidatePassword, userPassword) {
    return candidatePassword === userPassword;
  }

  static getSignedJwtToken(user) {
    return jwt.sign(
      { id: user.username, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );
  }
}

module.exports = User;