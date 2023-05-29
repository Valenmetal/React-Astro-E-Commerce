import React, { createElement, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
import { optimize } from 'svgo';
/* empty css                                 */import { motion, AnimatePresence } from 'framer-motion';
import { Orbit } from '@uiball/loaders';
import { jsx, Fragment as Fragment$1, jsxs } from 'react/jsx-runtime';
/* empty css                                 *//* empty css                                */
/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	if (children != null) {
		newProps.children = React.createElement(StaticHtml, { value: children });
	}
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

function baseCreateComponent(cb, moduleId) {
  cb.isAstroComponentFactory = true;
  cb.moduleId = moduleId;
  return cb;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId);
  cb.propagation = opts.propagation;
  return cb;
}
function createComponent(arg1, moduleId) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId);
  } else {
    return createComponentWithOptions(arg1);
  }
}

const ASTRO_VERSION = "1.9.2";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLBytes extends Uint8Array {
}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  }
});
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
async function* unescapeChunksAsync(iterable) {
  for await (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const headAndContentSym = Symbol.for("astro.headAndContent");
function isHeadAndContent(obj) {
  return typeof obj === "object" && !!obj[headAndContentSym];
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

var _a$1;
const renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
class RenderTemplateResult {
  constructor(htmlParts, expressions) {
    this[_a$1] = true;
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [(_a$1 = renderTemplateResultSym, Symbol.toStringTag)]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && !!obj[renderTemplateResultSym];
}
async function* renderAstroTemplateResult(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}

function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function renderToString(result, componentFactory, props, children) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    const response = factoryResult;
    throw response;
  }
  let parts = new HTMLParts();
  const templateResult = isHeadAndContent(factoryResult) ? factoryResult.content : factoryResult;
  for await (const chunk of renderAstroTemplateResult(templateResult)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
function isAPropagatingComponent(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.propagation.has(factory.moduleId) && hint === "none") {
    hint = result.propagation.get(factory.moduleId);
  }
  return hint === "in-tree" || hint === "self";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message: "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message: "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${plural ? "s." : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were." : "it was not."} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) => `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message: "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message: "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported."
  },
  InvalidPrerenderExport: {
    title: "Invalid prerender export.",
    code: 3019,
    message: (prefix, suffix) => {
      let msg = `A \`prerender\` export has been detected, but its value cannot be statically analyzed.`;
      if (prefix !== "const")
        msg += `
Expected \`const\` declaration but got \`${prefix}\`.`;
      if (suffix !== "true")
        msg += `
Expected \`true\` value but got \`${suffix}\`.`;
      return msg;
    },
    hint: "Mutable values declared at runtime are not supported. Please make sure to use exactly `export const prerender = true`."
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) => `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001
  },
  MarkdownContentSchemaValidationError: {
    title: "Content collection frontmatter invalid.",
    code: 6002,
    message: (collection, entryId, error) => {
      return [
        `${String(collection)} \u2192 ${String(entryId)} frontmatter does not match collection schema.`,
        ...error.errors.map((zodError) => zodError.message)
      ].join("\n");
    },
    hint: "See https://docs.astro.build/en/guides/content-collections/ for more information on content schemas."
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) => `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information."
  },
  UnknownCLIError: {
    title: "Unknown CLI Error.",
    code: 8e3
  },
  GenerateContentTypesError: {
    title: "Failed to generate content types.",
    code: 8001,
    message: "`astro sync` command failed to generate content collection types.",
    hint: "Check your `src/content/config.*` file for typos."
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name && name !== "Error") {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    this.errorCode = errorCode;
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var _a;
const astroComponentInstanceSym = Symbol.for("astro.componentInstance");
class AstroComponentInstance {
  constructor(result, props, slots, factory) {
    this[_a] = true;
    this.result = result;
    this.props = props;
    this.factory = factory;
    this.slotValues = {};
    for (const name in slots) {
      this.slotValues[name] = slots[name]();
    }
  }
  async init() {
    this.returnValue = this.factory(this.result, this.props, this.slotValues);
    return this.returnValue;
  }
  async *render() {
    if (this.returnValue === void 0) {
      await this.init();
    }
    let value = this.returnValue;
    if (isPromise(value)) {
      value = await value;
    }
    if (isHeadAndContent(value)) {
      yield* value.content;
    } else {
      yield* renderChild(value);
    }
  }
}
_a = astroComponentInstanceSym;
function validateComponentProps(props, displayName) {
  if (props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  if (isAPropagatingComponent(result, factory) && !result.propagators.has(factory)) {
    result.propagators.set(factory, instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && !!obj[astroComponentInstanceSym];
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (isRenderTemplateResult(child)) {
    yield* renderAstroTemplateResult(child);
  } else if (isAstroComponentInstance(child)) {
    yield* child.render();
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToIterable(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToIterable(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && typeof Component === "object" && Component["astro:html"];
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  var _a, _b;
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroTemplateResult(
      await renderTemplate`<${Tag}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/g;
  if (!unsafe.test(tag))
    return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlot(result, slots == null ? void 0 : slots.default);
  if (children == null) {
    return children;
  }
  return markHTMLString(children);
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component.render({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => stringifyChunk(result, instr)).join("") : "";
  return markHTMLString(hydrationHtml + html);
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Promise.resolve(Component).then((Unwrapped) => {
      return renderComponent(result, displayName, Unwrapped, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots);
  }
  if (isAstroComponentFactory(Component)) {
    return createAstroComponentInstance(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots);
}
function renderComponentToIterable(result, displayName, Component, props, slots = {}) {
  const renderResult = renderComponent(result, displayName, Component, props, slots);
  if (isAstroComponentInstance(renderResult)) {
    return renderResult.render();
  }
  return renderResult;
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
async function* renderExtraHead(result, base) {
  yield base;
  for (const part of result.extraHead) {
    yield* renderChild(part);
  }
}
function renderAllHeadContent(result) {
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  const baseHeadContent = markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
  if (result.extraHead.length > 0) {
    return renderExtraHead(result, baseHeadContent);
  } else {
    return baseHeadContent;
  }
}
function createRenderHead(result) {
  result._metadata.hasRenderedHead = true;
  return renderAllHeadContent.bind(null, result);
}
const renderHead = createRenderHead;
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield createRenderHead(result)();
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = /* #__PURE__ */ Object.assign({

});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name, inputProps);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$b = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/Icon.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/Icon.astro");

const sprites = /* @__PURE__ */ new WeakMap();
function trackSprite(request, name) {
  let currentSet = sprites.get(request);
  if (!currentSet) {
    currentSet = /* @__PURE__ */ new Set([name]);
  } else {
    currentSet.add(name);
  }
  sprites.set(request, currentSet);
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(request) {
  const currentSet = sprites.get(request);
  if (currentSet) {
    return Array.from(currentSet);
  }
  if (!warned.has(request)) {
    const { pathname } = new URL(request.url);
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(request);
  }
  return [];
}

const $$Astro$a = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/Spritesheet.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites(Astro2.request);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(`position: absolute; width: 0; height: 0; overflow: hidden; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}
</svg>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/Spritesheet.astro");

const $$Astro$9 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/SpriteProvider.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}
`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/SpriteProvider.astro");

const $$Astro$8 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/Sprite.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite(Astro2.request, name);
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/Sprite.astro");

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$7 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Navbar.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Navbar;
  return renderTemplate`${maybeRenderHead($$result)}<header aria-label="Encabezado de la Web" class="astro-5ID6I2PX">
   <a aria-label="Logo de Zingueria Marquez" href="/" class="logo astro-5ID6I2PX">
      <img src="Logo.png" class="logo astro-5ID6I2PX" alt="Logo de Zingueria Marquez">
   </a>
   <input aria-label="Menu" type="checkbox" id="nav-toggle" class="nav-toggle astro-5ID6I2PX">
   <nav aria-label="Barra de Navegacion" class="astro-5ID6I2PX">
      <ul class="astro-5ID6I2PX">
         <li class="astro-5ID6I2PX">
            <a href="#products" class="astro-5ID6I2PX">
               Productos
               <svg xmlns="http://www.w3.org/2000/svg" class="icon astro-5ID6I2PX" viewBox="0 0 24 24">
                  <path class="icon astro-5ID6I2PX" fill="currentColor" d="M6 22q-.825 0-1.413-.588T4 20V8q0-.825.588-1.413T6 6h2q0-1.65 1.175-2.825T12 2q1.65 0 2.825 1.175T16 6h2q.825 0 1.413.588T20 8v12q0 .825-.588 1.413T18 22H6Zm0-2h12V8h-2v2q0 .425-.288.713T15 11q-.425 0-.713-.288T14 10V8h-4v2q0 .425-.288.713T9 11q-.425 0-.713-.288T8 10V8H6v12Zm4-14h4q0-.825-.588-1.413T12 4q-.825 0-1.413.588T10 6ZM6 20V8v12Z">
                  </path>
               </svg>
            </a>
         </li>
         <li class="astro-5ID6I2PX">
            <a href="#trabajos" class="astro-5ID6I2PX">
               Trabajos a Medida ${renderComponent($$result, "Icon", $$Icon, { "class": "icon astro-5ID6I2PX", "name": "ph:ruler" })}
            </a>
         </li>
         <li class="astro-5ID6I2PX">
            <a href="#ubicacion" class="astro-5ID6I2PX">
               Ubicacion ${renderComponent($$result, "Icon", $$Icon, { "name": "ic:baseline-location-on", "class": "icon astro-5ID6I2PX" })}
            </a>
         </li>
      </ul>
   </nav>
   <label aria-label="Menu" for="nav-toggle" class="nav-toggle-label astro-5ID6I2PX">
      <span class="astro-5ID6I2PX"></span>
   </label>
</header>

`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Navbar.astro");

const $$Astro$6 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Footer.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer aria-label="Footer" class="footer-container astro-L2QLZWHX" id="footer">
   <div class="footer-info astro-L2QLZWHX">
      <div class="brand astro-L2QLZWHX">Zingueria Marquez</div>
      <div class="social-container astro-L2QLZWHX">
         <a aria-label="Instagram" href="https://www.instagram.com/zm.grz/" class="astro-L2QLZWHX">
            ${renderComponent($$result, "Icon", $$Icon, { "class": "social-logo astro-L2QLZWHX", "name": "ph:instagram-logo" })}
         </a>
         <a aria-label="WhatsApp" href="https://api.whatsapp.com/send?phone=5491130206654" class="astro-L2QLZWHX">${renderComponent($$result, "Icon", $$Icon, { "class": "social-logo astro-L2QLZWHX", "name": "ph:whatsapp-logo-light" })}
         </a>
      </div>
   </div>
</footer>

`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Footer.astro");

const $$Astro$5 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/src/layouts/Layout.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="description" content="Zingueria Marquez. 
      Av. Brig. Gral. Juan Manuel de Rosas 2220,
      Jose Leon Suarez">
      <meta name="viewport" content="width=device-width">
      <link rel="icon" href="/Logo.png">
      <meta name="generator"${addAttribute(Astro2.generator, "content")}>
      <title>${title}</title>
   ${renderHead($$result)}</head>

   <body>
      ${renderComponent($$result, "Navbar", $$Navbar, {})}
      ${renderSlot($$result, $$slots["default"])}
      ${renderComponent($$result, "Footer", $$Footer, {})}
   
</body></html>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/layouts/Layout.astro");

const data = [
	{
		id: 1,
		name: "Chapa Cincalum",
		description: "c25 / c27",
		description_2: "• Chapa cincalum acanalada calibre 25 y 27\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/chapa-cincalum-1.webp",
		src2: "src/img/chapa-cincalum-2.webp",
		src3: "src/img/chapa-cincalum-3.webp",
		src4: "src/img/chapa-cincalum-4.webp",
		src5: "src/img/chapa-cincalum-5.webp",
		src6: "src/img/chapa-cincalum-6.webp",
		category: "chapas"
	},
	{
		id: 2,
		name: "Chapa Galvanizada",
		description: "c27",
		description_2: "• Chapa galvanizada acanalada calibre 27\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/chapa-galvanizada-1.webp",
		src2: "src/img/chapa-galvanizada-2.webp",
		src3: "src/img/chapa-galvanizada-3.webp",
		src4: "src/img/chapa-galvanizada-4.webp",
		src5: "src/img/chapa-galvanizada-5.webp",
		category: "chapas"
	},
	{
		id: 3,
		name: "Chapa Color",
		description: "c25 / c27",
		description_2: "• Chapa color acanalada calibre 25 y 27\n\n• Colores: Gris y Negro\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/Chapa-Acanalada-Color-Negra-1.webp",
		src2: "src/img/Chapa-Acanalada-Color-Negra-2.webp",
		src3: "src/img/Chapa-Acanalada-Color-Negra-3.webp",
		src4: "src/img/Chapa-Acanalada-Color-Gris.webp",
		src5: "src/img/chapa-gris.webp",
		category: "chapas"
	},
	{
		id: 4,
		name: "Chapas Plasticas",
		description: "Plast. Acrilica\nPoliprop.\nPolicarb. cristal",
		description_2: "• Chapas de:\n\n• Plastico Acrilico\n• Polipropileno - Das Dach\n• Policarbonato cristal (transparente)",
		src: "src/img/chapa-plastica-1.webp",
		src2: "src/img/chapa-plastica-2.webp",
		src3: "src/img/chapa-plastica-3.webp",
		src4: "src/img/chapa-plastica-4.webp",
		src5: "src/img/chapa-plastica-5.webp",
		src6: "src/img/chapa-plastica-6.webp",
		category: "chapas"
	},
	{
		id: 5,
		name: "Chapa Lisa",
		description: "c25 / c27",
		description_2: "• Chapa lisa galvanizada calibre 25 y 27\n\n• Medidas: 2,44 x 1,22 Mts",
		src: "src/img/chapa-lisa-1.webp",
		src2: "src/img/chapa-lisa-2.webp",
		src3: "src/img/chapa-lisa-3.webp",
		category: "chapas"
	},
	{
		id: 6,
		name: "Trapezoidal T101 Cincalum",
		description: "c25",
		description_2: "• Chapa Trapezoidal T101 Cincalum calibre 25\n\n• Colores: Verde, Gris, Negro, Bordo, Azul y Blanco\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/Chapa-Trapezoidal-T101.webp",
		src2: "src/img/Chapa-Trapezoidal-T101-2.webp",
		src3: "src/img/Chapa-Trapezoidal-T101-3.webp",
		src4: "src/img/Chapa-Trapezoidal-T101-4.webp",
		category: "chapas"
	},
	{
		id: 7,
		name: "Trapezoidal T101 Color",
		description: "Gris-Negro-Bordo-Azul-Verde",
		description_2: "• Chapa Color Trapezoidal T101 calibre 25\n\n• Colores: Verde, Gris, Negro, Bordo, Azul y Blanco\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/Chapa-Trapezoidal-T101-Verde.webp",
		src2: "src/img/Chapa-Trapezoidal-T101-Gris.webp",
		src3: "src/img/Chapa-Trapezoidal-T101-Negro.webp",
		src4: "src/img/Chapa-Trapezoidal-T101-Bordo.webp",
		src5: "src/img/Chapa-Trapezoidal-T101-Azul.webp",
		src6: "src/img/Chapa-Trapezoidal-T101-Blanco.webp",
		category: "chapas"
	},
	{
		id: 8,
		name: "Tejado Metalico",
		description: "c25-Negro/Bordo",
		description_2: "• Tejado Metalico simil teja francesa \n\n• Colores: Negro y Bordo\n\n• Largo: 5max(Mts)\n\n• Ancho: 1.10 (Mts)\n\n• Características:\n\n- Durabilidad\n\n- Resistencia\n\n- Garantía contra granizo\n\n- Menor costo de material y mano de obra que en un techo de tejas tradicional\n\n- Peso reducido ( Facilita el transporte y reduce el costo de estructura )\n\n- Mayor limpieza en la obra\n\n- Mayor rapidez en la instalación\n\n- Economía y racionalidad en la ejecución\n\n- Evita filtraciones\n\n- Fácil reemplazo\n\n- Libre mantenimiento\n\n- Estéticamente impecable\n\n- Se adapta a cualquier estilo arquitectónico\n\n- Apto para techos de construcciones en seco o tradicionales",
		src: "src/img/tejado-metalico-2.webp",
		src2: "src/img/tejado-metalico-1.webp",
		src3: "src/img/tejado-metalico-3.webp",
		src4: "src/img/tejado-metalico-4.webp",
		category: "chapas"
	},
	{
		id: 9,
		name: "Sombrero H",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Sombrero H chapa galvanizada\n\n• Tamaños: 3'' / 4'' / 5'' / 6''",
		src: "src/img/sombrero-h-1.webp",
		src2: "src/img/sombrero-h-2.webp",
		src3: "src/img/sombrero-h-3.webp",
		category: "zingueria"
	},
	{
		id: 10,
		name: "Sombrero Doble",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "Sombrero Doble Aro Gas galvanizado\n\n• 3'' / 4'' / 5'' / 6''",
		src: "src/img/sombrero-doble-gas.webp",
		src2: "src/img/sombrero-doble-gas-2.webp",
		src3: "src/img/sombrero-doble-gas-3.webp",
		category: "zingueria"
	},
	{
		id: 11,
		name: "Eolico",
		description: "4'' / 6'' / 8'' / 16'' / 24'' / 30''",
		description_2: "• Extractores eólicos fabricados con chapa galvanizada y flejes de aluminio\n\n• Son silenciosos, eficientes, económicos, sin costos de consumo ni de mantenimiento.\n\n• No hay sistema de ventilación más económico y practico que la ventilación natural en base a extracción eólica.\n\n• Tamaños: 4'' / 6'' / 8'' / 16'' / 24'' / 30''",
		src: "src/img/eolico-1.webp",
		src2: "src/img/eolico-2.webp",
		src3: "src/img/eolico-3.webp",
		category: "zingueria"
	},
	{
		id: 12,
		name: "Ramal Y",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "Ramal Y galvanizado\n\n• Tamaños: 3'' / 4'' / 5'' / 6''",
		src: "src/img/ramal-y-3p.webp",
		src2: "src/img/ramal-y-4p.webp",
		src3: "src/img/ramal-y-5p.webp",
		category: "zingueria"
	},
	{
		id: 13,
		name: "Ramal T",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "Ramal T galvanizado\n\n• Tamaños: 3'' / 4'' / 5'' / 6''",
		src: "src/img/ramal-t-3p.webp",
		src2: "src/img/ramal-t-4p.webp",
		src3: "src/img/ramal-t-5p.webp",
		category: "zingueria"
	},
	{
		id: 14,
		name: "Flexible",
		description: "3'' / 4'' / 5''",
		description_2: "Flexible de aluminio\n\n• Tamaños: 3'' / 4'' / 5''\n\n• Medidas: 1 y 2 Mts",
		src: "src/img/flexible.webp",
		src2: "src/img/flexible-2.webp",
		category: "zingueria"
	},
	{
		id: 15,
		name: "Grampa Omega",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "Grampa Omega\n\n• Tamaños: 3'' / 4'' / 5'' / 6''",
		src: "src/img/grampa-1.webp",
		src2: "src/img/grampa-2.webp",
		src3: "src/img/grampa-3.webp",
		category: "zingueria"
	},
	{
		id: 16,
		name: "Tornillos",
		description: "Para Chapa y Placa de Yeso",
		description_2: "• Tornillos para chapa 14x1 1/2, 14x2,14x2 1/2 madera y hierro\n\n• Tornillos para placa de yeso T1 ,T2 ,fijaciones de 6 y 8",
		src: "src/img/tornillos.webp",
		src2: "src/img/tornillo-autoperforante-acero.webp",
		src3: "src/img/tornillo-2.webp",
		src4: "src/img/tornillo-3.webp",
		category: "otros"
	},
	{
		id: 17,
		name: "Aislante Aluminizado",
		description: "Aislante Espuma Aluminizado",
		description_2: "• Aislante Espuma una cara Aluminizada\n\n• Medida: 20Mts²\n\n• Espesor: 10mm",
		src: "src/img/espuma-aluminio-1.webp",
		src2: "src/img/espuma-aluminio-2.jpeg",
		src3: "src/img/espuma-aluminio-3.webp",
		src4: "src/img/espuma-aluminio-4.webp",
		category: "aislantes"
	},
	{
		id: 18,
		name: "Lana de Vidrio Isover",
		description: "Rolac Plata Cubierta HR",
		description_2: " Lana de Vidrio Isover Rolac Plata Cubierta HR una cara de aluminio\n\n- Medida: 21,6Mts²\n\n- Espesor: 50mm\n\n• Bajo coeficiente de conductividad.\n\n• Coeficiente constante.\n\n• Contribuye al ahorro energético.\n\n• Fácil de cortar e instalar.\n\n• No es corrosiva.\n\n• Reduce las emisiones de CO2 durante el uso del inmueble.",
		src: "src/img/Lana-rosa-1.webp",
		src2: "src/img/Lana-rosa-2.webp",
		src3: "src/img/Lana-rosa-3.webp",
		category: "aislantes"
	},
	{
		id: 19,
		name: "Lana de Vidrio Isover",
		description: "Fieltro Liviano HR",
		description_2: " Lana de Vidrio Isover Fieltro Liviano HR para aumento de espesores\n\n- Medida: 21,6Mts²\n\n- Espesor: 50mm\n\n• Alto nivel de aislación térmica, acústica.\n\n• Control de la condensación (superficial e intersticial).\n\n• 100% Incombustible.\n\n• Solapa longitudinal que asegura la continuidad de la barrera de vapor.\n\n• Liviano.\n\n• Suave al Tacto.\n\n• Fácil de cortar.\n\n• Flexible.",
		src: "src/img/Lana-violeta-1.webp",
		src2: "src/img/Lana-violeta-2.webp",
		category: "aislantes"
	},
	{
		id: 20,
		name: "Fieltro Asfáltico Standard",
		description: "20Mts² / 40Mts²",
		description_2: "Aplicaciones\n\n• Bajo teja o chapa\n\n• En techos sobre estructura de madera, como aislante hidráulico\n\n• Bajo cubiertas metálicas, evita el goteo por condensación\n\n• Como protección del aislamiento térmico\n\n• Como refuerzo en impermeabilizaciones multicapa fabricadas con asfalto en obra\n\n• Como membrana de refuerzo en sistemas de impermeabilización en frío o caliente\n\n• Como membrana protectora de sistemas que van a recibir un acabado o un relleno\n\n• En muros como aislante hidráulico y del viento\n\n\n Ventajas\n\n• Aislante hidráulico\n\n• No retiene vapor en el techado\n\n• No absorve la humedad ambiente\n\n• Flexible\n\n• De simple instalación",
		src: "src/img/rubbersec.webp",
		category: "aislantes"
	},
	{
		id: 21,
		name: "Cinta Aluminio",
		description: "10Mts / 45Mts",
		description_2: "Cinta Aluminio de 10Mts y 45Mts PROTERM indicada para la unión de aislantes térmicos, proteger, cubrir, aislar y reparar.\n\nApta para reparaciones en las cubiertas metalicas y aislantes con foil de aluminio. \n\n-CARACTERÍSTICAS:\n\n• Resistente al fuego, la humedad, condiciones climáticas adversas y agentes químicos.\n\n• No se deteriora con el tiempo, posee protección UV\n\n• Alta aislación térmica\n\n• Reflectante a las altas temperaturas y la luz\n\n• Gran adaptabilidad y fuerza adhesiva\n\n• Facilidad de arranque que simplifica los trabajos en altura",
		src: "src/img/cinta-aluminio.webp",
		src2: "src/img/cinta-aluminio-2.webp",
		src3: "src/img/cinta-aluminio-3.webp",
		category: "aislantes"
	},
	{
		id: 22,
		name: "Malla Plastica",
		description: "2x25Mts / 2x50Mts",
		description_2: "Malla Plastica sosten\n\n• Medidas: 2x25 y 2x50",
		src: "src/img/malla-plastica-1.webp",
		src2: "src/img/malla-plastica-2.webp",
		src3: "src/img/malla-plastica-3.webp",
		category: "aislantes"
	},
	{
		id: 23,
		name: "Membrana Megaflex",
		description: "40kg",
		description_2: "• Membrana asfáltica con revestimiento de aluminio No Crack para impermeabilización de terrazas y cubiertas no transitables\n\n• Peso: 40kg\n\n• Medida: 10Mts²",
		src: "src/img/megaflex-1.webp",
		src2: "src/img/megaflex-2.webp",
		src3: "src/img/megaflex-3.webp",
		category: "aislantes"
	},
	{
		id: 24,
		name: "Membrana ClipperFlex",
		description: "35kg",
		description_2: "• Impermeabilizaciones expuestas, no transitables.\n\n• Aplicable sobre cualquier tipo de superficies como ser: losas, bóvedas, techos de chapa galvanizada y fibrocemento, techos planos y abovedados con todo tipo de pendientes.\n\n• No aplicable debajo de una carpeta de cemento, cal y arena, ya que el contacto de estos materiales con el aluminio produce oxidación y deterioro de la membrana.\n\n\n\n-Ventajas\n\n• Mayor flexibilidad y adaptabilidad.\n\n• Mayor elongación y resistencia mecánica.\n\n• Gran durabilidad.\n\n• No se rompen ni se quiebran.\n\n• Buen comportamiento ante climas adversos.\n\n• Reduce la absorción térmica por radiación solar.\n\n• Pueden permanecer expuestas a los rayos U.V.\n\n• Peso: 35kg\n\n• Medida: 10Mts²",
		src: "src/img/clipperflex.webp",
		category: "aislantes"
	},
	{
		id: 25,
		name: "Membrana Autoadhesiva",
		description: "10cm",
		description_2: "• La membrana autoadhesiva es un material apreciado por su sencilla colocación. Al igual que las membranas asfálticas, su calidad depende de la materia prima utilizada. En Metalflex/Clipperflex trabajamos con un asfalto modificado con polímeros, cuya características más importante es la adhesividad a temperatura ambiente.\n\n• Debido al alto costo de este tipo de asfaltos y al hecho de que no se utiliza soplete en su colocación, no es necesario un gran espesor.\n\n\n\n• ULTRA ADHESIVO\n\n• ALUMINIO FLEXIBLE\n\n• FÁCIL COLOCACIÓN\n\n• ADAPTABLE A DIVERSOS USOS\n\n• Medida: 10cm",
		src: "src/img/autoadhesiva-1.webp",
		src2: "src/img/autoadhesiva-2.webp",
		src3: "src/img/autoadhesiva-3.webp",
		category: "aislantes"
	},
	{
		id: 26,
		name: "Sellador Acetico",
		description: "Acetica Multiuso 250ml",
		description_2: "• Sellador Unipega Acetico\n• 280ml\n\n• Versatil para diversos sellados del día a día\n\n• Sellador de silicona monocomponente de curado acetico indicado para el sellado de aluminio, vidrio, azulejo, cerámica, sanitarios y box de baños. Resistente a la formación de hongos. Con propiedades de no escurrimiento, cura con la humedad ambiente, formando un caucho flexible y durable.",
		src: "src/img/acetico.webp",
		src2: "src/img/acetico2.webp",
		src3: "src/img/acetico3.webp",
		category: "selladores"
	},
	{
		id: 27,
		name: "Sellador Hibrido",
		description: "Adhesivo Hibrido 280ml",
		description_2: "• Selladores Unipega Hibrido\n• 280ml\n\n• Adhesivo para diversas aplicaciones en la construcción\n\n• Adhesivo híbrido monocomponente indicado para sellado en juntas de movimiento, fachadas de edificaciones y de acero galvanizado, albañilería y otros sustratos porosos y no porosos. Con propiedades de no escurrimiento, cura a temperatura ambiente, permaneciendo flexible por muchos años. Resiste a agentes climáticos y rayos UV.",
		src: "src/img/hibrido.webp",
		src2: "src/img/hibrido2.webp",
		src3: "src/img/hibrido3.webp",
		category: "selladores"
	},
	{
		id: 28,
		name: "Sellador PuFlex",
		description: "PuFlex Uso General 280ml",
		description_2: "• Sellador Unipega PuFlex\n\n• Alta elasticidad para sellados y calafateos en general\n\n• Sellador híbrido monocomponente indicado para pegados y calafateos perimetrales en general. Sella madera, acero, aluminio, cerámica, concreto, canaletas y rieles. Con propiedades de no escurrimiento, cura con la humedad ambiente, formando un caucho flexible y durable. Una vez curado, se puede pintar.",
		src: "src/img/puflex.webp",
		src2: "src/img/puflex2.webp",
		src3: "src/img/puflex3.webp",
		category: "selladores"
	},
	{
		id: 29,
		name: "Sellador Acrilico",
		description: "Sella Grietas Sellador Acrilico 280ml",
		description_2: "• Sella Grietas Unipega\n• 280ml\n\n• Sella grietas y juntas\n\n• Sellador flexible con fungicida, libre de solventes, recomendado para construcciones sustentables. Indicado para pegar y sellar alrededor de perfiles, zócalos, marcos, aplicaciones en juntas y acabados de muebles. Se adhiere en madera, MDF, compensado, concreto, yeso, drywall, piedra y albañilería. Puede recibir revestimiento sobre la aplicación y puede ser pintado.",
		src: "src/img/trincas.webp",
		src2: "src/img/trincas2.webp",
		src3: "src/img/trincas3.webp",
		category: "selladores"
	},
	{
		id: 30,
		name: "Sellador Pu 40",
		description: "Sellador Pu 40 Profesional 280ml",
		description_2: "• Sellador Unipega Pu 40 Uso Profesional\n• 280ml\n\n• Sellador híbrido uso profesional\n\n• Sellador flexible con fungicida, libre de solventes, recomendado para construcciones sustentables. Indicado para pegar y sellar alrededor de perfiles, zócalos, marcos, aplicaciones en juntas y acabados de muebles. Se adhiere en madera, MDF, compensado, concreto, yeso, drywall, piedra y albañilería. Puede recibir revestimiento sobre la aplicación y puede ser pintado.",
		src: "src/img/pu40.webp",
		src2: "src/img/pu402.webp",
		src3: "src/img/pu403.webp",
		category: "selladores"
	},
	{
		id: 31,
		name: "Sellador Alta temperatura",
		description: "Alta temperatura 50ml",
		description_2: "• Fijaciones y sellados que exijan resistencia a temperaturas desde -30°C hasta +315°C\n\n• 50ml",
		src: "src/img/alta-temp.webp",
		category: "selladores"
	},
	{
		id: 32,
		name: "Sellador Hibrido",
		description: "Fija Todo 50ml",
		description_2: "• Fuerza de adhesión para las aplicaciones más difíciles\n\n• Adhesivo híbrido monocomponente indicado para el pegado y sellado de materiales porosos y no porosos, como metales, concreto, piedras, cerámicas, vidrio, policarbonato y PVC. Debido al alto poder de adhesión inicial es indicado para la fijación de espejos y pegado de bachas y fregaderos. Con propiedades de no escurrimiento, cura con la humedad ambiente, formando un caucho flexible y durable.\n\n• 50ml",
		src: "src/img/fija-todo-1.webp",
		src2: "src/img/fija-todo-3.webp",
		src3: "src/img/fija-todo-2.webp",
		category: "selladores"
	},
	{
		id: 33,
		name: "Sellador Acetico",
		description: "Uso General 50ml",
		description_2: "• Sellador de silicona monocomponente de curado acético indicado para el sellado de aluminio, vidrio, azulejo, cerámica, sanitarios y box de baños. Resistente a la formación de hongos. Con propiedades de no escurrimiento, cura con la humedad ambiente, formando un caucho flexible y durable.\n\n• 50ml",
		src: "src/img/uso-general-1.webp",
		src2: "src/img/uso-general-2.webp",
		src3: "src/img/uso-general-3.webp",
		category: "selladores"
	},
	{
		id: 34,
		name: "Codo Redondo",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Codo soldado Redondo para Agua galvanizado\n\n• Medidas: 3'' / 4'' / 5'' / 6''",
		src: "src/img/codo_agua.webp",
		src2: "src/img/codo_agua2.webp",
		src3: "src/img/codo_agua3.webp",
		src4: "src/img/codo_agua4.webp",
		src5: "src/img/codo_agua5.webp",
		src6: "src/img/codo_agua6.webp",
		category: "zingueria"
	},
	{
		id: 35,
		name: "Codo Rectangular",
		description: "2''x4'' / 3''x5''",
		description_2: "• Codo soldado Rectangular para Agua galvanizado\n\n• Medidas: 2''x4'' / 3''x5''",
		src: "src/img/codo.webp",
		src2: "src/img/codo2.webp",
		src3: "src/img/codo3.webp",
		src4: "src/img/codo4.webp",
		category: "zingueria"
	},
	{
		id: 36,
		name: "Curva Articulada",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Curva Articulada Galvanizada\n\n• Medidas: 3'' / 4'' / 5'' / 6''",
		src: "src/img/curva_articulada.webp",
		src2: "src/img/curva_articulada-2.webp",
		src3: "src/img/curva_articulada-3.webp",
		src4: "src/img/curva_articulada-4.webp",
		category: "zingueria"
	},
	{
		id: 37,
		name: "Curva Corrugada",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Curva Corrugada Galvanizada\n\n• Medidas: 3'' / 4'' / 5'' / 6''",
		src: "src/img/curva_corrugada.webp",
		src2: "src/img/curva_corrugada2.webp",
		src3: "src/img/curva_corrugada3.webp",
		src4: "src/img/curva_corrugada4.webp",
		src5: "src/img/curva_corrugada5.webp",
		src6: "src/img/curva_corrugada6.webp",
		category: "zingueria"
	},
	{
		id: 38,
		name: "Colectores",
		description: "5x10CM",
		description_2: "• Recibidor de agua fabricado en Chapa Galvanizada con salida para caño 5x10CM• Varios modelos",
		src: "src/img/colectores.webp",
		src2: "src/img/colectores2.webp",
		src3: "src/img/colectores3.webp",
		src4: "src/img/colectores4.webp",
		src5: "src/img/colectores6.webp",
		src6: "src/img/colectores8.webp",
		category: "zingueria"
	},
	{
		id: 39,
		name: "Reducciones",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Reduccion de Aluminio\n\n• Medidias: 100 a 110mm\n\n5'' a 6''\n\n4'' a 6''\n\n3'' a 4''",
		src: "src/img/reduccion.webp",
		src2: "src/img/reduccion2.webp",
		src3: "src/img/reduccion3.webp",
		src4: "src/img/reduccion4.webp",
		src5: "src/img/reduccion5.webp",
		src6: "src/img/reduccion6.webp",
		category: "zingueria"
	},
	{
		id: 40,
		name: "Caños Galvanizados",
		description: "3'' 4'' 5'' 6''",
		description_2: "• Caños Galvanizados\n\n• Calibre: 28\n\n• Medidas: 3'' 4'' 5'' 6''\n\n• Largo: 1Mt",
		src: "src/img/cano-galvanizado-1.webp",
		src2: "src/img/cano-galvanizado-2.webp",
		category: "zingueria"
	},
	{
		id: 41,
		name: "Caños Enlozados",
		description: "4'' 6''",
		description_2: "• Caños Enlozados para salamandra/estufa(negro brillante)\n\n• Medidas: 4'' 6''",
		src: "src/img/cano-enlozado-1.webp",
		src2: "src/img/cano-enlozado-2.webp",
		src3: "src/img/cano-enlozado-3.webp",
		category: "zingueria"
	},
	{
		id: 42,
		name: "Placas de Yeso",
		description: "9,5mm / 12,5 mm",
		description_2: "• Placa de yeso de gran durabilidad y resistencia.\n\n• Apta para cielorrasos, divisiones y revestimeintos de obras particulares. Logrando excelentes terminaciones, rapidez y velocidad en cada obra.\n\n• Espesor: 9,5 y 12,5 mm.",
		src: "src/img/placa-yeso-1.webp",
		src2: "src/img/placa-yeso-2.webp",
		category: "seco"
	},
	{
		id: 43,
		name: "Masilla Anclaflex",
		description: "7kg / 15kg / 32kg",
		description_2: "• Masilla Anclaflex Plus Placas de yeso\n\n• 7kg / 15kg / 32kg\n\n- Uso interior\n\n- Para el pegado de cintas de papel o tramada, tomado de juntas, recubrimiento de tornillos de sujeción, perfiles, reparar zonas dañadas o irregularidades de placas, terminación final en tabiques y cielorrasos de placa de roca de yeso",
		src: "src/img/masilla.webp",
		category: "seco"
	},
	{
		id: 44,
		name: "Pasatechos",
		description: "Comun y alta temperatura",
		description_2: "• Pasatecho comun(3, 4 y 5)\n\n• Alta temperatura(4)",
		src: "src/img/pasatecho-1.webp",
		src2: "src/img/pasatecho-2.webp",
		src3: "src/img/pasatecho-3.webp",
		src4: "src/img/pasatecho-4.webp",
		category: "otros"
	},
	{
		id: 45,
		name: "Cierre Hermetico Compriband",
		description: "Acanalada / T101(Trapezoidal)",
		description_2: "• Cierre Hermetico Base Para Chapa Acanalada o T101(Trapezoidal)\n\n• Medida: 1Mt",
		src: "src/img/compriband-1.webp",
		src2: "src/img/compriband-2.webp",
		src3: "src/img/compriband-3.webp",
		src4: "src/img/compriband-4.webp",
		src5: "src/img/compriband-5.webp",
		category: "otros"
	},
	{
		id: 46,
		name: "Ganchos",
		description: "J5 / J6",
		description_2: "• Ganchos J5 y J6 para chapas",
		src: "src/img/gancho-1.webp",
		src2: "src/img/gancho-2.webp",
		category: "otros"
	},
	{
		id: 47,
		name: "Lubricante Uso General",
		description: "Lubricante Unipega",
		description_2: "• UNI LUB LUBRICANTE USO GENERAL\n\n• Unilub es un lubricante de uso general desarrollado para reducir la fricción y, consecuentemente, el desgaste entre las partes metálicas, eliminando ruidos y lubricando por completo debido a su alto poder penetrante. Protege por mucho más tiempo contra la óxido y la intemperie. En la industria, Lubrica y protege máquinas, herramientas livianas y pesadas, cojinetes, cintas transportadoras, válvulas de seguridad, ejes, motores eléctricos, engranajes, poleas y otros equipos industriales, partes mecánicas de automóviles, desde cables, cojinetes, engranajes, poleas e incluso piezas eléctricas. En el uso general, puede ser utilizado en cerraduras, bisagras, pasadores, herramientas, electrodomésticos, máquinas de coser, limpiar y otras, bicicletas y cualquier pieza metálica.",
		src: "src/img/lub.webp",
		category: "otros"
	},
	{
		id: 48,
		name: "Cintas",
		description: "Para Placa de Yeso",
		description_2: "• Cinta para Placa de Yeso Tramada Autoadhesiva:\n -90 Mts\n\n• Cinta de papel: \n -23 Mts\n -75 Mts\n -150 Mts",
		src: "src/img/cintas.webp",
		category: "otros"
	},
	{
		id: 49,
		name: "Adhesivo Para Molduras",
		description: "1Kg",
		description_2: "•1Kg\n\n-Adhesivo listo para usar.\n-Debe aplicarse sobre superficies limpias, secas, firmes y libres de polvos.\n-Aplicar sobre ambas caras de la moldura a pegar en cantidades abundantes con la espátula, colocar la moldura sobre la pared logrando un excedente de adhesivo.\n-Quite el excedente inmediatamente con una esponja o trapo húmedo.\n-Para lograr una mejor terminación pinte 24 horas después de colocada la moldura\n-Utilizar en ambientes ventilados\n-Mantener alejado de los niños\n-Ante contacto con ojos lavar con abundante agua y efectuar consulta médica.\n-Ante ingestión efectuar consulta médica.",
		src: "src/img/adhesivo-moldura.webp",
		category: "seco"
	},
	{
		id: 50,
		name: "Molduras Decorativas",
		description: "2 Mts",
		description_2: "• Molduras decorativas para techos, Poliestireno extruido\n -2 Mts\n\n• DE05: 35mm\n\n• DE09: 44mm\n\n• DE13: 52mm",
		src: "src/img/molduras.webp",
		src2: "src/img/De-05.webp",
		src3: "src/img/De-09.webp",
		src4: "src/img/De-13.webp",
		category: "seco"
	},
	{
		id: 51,
		name: "Yeso Yemaco",
		description: "1Kg",
		description_2: "• El Yeso Yemaco Durlock® es un Yeso tradicional para la construcción, ideal para realizar enlucidos de paredes y cielorrasos. Se emplea de forma manual en ambientes interiores.\n\n• Propiedades\n• Resistencia al fuego\n• Aislamiento térmico\n\nBeneficios\n• Máximo tenor de pureza.\n• Granulometría uniforme.\n• Compatible con los distintos tipos de agua del país.\n• Gran Terminación\n• No requiere el agregado de cemento de obra.",
		src: "src/img/yeso-yemaco.webp",
		category: "seco"
	},
	{
		id: 52,
		name: "Caño Rectangular Galvanizado",
		description: "c28",
		description_2: "• Caños Rectangular Galvanizado\n\n-Calibre: c28\n-Medidas: 10x5 \n-Largo: 1 Mt",
		src: "src/img/caño-rectangular-1.webp",
		src2: "src/img/caño-rectangular-2.webp",
		src3: "src/img/caño-rectangular-3.webp",
		category: "zingueria"
	},
	{
		id: 53,
		name: "Canaleta Americana Galvanizada",
		description: "c27",
		description_2: "• Canaleta Americana D30 Galvanizada\n\n-Calibre: c27\n-Largo: 2,44 Mts",
		src: "src/img/canaleta-1.webp",
		src2: "src/img/canaleta-2.webp",
		src3: "src/img/canaleta-3.webp",
		src4: "src/img/canaleta-4.webp",
		category: "zingueria"
	},
	{
		id: 54,
		name: "Sombrero Venturi Americano",
		description: "4'' hasta 12''",
		description_2: "• Sombrero Venturi Americano\n\n-Medidas: 4'' hasta 12''",
		src: "src/img/sombero-venturi-1.webp",
		src2: "src/img/sombero-venturi-2.webp",
		src3: "src/img/sombero-venturi-3.webp",
		category: "zingueria"
	},
	{
		id: 55,
		name: "Disco De Corte",
		description: "",
		description_2: "• Los Discos Abrasivos TYROLIT XPERT TOOLS Aceros son recomendados para el corte de planchuelas, perfiles, ángulos, tubos, barras y material macizo de aceros de baja y media aleación, aceros inoxidables y fundición.\n\n-Han sido concebidos para ofrecerle una solución más económica para sus problemas de costos en los espesores estándar.\n-Velocidad periférica hasta 80 m/seg.",
		src: "src/img/disco-corte.webp",
		category: "otros"
	},
	{
		id: 56,
		name: "Cenefa",
		description: "20cm - 30cm ",
		description_2: "• Cenefa Galvanizada, terminación y cierre en los bordes del techo. Puede ser frontal o lateral y se utiliza para evitar filtraciones y mejorar la apariencia de dichas uniones. \n\n-Colores: Negro y Galvanizado(Gris)\n\n-Alto: 20cm y 30cm\n-Largo: 2Mts ",
		src: "src/img/57.webp",
		src2: "src/img/57-2.webp",
		src3: "src/img/57-3.webp",
		src4: "src/img/57-4.webp",
		src5: "src/img/57-5.webp",
		category: "zingueria"
	},
	{
		id: 57,
		name: "Grampas Canaleta Americana",
		description: "Con / Sin Brazo",
		description_2: "• Grampas Canaleta Americana (con y sin brazo), para amurar o atornillar a cenefa o frente.Apta para soportar el peso de la canaleta y el agua en caso de tormentas fuertes, no se dobla ni se quiebra. Recomendamos a nuestros clientes tener en cuenta la calidad de este tipo de productos, ya que es la pieza más importante a la hora de la instalación de las canaletas.",
		src: "src/img/58.webp",
		category: "zingueria"
	},
	{
		id: 58,
		name: "Topes Plasticos",
		description: "Acanaladas - Trapezoidal",
		description_2: "• Topes Plasticos para chapas plasticas Acanaladas/Sinusoidal y T101/Trapezoidal",
		src: "src/img/59.webp",
		src2: "src/img/59-2.webp",
		category: "otros"
	},
	{
		id: 59,
		name: "Solera",
		description: "35 / 70",
		description_2: "• Solera para Contruccion en Seco\n\nA: 35mm - 28mm \n\nB: 70mm - 28mm",
		src: "src/img/solera.webp",
		src2: "src/img/solera-2.webp",
		src3: "src/img/solera-3.webp",
		category: "seco"
	},
	{
		id: 60,
		name: "Montante",
		description: "34 / 69",
		description_2: "• Montante para Contruccion en Seco\n\nA: 34mm - 69mm\n\nB: 35mm - 35mm\n\nC: 30mm - 30mm",
		src: "src/img/montante.webp",
		src2: "src/img/montante-2.webp",
		src3: "src/img/montante-3.webp",
		category: "seco"
	},
	{
		id: 61,
		name: "Omega",
		description: "10 / 12,5 / 30",
		description_2: "• Omega para Contruccion en Seco\n\nA: 10mm\n\nB: 12,5mm\n\nC: 30mm",
		src: "src/img/omega.webp",
		src2: "src/img/omega-2.webp",
		src3: "src/img/omega-3.webp",
		category: "seco"
	},
	{
		id: 62,
		name: "Cantonera",
		description: "31 / 31",
		description_2: "• Cantonera para Contruccion en Seco\n\nA: 31mm\n\nB: 31mm",
		src: "src/img/cantonera-3.webp",
		src2: "src/img/cantonera-2.webp",
		category: "seco"
	},
	{
		id: 63,
		name: "Angulo de Ajuste",
		description: "8,5 / 24",
		description_2: "• Angulo de Ajuste para Contruccion en Seco\n\nA: 8,5mm\n\nB: 24mm",
		src: "src/img/angulo.webp",
		src2: "src/img/angulo-2.webp",
		category: "seco"
	},
	{
		id: 64,
		name: "Buña",
		description: "8,5 / 20 / 15",
		description_2: "• Buña para Contruccion en Seco\n\nA: 8,5mm\n\nB: 20mm\n\nC: 15mm",
		src: "src/img/buna.webp",
		src2: "src/img/buna-2.webp",
		category: "seco"
	}
];

function Products() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [itemsQuantity, setItemsQuantity] = useState(JSON.parse(localStorage.getItem("itemsQuantity") || 8));
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    const response = await fetch("../../public/products.json");
    const json = await response.json();
    setProducts(json);
    setLoading(true);
  };
  useEffect(() => {
    fetchData();
  }, []);
  let filtered = [];
  useEffect(() => {
    filtered = products.filter((val) => val.name.toLowerCase().includes(search.toLowerCase()));
    if (itemsQuantity >= filtered.length) {
      setVisibility(false);
    } else if (filtered.length <= 8 && filtered.length >= 0) {
      setVisibility(false);
    } else {
      setVisibility(true);
    }
  }, [search, itemsQuantity, products]);
  const sortCategory = (category) => {
    let inCategory = data.filter((prod) => prod.category === category);
    setVisibility(false);
    setProducts(inCategory);
    setItemsQuantity(inCategory.length);
  };
  return /* @__PURE__ */ jsx(Fragment$1, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "product-container",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "h2_products",
        id: "products",
        children: "Productos"
      }), /* @__PURE__ */ jsx("div", {
        className: "search_bar_container",
        children: /* @__PURE__ */ jsxs("div", {
          className: "searchBar",
          children: [/* @__PURE__ */ jsx("input", {
            "aria-label": "Escribir Producto",
            onChange: (e) => {
              setSearch(e.target.value);
            },
            id: "searchQueryInput",
            type: "text",
            name: "searchQueryInput",
            placeholder: "Buscar"
          }), /* @__PURE__ */ jsx("button", {
            "aria-label": "Buscar",
            id: "searchQuerySubmit",
            type: "submit",
            name: "searchQuerySubmit",
            children: /* @__PURE__ */ jsx("svg", {
              style: {
                width: 24,
                height: 24
              },
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx("path", {
                fill: "#666666",
                d: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
              })
            })
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "categories-container",
        children: [/* @__PURE__ */ jsx("button", {
          "aria-label": "Todos",
          className: "category-btn",
          onClick: () => {
            setProducts(data);
            setVisibility(true);
            setItemsQuantity(8);
          },
          children: "Todos"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Chapas",
          className: "category-btn",
          onClick: () => sortCategory("chapas"),
          children: "Chapas"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Zingueria",
          className: "category-btn",
          onClick: () => sortCategory("zingueria"),
          children: "Zingueria"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Construccion en seco",
          className: "category-btn",
          onClick: () => sortCategory("seco"),
          children: "Construccion en seco"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Selladores",
          className: "category-btn",
          onClick: () => sortCategory("selladores"),
          children: "Selladores"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Aislantes",
          className: "category-btn",
          onClick: () => sortCategory("aislantes"),
          children: "Aislantes"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Otros",
          className: "category-btn",
          onClick: () => sortCategory("otros"),
          children: "Otros"
        })]
      }), loading ? /* @__PURE__ */ jsxs(Fragment$1, {
        children: [/* @__PURE__ */ jsx(motion.ul, {
          className: "link-card-grid",
          children: products.filter((val) => val.name.toLowerCase().includes(search.toLowerCase())).slice(0, itemsQuantity).map((val, id) => /* @__PURE__ */ jsx(AnimatePresence, {
            children: /* @__PURE__ */ jsxs(motion.li, {
              layout: true,
              initial: {
                opacity: 0
              },
              transition: {
                opacity: {
                  duration: 1,
                  ease: [0.88, 0.32, 1, 0.88]
                },
                y: {
                  duration: 1,
                  ease: [0.12, 0.98, 0.67, 0.96]
                }
              },
              whileInView: {
                opacity: 1,
                y: 70
              },
              className: "link-card",
              children: [/* @__PURE__ */ jsx("a", {
                href: `/product-details/${val.id}`,
                children: /* @__PURE__ */ jsx("h3", {
                  children: val.name
                })
              }), /* @__PURE__ */ jsx("a", {
                href: `/product-details/${val.id}`,
                children: /* @__PURE__ */ jsx("img", {
                  src: val.src,
                  alt: val.name
                })
              }), /* @__PURE__ */ jsx("p", {
                children: val.description
              })]
            }, val.id)
          }, id))
        }), visibility ? /* @__PURE__ */ jsxs("button", {
          "aria-label": "Mostrar Mas",
          onClick: () => {
            setItemsQuantity(itemsQuantity + 8);
            if (itemsQuantity >= filtered.length - 8) {
              setVisibility(false);
            }
          },
          className: "show-more",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text",
            children: "Ver Mas"
          }), /* @__PURE__ */ jsx("span", {
            children: "\u2193"
          })]
        }) : /* @__PURE__ */ jsx(Fragment$1, {})]
      }) : /* @__PURE__ */ jsx("div", {
        className: "loader",
        children: /* @__PURE__ */ jsx(Orbit, {
          size: 35,
          speed: 1.5,
          color: "white"
        })
      })]
    })
  });
}
__astro_tag_component__(Products, "@astrojs/react");

const $$Astro$4 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Hero.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead($$result)}<div class="hero astro-VZ4M6JPE" id="hero">
   <h1 class="hero-title astro-VZ4M6JPE" id="main-title">Zingueria Marquez</h1>
</div>

`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Hero.astro");

const $$Astro$3 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Nosotros.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Nosotros = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Nosotros;
  return renderTemplate`${maybeRenderHead($$result)}<div class="nosotros astro-XKSM6HXE">
   <div class="custom-shape-divider-top astro-XKSM6HXE">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" class="astro-XKSM6HXE">
         <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" class="shape-fill astro-XKSM6HXE"></path>
      </svg>
   </div>
   <div class="container astro-XKSM6HXE">
      <h3 class="nosotros-title astro-XKSM6HXE" id="ubicacion">Donde Estamos?</h3>
      <p class="adress-container astro-XKSM6HXE">
         ${renderComponent($$result, "Icon", $$Icon, { "name": "ic:baseline-location-on", "class": "icon astro-XKSM6HXE" })}Av. Brig. Gral. Juan
         Manuel de Rosas 2220
      </p>
      <div class="flex-2 astro-XKSM6HXE">
         <div class="map-container astro-XKSM6HXE">
            <iframe title="mapa" class="map astro-XKSM6HXE" src="https://maps.google.com/maps?width=100%25&hl=es&q=Zingueria%20Marquez%20Av.%20Brig.%20Gral.%20Juan%20Manuel%20de%20Rosas%202220,%20B1655%20Jos%C3%A9%20Le%C3%B3n%20Su%C3%A1rez,%20Provincia%20de%20Buenos%20Aires+(Zingueria%20Marquez)&t=&z=16&ie=UTF8&iwloc=B&output=embed">
               <a href="https://www.gps.ie/car-satnav-gps/"> Sat Navs </a>
            </iframe>
         </div>
         <img class="img astro-XKSM6HXE" src="images/frente.webp" alt="Frente Local Zingueria Marquez">
      </div>
      <div class="back-container astro-XKSM6HXE">
         <a href="#hero" class="back-to-top astro-XKSM6HXE">Volver Arriba ${renderComponent($$result, "Icon", $$Icon, { "class": "icon astro-XKSM6HXE", "name": "ph:arrow-up-bold" })}
         </a>
      </div>
   </div>
</div>

`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Nosotros.astro");

const $$Astro$2 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/src/components/TrabajosAMedida.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$TrabajosAMedida = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$TrabajosAMedida;
  return renderTemplate`${maybeRenderHead($$result)}<div class="trabajos-container astro-WCFHKAC5">
   <div class="custom-shape-divider-top astro-WCFHKAC5">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" class="astro-WCFHKAC5">
         <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" class="shape-fill astro-WCFHKAC5"></path>
      </svg>
   </div>
   <div class="container astro-WCFHKAC5">
      <h3 class="trabajos-title astro-WCFHKAC5" id="trabajos">
         Trabajos a Medida ${renderComponent($$result, "Icon", $$Icon, { "width": ".8em", "name": "ph:ruler", "class": "astro-WCFHKAC5" })}
      </h3>
      <div class="galeria astro-WCFHKAC5">
         <div class="trabajos-card astro-WCFHKAC5">
            <img src="images/trabajo-a-medida-3.webp" alt="Campana Extractora a Medida" class="astro-WCFHKAC5">
            <p class="astro-WCFHKAC5">Campana</p>
         </div>
         <div class="trabajos-card astro-WCFHKAC5">
            <img src="images/trabajo-a-medida-2.webp" alt="Campana Extractora a Medida" class="astro-WCFHKAC5">
            <p class="astro-WCFHKAC5">Campana</p>
         </div>
         <div class="trabajos-card astro-WCFHKAC5">
            <img src="images/trabajo-a-medida-1.webp" alt="Campana Extractora a Medida" class="astro-WCFHKAC5">
            <p class="astro-WCFHKAC5">Campana</p>
         </div>
         <div class="trabajos-card astro-WCFHKAC5">
            <img src="images/trabajo-a-medida-4.webp" alt="Trampilla a Medida" class="astro-WCFHKAC5">
            <p class="astro-WCFHKAC5">Trampilla</p>
         </div>
         <div class="trabajos-card astro-WCFHKAC5">
            <img src="images/trabajo-a-medida-5.webp" alt="Trampilla a Medida" class="astro-WCFHKAC5">
            <p class="astro-WCFHKAC5">Trampilla</p>
         </div>
         <div class="trabajos-card astro-WCFHKAC5">
            <img src="images/trabajo-a-medida-6.webp" alt="Claraboya a Medida" class="astro-WCFHKAC5">
            <p class="astro-WCFHKAC5">Claraboya</p>
         </div>
      </div>
      <a aria-label="Contactenos via WhatsApp" id="contactar-btn" href="https://api.whatsapp.com/send?phone=5491130206654" class="astro-WCFHKAC5">
         <button class="astro-WCFHKAC5">
            <div class="svg-wrapper-1 astro-WCFHKAC5">
               <div class="svg-wrapper astro-WCFHKAC5">
                  ${renderComponent($$result, "Icon", $$Icon, { "class": "social-logo astro-WCFHKAC5", "name": "ph:whatsapp-logo-light" })}
               </div>
               <span class="astro-WCFHKAC5">Contactar</span>
            </div>
         </button>
      </a>
   </div>
   <div class="custom-shape-divider-bottom astro-WCFHKAC5">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" class="astro-WCFHKAC5">
         <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" class="shape-fill astro-WCFHKAC5"></path>
      </svg>
   </div>
</div>

`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/TrabajosAMedida.astro");

const $$Astro$1 = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/index.astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Zingueria Marquez" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main>
      ${renderComponent($$result, "Hero", $$Hero, {})}

      ${renderComponent($$result, "Products", Products, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/ProductsReact.jsx", "client:component-export": "default" })}

      ${renderComponent($$result, "TrabajosAMedida", $$TrabajosAMedida, {})}

      ${renderComponent($$result, "Nosotros", $$Nosotros, {})}
   </main>` })}



${maybeRenderHead($$result)}`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/index.astro");

const $$file$1 = "C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/index.astro";
const $$url$1 = "/React-Astro-E-Commerce";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/product-details/[id].astro", "https://valenmetal.github.io/", "file:///C:/Users/valen/Downloads/proyects/spiffy-series/");
async function getStaticPaths() {
  const data = await fetch("../../../public/products.json").then(
    (response) => response.json()
  );
  return data.map((prod) => ({
    params: { id: prod.id },
    props: { prod }
  }));
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  Astro2.params;
  const { prod } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": prod.name, "class": "astro-XTS64U7A" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="astro-XTS64U7A">
        <div class="product astro-XTS64U7A">
            <a class="backBtnPos astro-XTS64U7A" href="/#products">
                <button class="backBtn astro-XTS64U7A">
                    ${renderComponent($$result, "Icon", $$Icon, { "name": "charm:arrow-left", "class": "icon astro-XTS64U7A" })}
                    Volver
                </button>
            </a>
            <h2 class="titulo-prod astro-XTS64U7A">${prod.name}</h2>
            <div class="gallery astro-XTS64U7A">
                <img class="prodImg astro-XTS64U7A"${addAttribute(`../../../${prod.src}`, "src")} alt="Product Image">
                
                ${prod.src2 ? renderTemplate`<img class="prodImg astro-XTS64U7A"${addAttribute(`../../../${prod.src2}`, "src")} alt="Product Image">` : renderTemplate`${void 0}`}
                ${prod.src3 ? renderTemplate`<img class="prodImg astro-XTS64U7A"${addAttribute(`../../../${prod.src3}`, "src")} alt="Product Image">` : renderTemplate`${void 0}`}
                ${prod.src4 ? renderTemplate`<img class="prodImg astro-XTS64U7A"${addAttribute(`../../../${prod.src4}`, "src")} alt="Product Image">` : renderTemplate`${void 0}`}
                ${prod.src5 ? renderTemplate`<img class="prodImg astro-XTS64U7A"${addAttribute(`../../../${prod.src5}`, "src")} alt="Product Image">` : renderTemplate`${void 0}`}
                ${prod.src6 ? renderTemplate`<img class="prodImg astro-XTS64U7A"${addAttribute(`../../../${prod.src6}`, "src")} alt="Product Image">` : renderTemplate`${void 0}`}
            </div>
            <h3 class="astro-XTS64U7A">Descripcion</h3>
            <p class="astro-XTS64U7A">${prod.description_2}</p>
        </div>
    </main>` })}

`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/product-details/[id].astro");

const $$file = "C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/product-details/[id].astro";
const $$url = "/React-Astro-E-Commerce/product-details/[id]";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getStaticPaths,
	default: $$id,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([["src/pages/index.astro", _page0],["src/pages/product-details/[id].astro", _page1],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

export { pageMap, renderers };
