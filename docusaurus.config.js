// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Contensis React Dev",
  tagline: "Kick-start your Contensis development with React",
  favicon: "img/icon.svg",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  organizationName: "zengenti", 
  projectName: "contensis-react-dev",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog:  false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Contensis React",
        logo: {
          alt: "Zengenti rocket ship in a hexagon",
          src: "img/icon.svg",
        },
        items: [
          {
            href: "https://gitlab.zengenti.com/starter-projects/react-starter",
            label: "React Starter",
            position: "right",
          },
        ],
      },
      colorMode: {
        disableSwitch: false,
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Installation",
                to: "/react-starter/installation",
              },
              {
                label: "Routing",
                to: "/react-starter/Routing/routing",
              },
              {
                label: "Search",
                to: "/react-starter/Search/search",
              },
              {
                label: "Redux",
                to: "/react-starter/redux",
              },
            ],
          },
          {
            title: "API Docs",
            items: [
              {
                label: "Delivery API",
                href: "https://www.contensis.com/help-and-docs/apis/delivery-js",
              },
              {
                label: "Management API",
                href: "https://www.contensis.com/help-and-docs/apis/management-js",
              },
              {
                label: "Image API",
                href: "https://www.contensis.com/help-and-docs/apis/image-api",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: 'GitLab',
                href: 'https://gitlab.zengenti.com/starter-projects',
              },
              {
                label: "Contensis Blog",
                href: "https://www.contensis.com/community/blog",
              },
              {
                label: "Slack",
                href: "http://slack.contensis.com/",
              },
            ],
          },
        ],
        copyright: `This website is not officially endorsed or affiliated with Zengenti or Contensis. It's a personal project created by <a href="mailto:t.breeze@zengenti.com">Tim Breeze (t.breeze@zengenti.com)</a>.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
