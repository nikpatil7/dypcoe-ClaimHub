const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Simplified model since we only have one hardcoded guard
class User {
  static async findByEmail(email) {
    if (email === config.GUARD_CREDENTIALS.email) {
      return {
        name: config.GUARD_CREDENTIALS.name,
        email: config.GUARD_CREDENTIALS.email,
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
      { id: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );
  }
}

module.exports = User;