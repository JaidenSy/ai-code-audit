// Sample file with AI-generated code patterns for testing

// This is a very long comment that explains in great detail what the following function does, including every single step of the implementation process and why each decision was made along the way, which is a common pattern in AI-generated code

// Increment the counter variable by one
function incrementCounter(counter: number) {
  // Initialize the result variable to store the incremented value
  let result = counter + 1;
  // Return the result
  return result;
}

// Placeholder values left in
const apiEndpoint = "your_api_endpoint_here";
const username = "placeholder";
const config = {
  key: "TODO",
  secret: "FIXME",
  token: "insert_token_here"
};

// Generic numbered variable names
function processData(data: any) {
  const result1 = data.map(item => item.id);
  const result2 = result1.filter(id => id > 0);
  const temp1 = result2.length;
  const obj1 = { count: temp1 };
  return obj1;
}

// Unnecessary async
async function getStaticValue() {
  return 42;
}

// Fetch without error handling
function fetchUserData(userId: string) {
  fetch(`/api/users/${userId}`).then(res => res.json());
}

// Console debug methods in production code
function debugUser(user: any) {
  console.debug('User object:', user);
  console.table(user.permissions);
  console.trace('Call stack');
}

// Set the user name
function setUserName(user: any, name: string) {
  // Get the current name
  const currentName = user.name;
  // Update the name
  user.name = name;
  // Return the updated user
  return user;
}
