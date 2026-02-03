// Sample file with PII and secrets for testing

// Social Security Number
const testSSN = "123-45-6789";
const anotherSSN = "987 65 4321";

// Credit Card Numbers
const visaCard = "4111111111111111";
const masterCard = "5500000000000004";
const amexCard = "340000000000009";

// AWS Credentials (AWS example keys from docs - not real)
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzzzzzzzz";

// GitHub Token (obviously fake format for testing)
const githubToken = "ghp_000000000000000000000000000000000000";

// Slack Token - removed due to GitHub push protection
// Pattern tested: xox[baprs]-[numbers]-[numbers]-[alphanumeric]
// const slackToken = "xoxb-...-...-...";

// Private Key
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF
-----END RSA PRIVATE KEY-----
`;

// Database Connection String (fake credentials for testing)
const mongoUri = "mongodb://testuser:testpassword@db.example.com:27017/mydb";
const postgresUri = "postgres://testuser:testpass@localhost:5432/database";

// Real email addresses (not example.com)
const userEmail = "john.doe@gmail.com";
const supportEmail = "support@company.org";

// Phone numbers
const phoneNumber = "(555) 123-4567";
const altPhone = "+1 555-987-6543";

// JWT Token
const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Bearer Token
const authHeader = "Bearer abc123xyz789token";

// Generic API keys
const stripeKey = "api_key: sk_test_abcdefghijklmnopqrstuvwxyz";
const sendgridKey = "access_token = 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'";
