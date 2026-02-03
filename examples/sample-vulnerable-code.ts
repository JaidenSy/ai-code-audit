/**
 * Example file demonstrating issues that AI Code Audit will catch
 * This file intentionally contains security vulnerabilities and bad patterns
 */

// AI Pattern: Overly verbose comment explaining obvious code
// This is a function that increments a counter value by adding one to the current value and returning the new incremented value
function incrementCounter(counter: number): number {
  // Increment the counter
  return counter + 1;
}

// Security: Potential SQL injection vulnerability
async function unsafeQuery(userId: string) {
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  return database.execute(query);
}

// Security: Hardcoded credentials (DO NOT DO THIS)
const config = {
  password: "hardcoded_secret_123",
  apiKey: "my_api_key_do_not_commit_this"
};

// Security: XSS vulnerability via innerHTML
function renderContent(html: string) {
  document.getElementById('content').innerHTML = html;
}

// PII: Potential PII in code
const testUser = {
  ssn: "123-45-6789",
  email: "john.doe@gmail.com",
  phone: "(555) 123-4567"
};

// AI Pattern: Placeholder values
const endpoint = "your_api_endpoint_here";
const token = "TODO";

// AI Pattern: Generic numbered variables
function processItems(items: any[]) {
  const result1 = items.filter(x => x.active);
  const result2 = result1.map(x => x.id);
  const temp1 = result2.length;
  return temp1;
}

// Security: eval() usage
function parseUserInput(input: string) {
  return eval(input);
}

// AI Pattern: fetch without error handling
function getData(url: string) {
  fetch(url).then(res => res.json());
}

// Security: Insecure HTTP URL
const apiUrl = "http://api.external-service.com/v1/data";

// License concern: Stack Overflow reference
// Code from: https://stackoverflow.com/questions/12345/example
function exampleFromSO() {
  return "copied code";
}
