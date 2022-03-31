const fs = require("fs");
const sass = require("sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const scssFunctions = require("./scss-functions.js");

async function main() {
  const sassResult = sass.compile("src/scss/style.scss", {
    functions: scssFunctions,
    sourceMap: true,
  });

  const postcssResult = await postcss([
    autoprefixer({}),
    cssnano({
      preset: "default",
    }),
  ]).process(sassResult.css, {
    from: "src/scss/style.css",
    to: "public/scss/style.css",
    map: {
      prev: sassResult.sourceMap,
      annotation: true,
    },
  });

  fs.mkdirSync("public/scss", { recursive: true });
  fs.writeFileSync("public/scss/style.css", postcssResult.css, "utf-8");
  fs.writeFileSync(
    "public/scss/style.css.map",
    postcssResult.map.toString(),
    "utf-8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
