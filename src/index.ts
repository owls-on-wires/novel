/**
 * Properties that can be applied to HTML elements
 */
export interface ElementProps {
  /** Element class names */
  className?: string;
  /** Alternative to className */
  classes?: string;
  /** Dataset attributes */
  data?: Record<string, string>;
  /** Event handlers */
  handlers?: Record<string, (event: Event) => void>;
  /** Element ID */
  id?: string;
  /** Any other valid HTML attributes */
  [key: string]: any;
}

/**
 * Function signature for creating native HTML elements
 */
export type NativeElementFunction = {
  (): HTMLElement;
  (children: string | number): HTMLElement;
  (children: HTMLElement[]): HTMLElement;
  (props: ElementProps): HTMLElement;
  (props: ElementProps, children: string | number): HTMLElement;
  (props: ElementProps, children: HTMLElement[]): HTMLElement;
};

/**
 * HTML element functions mapped by tag name, returning native DOM elements
 */
export type NativeHtmlElements = Record<string, NativeElementFunction>;

/**
 * Creates a native DOM element with the specified properties and children
 */
function createNativeDOMElement(tag: string, props: ElementProps = {}, children: string | number | HTMLElement[] = []): HTMLElement {
  const element = document.createElement(tag);
  
  // Apply props
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      // Event handler
      const eventType = key.substring(2);
      element.addEventListener(eventType, value);
    } else if (key === 'className') {
      element.className = value;
    } else if (key === 'data' && typeof value === 'object') {
      // Data attributes
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.setAttribute(`data-${dataKey}`, String(dataValue));
      });
    } else {
      // Regular attribute
      element.setAttribute(key, value);
    }
  });
  
  // Handle children
  if (typeof children === 'string' || typeof children === 'number') {
    element.textContent = children.toString();
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * Creates a function that generates native DOM elements for a given HTML tag
 *
 * @param tag - HTML tag name to create elements for
 * @returns A function that creates native DOM elements with these patterns:
 * - tag() → empty element
 * - tag('text'|42) → element with text content
 * - tag({ props }) → element with properties
 * - tag([elements]) → element with child elements
 * - tag({ props }, 'text'|42) → element with properties and text
 * - tag({ props }, [elements]) → element with properties and children
 */
export function createNativeElementFunction(tag: string): NativeElementFunction {
  return ((param1: any = null, param2: any = null): HTMLElement => {
    let props: ElementProps = {};
    let children: string | number | HTMLElement[] = [];

    try {
      // Handle each valid parameter pattern
      if (param1 === null && param2 === null) {
        /* empty element */
      } else if (Array.isArray(param1) && param2 === null) {
        children = param1;
      } else if (
        (typeof param1 === 'string' || typeof param1 === 'number') &&
        param2 === null
      ) {
        children = param1;
      } else if (
        typeof param1 === 'object' &&
        param1 !== null &&
        !Array.isArray(param1) &&
        !(param1 instanceof HTMLElement) &&
        param2 === null
      ) {
        props = param1;
      } else if (
        typeof param1 === 'object' &&
        param1 !== null &&
        !Array.isArray(param1) &&
        !(param1 instanceof HTMLElement) &&
        Array.isArray(param2)
      ) {
        props = param1;
        children = param2;
      } else if (
        typeof param1 === 'object' &&
        param1 !== null &&
        !Array.isArray(param1) &&
        !(param1 instanceof HTMLElement) &&
        (typeof param2 === 'string' || typeof param2 === 'number')
      ) {
        props = param1;
        children = param2;
      } else {
        const errorMessage = [
          `Invalid parameters for <${tag}> element creation.`,
          'Received:',
          `- param1: ${JSON.stringify(param1)} (${typeof param1})`,
          `- param2: ${JSON.stringify(param2)} (${typeof param2})`,
        ].join('\n');

        throw new Error(errorMessage);
      }

      // Handle className and classes props
      if (props.className || props.classes) {
        const classNameList = (props.className || '').split(' ');
        const classesList = (props.classes || '').split(' ');

        const uniqueClasses = new Set(
          [...classNameList, ...classesList].filter(Boolean),
        );

        props.className = Array.from(uniqueClasses).join(' ');
        delete props.classes;
      }

      return createNativeDOMElement(tag, props, children);
    } catch (error) {
      console.error(`Error creating ${tag} element:`, (error as Error).message);
      throw error;
    }
  }) as NativeElementFunction;
}

/**
 * List of HTML element tag names supported by the library
 */
const htmlElements = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'search',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'svg',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
] as const;

/**
 * Object containing functions for creating native HTML elements.
 * Each function is named after its corresponding HTML tag and returns a native HTMLElement
 * that can be used directly with the native DOM API. For example:
 * - html.div() → empty div element
 * - html.p('text') → paragraph element with text
 * - html.button({ onclick: fn }, 'Click me') → button element with click handler and text
 * - html.ul([html.li('Item 1'), html.li('Item 2')]) → unordered list with items
 * 
 * All returned elements are native HTMLElements that work directly with:
 * - document.body.appendChild(element)
 * - element.addEventListener('click', handler)
 * - element.textContent = 'new text'
 * - element.classList.add('class-name')
 * - And all other native DOM APIs
 */
const html: NativeHtmlElements = htmlElements.reduce((acc, tag) => {
  acc[tag] = createNativeElementFunction(tag);
  return acc;
}, {} as NativeHtmlElements);

export { html };
