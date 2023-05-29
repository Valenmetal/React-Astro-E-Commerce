import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, s as spreadAttributes, b as addAttribute, u as unescapeHTML, d as renderComponent, F as Fragment, e as renderHead, f as renderSlot } from '../astro.d097d118.mjs';
import { optimize } from 'svgo';
/* empty css                           *//* empty css                          */
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

const $$Astro$7 = createAstro("https://valenmetal.github.io");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
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

const $$Astro$6 = createAstro("https://valenmetal.github.io");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
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

const $$Astro$5 = createAstro("https://valenmetal.github.io");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/node_modules/astro-icon/lib/SpriteProvider.astro");

const $$Astro$4 = createAstro("https://valenmetal.github.io");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
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

const $$Astro$3 = createAstro("https://valenmetal.github.io");
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Navbar;
  return renderTemplate`${maybeRenderHead($$result)}<header aria-label="Encabezado de la Web" class="astro-5BLMO7YK">
   <a aria-label="Logo de Zingueria Marquez" href="/" class="logo astro-5BLMO7YK">
      <img src="Logo.png" class="logo astro-5BLMO7YK" alt="Logo de Zingueria Marquez">
   </a>
   <input aria-label="Menu" type="checkbox" id="nav-toggle" class="nav-toggle astro-5BLMO7YK">
   <nav aria-label="Barra de Navegacion" class="astro-5BLMO7YK">
      <ul class="astro-5BLMO7YK">
         <li class="astro-5BLMO7YK">
            <a href="#products" class="astro-5BLMO7YK">
               Productos
               <svg xmlns="http://www.w3.org/2000/svg" class="icon astro-5BLMO7YK" viewBox="0 0 24 24">
                  <path class="icon astro-5BLMO7YK" fill="currentColor" d="M6 22q-.825 0-1.413-.588T4 20V8q0-.825.588-1.413T6 6h2q0-1.65 1.175-2.825T12 2q1.65 0 2.825 1.175T16 6h2q.825 0 1.413.588T20 8v12q0 .825-.588 1.413T18 22H6Zm0-2h12V8h-2v2q0 .425-.288.713T15 11q-.425 0-.713-.288T14 10V8h-4v2q0 .425-.288.713T9 11q-.425 0-.713-.288T8 10V8H6v12Zm4-14h4q0-.825-.588-1.413T12 4q-.825 0-1.413.588T10 6ZM6 20V8v12Z">
                  </path>
               </svg>
            </a>
         </li>
         <li class="astro-5BLMO7YK">
            <a href="#trabajos" class="astro-5BLMO7YK">
               Trabajos a Medida ${renderComponent($$result, "Icon", $$Icon, { "class": "icon astro-5BLMO7YK", "name": "ph:ruler" })}
            </a>
         </li>
         <li class="astro-5BLMO7YK">
            <a href="#ubicacion" class="astro-5BLMO7YK">
               Ubicacion ${renderComponent($$result, "Icon", $$Icon, { "name": "ic:baseline-location-on", "class": "icon astro-5BLMO7YK" })}
            </a>
         </li>
      </ul>
   </nav>
   <label aria-label="Menu" for="nav-toggle" class="nav-toggle-label astro-5BLMO7YK">
      <span class="astro-5BLMO7YK"></span>
   </label>
</header>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Navbar.astro");

const $$Astro$2 = createAstro("https://valenmetal.github.io");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer aria-label="Footer" class="footer-container astro-SZ7XMLTE" id="footer">
   <div class="footer-info astro-SZ7XMLTE">
      <div class="brand astro-SZ7XMLTE">Zingueria Marquez</div>
      <div class="social-container astro-SZ7XMLTE">
         <a aria-label="Instagram" href="https://www.instagram.com/zm.grz/" class="astro-SZ7XMLTE">
            ${renderComponent($$result, "Icon", $$Icon, { "class": "social-logo astro-SZ7XMLTE", "name": "ph:instagram-logo" })}
         </a>
         <a aria-label="WhatsApp" href="https://api.whatsapp.com/send?phone=5491130206654" class="astro-SZ7XMLTE">${renderComponent($$result, "Icon", $$Icon, { "class": "social-logo astro-SZ7XMLTE", "name": "ph:whatsapp-logo-light" })}
         </a>
      </div>
   </div>
</footer>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Footer.astro");

const $$Astro$1 = createAstro("https://valenmetal.github.io");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
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

const $$Astro = createAstro("https://valenmetal.github.io");
async function getStaticPaths() {
  const data = await fetch("products.json").then(
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": prod.name, "class": "astro-LTEKGSV4" }, { "default": ($$result2) => renderTemplate`
    ${maybeRenderHead($$result2)}<main class="astro-LTEKGSV4">
        <div class="product astro-LTEKGSV4">
            <a class="backBtnPos astro-LTEKGSV4" href="/#products">
                <button class="backBtn astro-LTEKGSV4">
                    ${renderComponent($$result2, "Icon", $$Icon, { "name": "charm:arrow-left", "class": "icon astro-LTEKGSV4" })}
                    Volver
                </button>
            </a>
            <h2 class="titulo-prod astro-LTEKGSV4">${prod.name}</h2>
            <div class="gallery astro-LTEKGSV4">
                <img class="prodImg astro-LTEKGSV4"${addAttribute(`../../../${prod.src}`, "src")} alt="Product Image">
                
                ${prod.src2 ? renderTemplate`<img class="prodImg astro-LTEKGSV4"${addAttribute(`../../../${prod.src2}`, "src")} alt="Product Image">` : {}}
                ${prod.src3 ? renderTemplate`<img class="prodImg astro-LTEKGSV4"${addAttribute(`../../../${prod.src3}`, "src")} alt="Product Image">` : {}}
                ${prod.src4 ? renderTemplate`<img class="prodImg astro-LTEKGSV4"${addAttribute(`../../../${prod.src4}`, "src")} alt="Product Image">` : {}}
                ${prod.src5 ? renderTemplate`<img class="prodImg astro-LTEKGSV4"${addAttribute(`../../../${prod.src5}`, "src")} alt="Product Image">` : {}}
                ${prod.src6 ? renderTemplate`<img class="prodImg astro-LTEKGSV4"${addAttribute(`../../../${prod.src6}`, "src")} alt="Product Image">` : {}}
            </div>
            <h3 class="astro-LTEKGSV4">Descripcion</h3>
            <p class="astro-LTEKGSV4">${prod.description_2}</p>
        </div>
    </main>
` })}`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/product-details/[id].astro");

const $$file = "C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/product-details/[id].astro";
const $$url = "/React-Astro-E-Commerce/product-details/[id]";

const _id_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Icon as $, _id_ as _, $$Layout as a };
