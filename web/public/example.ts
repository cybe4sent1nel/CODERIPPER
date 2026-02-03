// Welcome to CodeRipper - TypeScript Editor

interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "CodeRipper User",
  age: 25
};

console.log(`Hello, ${user.name}! You are ${user.age} years old.`);

// Export to avoid unused variable warning
export { user };
