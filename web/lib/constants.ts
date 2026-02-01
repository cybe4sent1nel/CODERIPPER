// Language configurations for the code editor
export const LANGUAGES = {
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    monacoLanguage: 'javascript',
    defaultCode: `// Welcome to CodeRipper - JavaScript Editor
console.log("Hello, World!");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
    icon: `<svg viewBox="0 0 24 24" fill="#F7DF1E"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>`
  },
  python: {
    name: 'Python',
    extension: 'py',
    monacoLanguage: 'python',
    defaultCode: `# Welcome to CodeRipper - Python Editor
print("Hello, World!")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"Fibonacci(10): {fibonacci(10)}")`,
    icon: `<svg viewBox="0 0 24 24" fill="#3776AB"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>`
  },
  typescript: {
    name: 'TypeScript',
    extension: 'ts',
    monacoLanguage: 'typescript',
    defaultCode: `// Welcome to CodeRipper - TypeScript Editor
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "CodeRipper User",
  age: 25
};

console.log(\`Hello, \${user.name}! You are \${user.age} years old.\`);`,
    icon: `<svg viewBox="0 0 24 24" fill="#3178C6"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>`
  },
  java: {
    name: 'Java',
    extension: 'java',
    monacoLanguage: 'java',
    defaultCode: `// Welcome to CodeRipper - Java Editor
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        System.out.println("Fibonacci(10): " + fibonacci(10));
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
    icon: `<svg viewBox="0 0 24 24" fill="#ED8B00"><path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639"/></svg>`
  },
  cpp: {
    name: 'C++',
    extension: 'cpp',
    monacoLanguage: 'cpp',
    defaultCode: `// Welcome to CodeRipper - C++ Editor
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Hello, World!" << endl;
    cout << "Fibonacci(10): " << fibonacci(10) << endl;
    return 0;
}`,
    icon: `<svg viewBox="0 0 24 24" fill="#00599C"><path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.109-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79v.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79v.79z"/></svg>`
  },
  go: {
    name: 'Go',
    extension: 'go',
    monacoLanguage: 'go',
    defaultCode: `// Welcome to CodeRipper - Go Editor
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Hello, World!")
    fmt.Printf("Fibonacci(10): %d\\n", fibonacci(10))
}`,
    icon: `<svg class="svg-icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M77.59872 472.388267c-1.993387 0-2.491733-0.996693-1.49504-2.491734l10.461867-13.448533c0.996693-1.49504 3.488427-2.491733 5.4784-2.491733h177.851733c1.989973 0 2.491733 1.49504 1.491627 2.99008l-8.465067 12.9536c-1.000107 1.491627-3.488427 2.986667-4.983467 2.986666zM2.372267 518.222507c-1.989973 0-2.491733-0.996693-1.491627-2.491734l10.461867-13.448533c0.99328-1.498453 3.485013-2.491733 5.4784-2.491733h227.167573c1.993387 0 2.99008 1.491627 2.491733 2.986666l-3.986773 11.956907c-0.498347 1.993387-2.491733 2.99008-4.481707 2.99008zM122.9312 564.053333c-1.989973 0-2.491733-1.49504-1.49504-2.99008l6.976853-12.45184c0.996693-1.49504 2.99008-2.99008 4.983467-2.99008h99.6352c1.989973 0 2.986667 1.49504 2.986667 3.488427l-0.996694 11.953493c0 1.993387-1.993387 3.488427-3.488426 3.488427zM640.037547 463.42144c-31.382187 7.970133-52.804267 13.950293-83.694934 21.920427-7.468373 1.993387-7.96672 2.491733-14.445226-4.983467-7.471787-8.465067-12.950187-13.94688-23.415467-18.930347-31.382187-15.44192-61.771093-10.9568-90.166613 7.4752-33.877333 21.917013-51.31264 54.299307-50.814294 94.651734 0.498347 39.85408 27.897173 72.73472 67.252907 78.21312 33.877333 4.48512 62.272853-7.471787 84.691627-32.877227 4.481707-5.481813 8.465067-11.45856 13.448533-18.432h-96.146773c-10.461867 0-12.9536-6.478507-9.465174-14.946987 6.475093-15.44192 18.432-41.34912 25.40544-54.30272 1.49504-2.986667 4.983467-7.970133 12.455254-7.970133h181.336746c-0.996693 13.448533-0.996693 26.903893-2.99008 40.352427-5.4784 35.87072-18.930347 68.747947-40.850773 97.641813-35.867307 47.32928-82.694827 76.721493-141.981013 84.691627-48.820907 6.475093-94.153387-2.99008-134.007467-32.88064-36.864-27.897173-57.787733-64.761173-63.269547-110.592-6.475093-54.306133 9.465173-103.123627 42.345814-145.967787 35.36896-46.329173 82.199893-75.721387 139.48928-86.186667 46.830933-8.465067 91.665067-2.986667 132.017493 24.41216 26.402133 17.435307 45.33248 41.34912 57.787733 70.2464 2.99008 4.481707 0.996693 6.970027-4.983466 8.465067z" fill="#00ACC1" /><path d="M804.932267 738.914987c-45.329067-0.996693-86.678187-13.950293-121.5488-43.840854-29.395627-25.40544-47.827627-57.787733-53.807787-96.146773-8.966827-56.296107 6.478507-106.113707 40.352427-150.449493 36.369067-47.824213 80.206507-72.73472 139.48928-83.196587 50.814293-8.966827 98.64192-3.986773 141.981013 25.408853 39.355733 26.897067 63.767893 63.266133 70.2464 111.090347 8.465067 67.25632-10.963627 122.053973-57.2928 168.881493-32.88064 33.3824-73.233067 54.30272-119.56224 63.767894-13.448533 2.491733-26.90048 2.99008-39.85408 4.48512z m118.56896-201.263787c-0.498347-6.478507-0.498347-11.45856-1.49504-16.442027-8.966827-49.319253-54.299307-77.216427-101.628587-66.2528-46.329173 10.458453-76.219733 39.850667-87.176533 86.678187-8.97024 38.8608 9.960107 78.216533 45.827413 94.1568 27.40224 11.956907 54.801067 10.461867 81.2032-2.99008 39.355733-20.425387 60.777813-52.30592 63.269547-95.15008z" fill="#00ACC1" /></svg>`
  },
  rust: {
    name: 'Rust',
    extension: 'rs',
    monacoLanguage: 'rust',
    defaultCode: `// Welcome to CodeRipper - Rust Editor
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    println!("Hello, World!");
    println!("Fibonacci(10): {}", fibonacci(10));
}`,
    icon: `<svg class="svg-icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666C307.2 885.333333 138.666667 716.8 138.666667 512S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#FF7043"/>
      <path d="M512 320c-106.039467 0-192 85.960533-192 192s85.960533 192 192 192 192-85.960533 192-192-85.960533-192-192-192z m0 320c-70.692267 0-128-57.307733-128-128s57.307733-128 128-128 128 57.307733 128 128-57.307733 128-128 128z" fill="#FF7043"/>
    </svg>`
  },
  kotlin: {
    name: 'Kotlin',
    extension: 'kt',
    monacoLanguage: 'kotlin',
    defaultCode: `// Welcome to CodeRipper - Kotlin Editor
fun main() {
    println("Hello, World!")
    
    val result = fibonacci(10)
    println("Fibonacci(10): $result")
}

fun fibonacci(n: Int): Int {
    return when (n) {
        0 -> 0
        1 -> 1
        else -> fibonacci(n - 1) + fibonacci(n - 2)
    }
}`,
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 24H0V0h24L12 12 24 24z" fill="url(#kotlin-gradient)"/>
      <defs>
        <linearGradient id="kotlin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#E44857"/>
          <stop offset="25%" style="stop-color:#C711E1"/>
          <stop offset="50%" style="stop-color:#7F52FF"/>
          <stop offset="75%" style="stop-color:#0090FF"/>
          <stop offset="100%" style="stop-color:#3CE7F7"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  solidity: {
    name: 'Solidity',
    extension: 'sol',
    monacoLanguage: 'solidity',
    defaultCode: `// SPDX-License-Identifier: MIT
// Welcome to CodeRipper - Solidity Editor
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;
    uint256 public counter;
    
    event MessageUpdated(string oldMessage, string newMessage);
    
    constructor() {
        message = "Hello, Blockchain World!";
        counter = 0;
    }
    
    function setMessage(string memory _message) public {
        string memory oldMessage = message;
        message = _message;
        counter++;
        
        emit MessageUpdated(oldMessage, _message);
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`,
    icon: `<svg viewBox="0 0 24 24" fill="#363636" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.409 6.608L8 1l3.591 5.608L8 8.608 4.409 6.608zM8 10.392l3.591-2L16 14l-3.591 2-4.409-2-3.591-2L8 10.392zM4.409 17.392L8 23l3.591-5.608L8 15.392l-3.591 2z"/>
      <path d="M19.591 6.608L16 1l-3.591 5.608L16 8.608l3.591-2zM16 10.392l-3.591-2L8 14l3.591 2 4.409-2 3.591-2L16 10.392zM19.591 17.392L16 23l-3.591-5.608L16 15.392l3.591 2z"/>
    </svg>`
  },
  move: {
    name: 'Move',
    extension: 'move',
    monacoLanguage: 'rust', // Use Rust syntax highlighting as fallback
    defaultCode: `// Welcome to CodeRipper - Move Editor
module hello_world::hello {
    use std::debug;

    /// A simple greeting function
    fun say_hello() {
        debug::print(&b"Hello, Move Blockchain!");
    }

    /// Entry point for the Move program
    public entry fun main() {
        say_hello();
    }

    #[test]
    fun test_hello() {
        say_hello();
    }
}`,
    icon: `<svg viewBox="0 0 24 24" fill="#4F46E5" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="18" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="18" r="3"/>
      <path d="M9 6h6M6 9v6M18 9v6M9 18h6" stroke="#4F46E5" stroke-width="2" fill="none"/>
    </svg>`
  },
  cairo: {
    name: 'Cairo',
    extension: 'cairo',
    monacoLanguage: 'rust', // Use Rust syntax highlighting as fallback
    defaultCode: `// Welcome to CodeRipper - Cairo Editor
use debug::PrintTrait;

fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fn main() {
    'Hello, Cairo Blockchain!'.print();
    
    let result = fibonacci(10);
    result.print();
}

#[cfg(test)]
mod tests {
    use super::fibonacci;
    
    #[test]
    fn test_fibonacci() {
        assert(fibonacci(5) == 5, 'fibonacci(5) should be 5');
    }
}`,
    icon: `<svg viewBox="0 0 24 24" fill="#FF6B35" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l8 6-8 6-8-6 8-6z"/>
      <path d="M4 8l8 6 8-6v8l-8 6-8-6V8z" opacity="0.7"/>
    </svg>`
  },
  vyper: {
    name: 'Vyper',
    extension: 'vy',
    monacoLanguage: 'python', // Use Python syntax highlighting
    defaultCode: `# @version ^0.3.0
# Welcome to CodeRipper - Vyper Editor

# State variables
message: public(String[100])
counter: public(uint256)
owner: public(address)

# Events
event MessageUpdated:
    oldMessage: String[100]
    newMessage: String[100]
    sender: address

@external
def __init__():
    self.message = "Hello, Vyper Blockchain!"
    self.counter = 0
    self.owner = msg.sender

@external
def setMessage(_message: String[100]):
    old_message: String[100] = self.message
    self.message = _message
    self.counter += 1
    
    log MessageUpdated(old_message, _message, msg.sender)

@view
@external
def getMessage() -> String[100]:
    return self.message

@view
@external
def getCounter() -> uint256:
    return self.counter`,
    icon: `<svg viewBox="0 0 24 24" fill="#3C3C3D" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
      <path d="M12 8v8m-4-6l4-2 4 2-4 2-4-2z" stroke="white" stroke-width="1" fill="none"/>
    </svg>`
  }
} as const;

export type LanguageKey = keyof typeof LANGUAGES;

// Monaco editor themes
export const EDITOR_THEMES = {
  'vs': 'Visual Studio Light',
  'vs-dark': 'Visual Studio Dark',
  'hc-black': 'High Contrast Dark',
  'hc-light': 'High Contrast Light'
} as const;

// Code snippets for different languages
export const SNIPPETS = {
  javascript: [
    {
      title: 'Arrow Function',
      code: `const myFunction = (param1, param2) => {
  return param1 + param2;
};`
    },
    {
      title: 'Async/Await',
      code: `const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};`
    },
    {
      title: 'Promise',
      code: `const myPromise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});`
    }
  ],
  python: [
    {
      title: 'List Comprehension',
      code: `numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 == 0]
print(squares)`
    },
    {
      title: 'Class Definition',
      code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name} and I'm {self.age} years old."`
    },
    {
      title: 'Context Manager',
      code: `with open('file.txt', 'r') as file:
    content = file.read()
    print(content)`
    }
  ]
} as const;

// Features for the landing page
export const FEATURES = [
  {
    title: 'Multi-Language Support',
    description: 'Support for 7+ programming languages with syntax highlighting and intelligent code completion.',
    icon: '🌍'
  },
  {
    title: 'AI-Powered Assistant',
    description: 'Get intelligent code explanations, error debugging, and optimization suggestions powered by AI.',
    icon: '🤖'
  },
  {
    title: 'Real-time Collaboration',
    description: 'Share code snippets instantly and collaborate with your team in real-time.',
    icon: '👥'
  },
  {
    title: 'Cloud Compilation',
    description: 'Compile and run your code in the cloud with support for multiple runtime environments.',
    icon: '☁️'
  },
  {
    title: 'Code Sharing',
    description: 'Create shareable links for your code snippets and download them in various formats.',
    icon: '🔗'
  },
  {
    title: 'Beautiful Themes',
    description: 'Multiple beautiful themes with dark/light mode support for comfortable coding.',
    icon: '🎨'
  }
] as const;

// Pricing plans for SaaS model
export const PRICING_PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      '5 code executions per day',
      'Basic language support',
      'Community support',
      'Basic AI features'
    ],
    buttonText: 'Get Started',
    highlighted: false
  },
  {
    name: 'Pro',
    price: 9,
    period: 'month',
    features: [
      'Unlimited code executions',
      'All programming languages',
      'Priority support',
      'Advanced AI features',
      'Code collaboration',
      'Export to multiple formats'
    ],
    buttonText: 'Start Free Trial',
    highlighted: true
  },
  {
    name: 'Team',
    price: 29,
    period: 'month',
    features: [
      'Everything in Pro',
      'Team collaboration tools',
      'Admin dashboard',
      'Custom integrations',
      'Dedicated support',
      'White-label options'
    ],
    buttonText: 'Contact Sales',
    highlighted: false
  }
] as const;