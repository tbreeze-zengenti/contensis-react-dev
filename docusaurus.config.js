// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "React Starter",
  tagline: "Kick-start your Contensis development with React",
  favicon: "img/icon.svg",
  url: "https://react-starter.com/",
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
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog:  {
          showReadingTime: true,
        },
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
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Contensis React Starter",
        logo: {
          alt: "A cube at an isometic angle",
          src: "img/logo-light.svg",
          srcDark: "img/logo-dark.svg"
        },
        items: [
          {
            to: 'docs',
            label: 'Docs',
            position: 'left',
          },
          { 
            to: 'blog', 
            label: 'Blog',
            position: 'left'
          },
          {
            href: "https://gitlab.zengenti.com/starter-projects/react-starter",
            label: "GitLab",
            position: "right",
          },
        ],
      },
      colorMode: {
        disableSwitch: false,
      },
      // announcementBar: {
      //   content: '🏗️ Under Construction: Some sections may be missing or incomplete. Feedback can be submitted <a href="https://forms.gle/nHWUt46u58TbmBxu7">here</a>.',
      //   backgroundColor: 'var(--bg-color)',
      //   textColor: 'var(--text-color)',
      //   isCloseable: true,
      // },
      footer: {
        style: "light",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Installation",
                to: "/docs/react-starter/getting-started/installation",
              },
              {
                label: "Basics",
                to: "/docs/react-starter/basics/components",
              },
              {
                label: "Routing",
                to: "/docs/react-starter/routing",
              },
              {
                label: "Search",
                to: "/docs/react-starter/search",
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
        additionalLanguages: ["diff", "diff-ts"],
      },
    }),
};

module.exports = config;
