/**
 * Sample course data for the Mini Course Platform
 * This demonstrates how to structure course and lesson data
 */

export const coursesData = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Learn the core concepts of React including components, props, state, and hooks.',
    duration: '4 hours',
    level: 'Beginner',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
    lessons: [
      {
        id: 'introduction',
        title: 'Introduction to React',
        duration: '15 min',
        content: `
          <h2>Welcome to React!</h2>
          <p>React is a popular JavaScript library for building user interfaces, particularly web applications. 
          It was created by Facebook and is now maintained by Facebook and the community.</p>
          
          <h3>What makes React special?</h3>
          <ul>
            <li><strong>Component-Based:</strong> Build encapsulated components that manage their own state</li>
            <li><strong>Declarative:</strong> React makes it painless to create interactive UIs</li>
            <li><strong>Learn Once, Write Anywhere:</strong> Develop new features without rewriting existing code</li>
          </ul>
          
          <h3>Prerequisites</h3>
          <p>Before starting this course, you should have:</p>
          <ul>
            <li>Basic knowledge of HTML and CSS</li>
            <li>Understanding of JavaScript fundamentals</li>
            <li>Familiarity with ES6+ features</li>
          </ul>
        `
      },
      {
        id: 'components',
        title: 'Understanding Components',
        duration: '25 min',
        content: `
          <h2>React Components</h2>
          <p>Components are the building blocks of React applications. They let you split the UI into 
          independent, reusable pieces, and think about each piece in isolation.</p>
          
          <h3>Functional Components</h3>
          <p>The simplest way to define a component is to write a JavaScript function:</p>
          <pre><code>function Welcome(props) {
  return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;;
}</code></pre>
          
          <h3>Component Composition</h3>
          <p>Components can refer to other components in their output. This lets us use the same 
          component abstraction for any level of detail.</p>
          
          <h3>Props</h3>
          <p>Props are arguments passed into React components. Props are passed to components 
          via HTML attributes and are read-only.</p>
        `
      },
      {
        id: 'state-hooks',
        title: 'State and Hooks',
        duration: '30 min',
        content: `
          <h2>State and Hooks</h2>
          <p>State allows React components to change their output over time in response to user actions, 
          network responses, and anything else.</p>
          
          <h3>useState Hook</h3>
          <p>The useState Hook lets you add state to functional components:</p>
          <pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
          
          <h3>useEffect Hook</h3>
          <p>The useEffect Hook lets you perform side effects in functional components. 
          It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount 
          combined in React classes.</p>
        `
      }
    ]
  },
  {
    id: 'javascript-advanced',
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts including async/await, closures, and modern ES6+ features.',
    duration: '6 hours',
    level: 'Intermediate',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    lessons: [
      {
        id: 'async-await',
        title: 'Async/Await and Promises',
        duration: '40 min',
        content: `
          <h2>Asynchronous JavaScript</h2>
          <p>JavaScript is single-threaded, but it can handle asynchronous operations efficiently 
          using promises and async/await syntax.</p>
          
          <h3>Promises</h3>
          <p>A Promise is an object representing the eventual completion or failure of an asynchronous operation:</p>
          <pre><code>const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

myPromise.then(result => {
  console.log(result); // 'Success!'
});</code></pre>
          
          <h3>Async/Await</h3>
          <p>Async/await makes asynchronous code look and behave more like synchronous code:</p>
          <pre><code>async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}</code></pre>
        `
      },
      {
        id: 'closures',
        title: 'Closures and Scope',
        duration: '35 min',
        content: `
          <h2>Understanding Closures</h2>
          <p>A closure is the combination of a function bundled together with references to its 
          surrounding state (the lexical environment).</p>
          
          <h3>What is a Closure?</h3>
          <p>Closures give you access to an outer function's scope from an inner function:</p>
          <pre><code>function outerFunction(x) {
  // This is the outer function's scope
  
  function innerFunction(y) {
    // This inner function has access to x
    console.log(x + y);
  }
  
  return innerFunction;
}

const myFunction = outerFunction(10);
myFunction(5); // Outputs: 15</code></pre>
          
          <h3>Practical Applications</h3>
          <ul>
            <li>Data Privacy and Encapsulation</li>
            <li>Function Factories</li>
            <li>Callbacks and Event Handlers</li>
            <li>Module Pattern</li>
          </ul>
        `
      },
      {
        id: 'es6-features',
        title: 'Modern ES6+ Features',
        duration: '45 min',
        content: `
          <h2>Modern JavaScript Features</h2>
          <p>ES6 and later versions introduced many powerful features that make JavaScript more expressive and easier to work with.</p>
          
          <h3>Destructuring Assignment</h3>
          <pre><code>// Array destructuring
const [a, b, c] = [1, 2, 3];

// Object destructuring
const { name, age } = { name: 'John', age: 30 };

// Function parameter destructuring
function greet({ name, age }) {
  return \`Hello \${name}, you are \${age} years old\`;
}</code></pre>
          
          <h3>Spread and Rest Operators</h3>
          <pre><code>// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Rest operator
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}</code></pre>
          
          <h3>Template Literals</h3>
          <pre><code>const name = 'World';
const greeting = \`Hello, \${name}!\`;

// Multi-line strings
const multiLine = \`
  This is a
  multi-line
  string
\`;</code></pre>
        `
      }
    ]
  },
  {
    id: 'web-apis',
    title: 'Web APIs and DOM',
    description: 'Explore browser APIs, DOM manipulation, and modern web development techniques.',
    duration: '5 hours',
    level: 'Intermediate',
    image: 'https://images.pexels.com/photos/11035539/pexels-photo-11035539.jpeg?auto=compress&cs=tinysrgb&w=400',
    lessons: [
      {
        id: 'dom-manipulation',
        title: 'DOM Manipulation',
        duration: '30 min',
        content: `
          <h2>Document Object Model (DOM)</h2>
          <p>The DOM is a programming interface for web documents. It represents the page so that 
          programs can change the document structure, style, and content.</p>
          
          <h3>Selecting Elements</h3>
          <pre><code>// Modern methods
const element = document.querySelector('.my-class');
const elements = document.querySelectorAll('div');

// Traditional methods
const elementById = document.getElementById('myId');
const elementsByClass = document.getElementsByClassName('myClass');</code></pre>
          
          <h3>Modifying Elements</h3>
          <pre><code>// Change content
element.textContent = 'New text';
element.innerHTML = '&lt;strong&gt;Bold text&lt;/strong&gt;';

// Change attributes
element.setAttribute('class', 'new-class');
element.classList.add('another-class');

// Change styles
element.style.color = 'red';
element.style.backgroundColor = 'blue';</code></pre>
          
          <h3>Creating Elements</h3>
          <pre><code>const newElement = document.createElement('div');
newElement.textContent = 'Hello World';
document.body.appendChild(newElement);</code></pre>
        `
      },
      {
        id: 'fetch-api',
        title: 'Fetch API and HTTP Requests',
        duration: '35 min',
        content: `
          <h2>Fetch API</h2>
          <p>The Fetch API provides a JavaScript interface for accessing and manipulating parts of the HTTP pipeline, such as requests and responses.</p>
          
          <h3>Basic Fetch Request</h3>
          <pre><code>fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));</code></pre>
          
          <h3>POST Request with Data</h3>
          <pre><code>fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data));</code></pre>
          
          <h3>Error Handling</h3>
          <pre><code>async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}</code></pre>
        `
      },
      {
        id: 'local-storage',
        title: 'Local Storage and Session Storage',
        duration: '25 min',
        content: `
          <h2>Web Storage APIs</h2>
          <p>Web Storage APIs provide mechanisms for storing data in the user's browser. 
          There are two main types: localStorage and sessionStorage.</p>
          
          <h3>localStorage</h3>
          <p>Data persists until explicitly cleared:</p>
          <pre><code>// Store data
localStorage.setItem('username', 'john_doe');
localStorage.setItem('preferences', JSON.stringify({ theme: 'dark' }));

// Retrieve data
const username = localStorage.getItem('username');
const preferences = JSON.parse(localStorage.getItem('preferences'));

// Remove data
localStorage.removeItem('username');
localStorage.clear(); // Remove all</code></pre>
          
          <h3>sessionStorage</h3>
          <p>Data persists only for the session (until tab is closed):</p>
          <pre><code>// Same API as localStorage
sessionStorage.setItem('tempData', 'temporary value');
const tempData = sessionStorage.getItem('tempData');</code></pre>
          
          <h3>Storage Events</h3>
          <pre><code>window.addEventListener('storage', (e) => {
  console.log('Storage changed:', e.key, e.newValue);
});</code></pre>
          
          <h3>Best Practices</h3>
          <ul>
            <li>Always check if storage is available</li>
            <li>Handle storage quota exceeded errors</li>
            <li>Use JSON.stringify/parse for objects</li>
            <li>Consider security implications</li>
          </ul>
        `
      }
    ]
  }
];

/**
 * Helper function to get a course by ID
 * @param {string} courseId - The ID of the course to retrieve
 * @returns {Object|undefined} The course object or undefined if not found
 */
export const getCourseById = (courseId) => {
  return coursesData.find(course => course.id === courseId);
};

/**
 * Helper function to get a lesson by course ID and lesson ID
 * @param {string} courseId - The ID of the course
 * @param {string} lessonId - The ID of the lesson
 * @returns {Object|undefined} The lesson object or undefined if not found
 */
export const getLessonById = (courseId, lessonId) => {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  
  return course.lessons.find(lesson => lesson.id === lessonId);
};