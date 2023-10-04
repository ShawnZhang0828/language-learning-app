class User {
  constructor(
    email,
    username,
    password,
    level,
    originalLang,
    targetLang,
    reason
  ) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.level = level;
    this.originalLang = originalLang;
    this.targetLang = targetLang;
    this.reason = reason;
  }
}

export default User;
