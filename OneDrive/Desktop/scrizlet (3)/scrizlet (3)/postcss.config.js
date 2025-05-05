// postcss.config.js

export default {
  plugins: {
    // Tailwind CSS: processes your CSS according to your Tailwind config,
    // generating utility classes and handling @tailwind directives.
    tailwindcss: {},

    // Autoprefixer: adds vendor prefixes (e.g. -webkit-, -moz-) to CSS rules
    // based on your browserslist config, for wider browser support.
    autoprefixer: {},
  },
}
//PostCSS is a tool that sits between your raw
//  .css files (or your CSS-in-JS imports) and the browser-ready CSS that actually ships. 
// It reads your styles, runs them through whatever plugins you’ve configured,
//  and spits out transformed CSS. In your setup: