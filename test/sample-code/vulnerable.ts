// Sample file with intentional security vulnerabilities for testing

// SQL Injection vulnerability
async function getUserById(userId: string) {
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  return db.execute(query);
}

// XSS via innerHTML
function renderUserContent(content: string) {
  document.getElementById('output').innerHTML = content;
}

// Command injection
import { exec } from 'child_process';
function runUserCommand(filename: string) {
  exec(`cat ${filename}`);
}

// Eval usage
function parseConfig(configStr: string) {
  return eval(configStr);
}

// Hardcoded password
const DB_PASSWORD = "super_secret_password123";
const API_KEY = "sk_live_abcdefghijklmnop123456";

// Insecure HTTP
const endpoint = "http://api.external-service.com/data";

// JWT without verification
import jwt from 'jsonwebtoken';
function decodeToken(token: string) {
  return jwt.decode(token);
}

// Disabled SSL
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Weak crypto
import crypto from 'crypto';
function hashPassword(password: string) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// Insecure random
function generateToken() {
  return 'token_' + Math.random().toString(36);
}

// dangerouslySetInnerHTML
function UserBio({ bio }) {
  return <div dangerouslySetInnerHTML={{ __html: bio }} />;
}
