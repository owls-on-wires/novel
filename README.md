# Novel

A TypeScript library for creating native HTML DOM elements using functions.

## Installation

```bash
npm install @owls-on-wires/novel
```

## Usage

```javascript
import { html } from '@owls-on-wires/novel';

// Create elements that return native HTMLElement objects
const button = html.button({ onclick: () => alert('Hello!') }, 'Click me');
const list = html.ul([
  html.li('Item 1'),
  html.li('Item 2')
]);

// Add directly to DOM
document.body.appendChild(button);
document.body.appendChild(list);
```

## Element Creation Patterns

```javascript
// Empty element
html.div()

// With text content
html.p('Hello World')

// With properties
html.div({ id: 'main', className: 'container' })

// With children
html.ul([html.li('Item 1'), html.li('Item 2')])

// With properties and content
html.h1({ className: 'title' }, 'Page Title')

// With properties and children
html.div({ className: 'card' }, [
  html.h2('Title'),
  html.p('Content')
])
```

## Properties

```javascript
html.div({
  id: 'main',
  className: 'container',
  // Alternative to className
  classes: 'flex column',
  onclick: (e) => console.log('Clicked!'),
  data: { testid: 'main-div' },
  'aria-label': 'Main content'
})
```

You can use either `className` or `classes` for CSS classes. If both are provided, they will be merged together.

## Recommended Usage

Novel is useful for building reusable components. Here's a simple component that uses jQuery for rendering:

```javascript
import { html } from '@owls-on-wires/novel';
import $ from 'jquery';

function Counter(id, initialCount = 0) {
  let count = initialCount;
  const containerId = id;
  const containerSelector = `#${containerId}`;
  
  const render = () => {
    const container = html.div({ id: containerId, className: 'counter' }, [
      html.h3('Counter'),
      html.p(`Count: ${count}`),
      html.div({ className: 'buttons' }, [
        html.button({ onclick: () => { count--; update(); } }, '-'),
        html.button({ onclick: () => { count++; update(); } }, '+'),
        html.button({ onclick: () => { count = 0; update(); } }, 'Reset')
      ])
    ]);
    
    return container;
  };
  
  const update = () => {
    const newElement = render();
    $(containerSelector).replaceWith(newElement);
  };
  
  return { render, update };
}

$(document).ready(() => {
  const counter1 = Counter('counter-1', 5);
  const counter2 = Counter('counter-2', 10);
  
  $('body').append(counter1.render());
  $('body').append(counter2.render());
});
```
