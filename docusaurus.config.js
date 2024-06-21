shiki = require('shiki');
fs = require ('fs');

const modelicaGrammar = JSON.parse(
    fs.readFileSync('./static/modelica.tmLanguage.json'))
const modelica = {
    id: 'modelica',
    ext: 'mo',
    scopeName: 'source.modelica',
    grammar: modelicaGrammar,
    aliases: ['mo', 'modelica'],
}
shiki.BUNDLED_LANGUAGES
    .push(modelica);

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ctrl-flow',
  tagline: 'Modelica Template Development Guide',
  favicon: 'img/favicon.png',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Set the production url of your site here
  url: 'https://lbl-srg.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/modelica-buildings-templates/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lbl-srg', // Usually your GitHub org/user name.
  projectName: 'modelica-buildings-templates', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [[ require.resolve('docusaurus-lunr-search'), {
    indexBaseUrl: true, // Because docs is served at the site's root, see routeBasePath
  }]],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // Serve the docs at the site's root
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
    [
      'docusaurus-preset-shiki-twoslash',
      {
        themes: ["light-plus", "dark-plus"],
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'ctrl-flow',
        logo: {
          alt: 'Logo',
          src: 'img/favicon.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Guide',
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} The Regents of the University of California through Lawrence Berkeley National Laboratory. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },

    }),
};

module.exports = config;
