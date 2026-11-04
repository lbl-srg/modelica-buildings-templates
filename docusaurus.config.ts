import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
  title: "ctrl-flow",
  tagline: "Modelica Template Development Guide",
  favicon: "img/favicon.png",

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  // Set the production url of your site here
  url: "https://lbl-srg.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/modelica-buildings-templates/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "lbl-srg", // Usually your GitHub org/user name.
  projectName: "modelica-buildings-templates", // Usually your repo name.

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  clientModules: [require.resolve("./src/prism-modelica.js")],

  plugins: [
    [
      require.resolve("docusaurus-lunr-search"),
      {
        // Do not set includeRoutes or excludeRoutes: this plugin calls minimatch 3
        // as a function, but package.json overrides it to 11, which crashes the build
        indexBaseUrl: true, // Because docs is served at the site's root, see routeBasePath
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/", // Serve the docs at the site's root
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          sidebarPath: require.resolve("./sidebars.ts"),
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/lbl-srg/modelica-buildings-template",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      // Keep in sync with the "katex" override in package.json
      href: "https://cdn.jsdelivr.net/npm/katex@0.19.1/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-WwGtaC6ywCHxA5cstpj/3+xIZvTez8dq2IcBQaXRkenHZ7FVVq1ZROtURwfbtTlG",
      crossorigin: "anonymous",
    },
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "ctrl-flow",
      logo: {
        alt: "Logo",
        src: "img/favicon.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Guide",
        },
      ],
    },
    footer: {
      copyright:
        `Copyright © ${new Date().getFullYear()}` +
        "The Regents of the University of California through Lawrence Berkeley National Laboratory. All rights reserved.",
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
