// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "React Starter",
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
        gtag: {
          trackingID: 'G-ENBB677FNZ',
          anonymizeIP: true,
        },
      }),
    ],
  ],


  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */

    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "React Starter",
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
      announcementBar: {
        content: '🏗️ Under Construction: Some sections may be missing or incomplete. Feedback can be submitted <a href="https://forms.gle/nHWUt46u58TbmBxu7">here</a>.',
        backgroundColor: '#f5f6f7',
        isCloseable: true,
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Installation",
                to: "/react-starter/getting-started/installation",
              },
              {
                label: "Basics",
                to: "/react-starter/basics/components",
              },
              {
                label: "Routing",
                to: "/react-starter/routing",
              },
              {
                label: "Search",
                to: "/react-starter/search",
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
        // copyright: `Copyright © 2024 Zengenti Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
