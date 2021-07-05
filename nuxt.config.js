// function textrCustom(input) {
//   return input
//   // S to avagrah in Devanagari
//   // .replace(/(?<=\p{sc=Deva})S(?=\p{sc=Deva})/gu, 'ऽ')

//   // Commented these as installed @silvenon/remark-smartypants
//   // //  3 dots to ellipses
//   // .replace(/\.{3}/gim, '…')
//   // // 3 dashes to emdash
//   // .replace(/\-{3}/gim, '—')
//   // // 2 dashes to endash
//   // .replace(/\-{2}/gim, '–')

// }

import { mdiOpenInNew } from "@mdi/js"; // For remark-external-links

export default {
  ignore: [
    'prakritdictionary',
  ],

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Create only modern build
  // Ref: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-modern
  // https://github.com/nuxt/nuxt.js/issues/4552#issuecomment-761786540
  // modern: "client",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // htmlAttrs: {
    //   lang: 'en'
    // },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: "Jain Aagam"
      },
      { hid: "og:type", property: "og:type", content: "website" },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: ""
      },
      {
        rel: "preconnect",
        href: "https://www.google-analytics.com",
      },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/ga.js', mode: 'client' }, // Google Analytics, only on Browser, not on server
    '~/plugins/vue-scrollactive.js',
    '~/plugins/directives',
    '~/plugins/vue-google-charts.js', // https://github.com/devstark-com/vue-google-charts
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/vuetify', // https://vuetifyjs.com/en/getting-started/installation/#nuxt-install
    "@nuxtjs/svg"

  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/sitemap'
  ],

  sitemap: {
    hostname: 'https://aagam.jainism.info',
    gzip: true,
    exclude: [
      '/prakritdictionary',
    ],
    routes: async () => {
      let routes = [];
      const { $content } = require('@nuxt/content')

      let postsEN = await $content('en', { deep: true })
        .without("body").where({ $and: [{ show: { $ne: false } }] })
        .sortBy("path")
        .fetch();

      let postsHI = await $content('hi', { deep: true })
        .without("body").where({ $and: [{ show: { $ne: false } }] })
        .sortBy("path")
        .fetch();

      for (const post of postsEN) {
        routes.push({
          url: `${post.to}/`,
          changefreq: 'daily',
          lastmod: post.updatedAt,
          // https://github.com/nuxt-community/sitemap-module/issues/122
          links: ['en', 'hi', 'x-default'].map(lang => {
            let url = lang === 'en' || lang === 'x-default' ? `${post.to}/` : `/${lang}${post.to}/`
            return {
              lang: lang,
              url: url
            }
          })
        });
      }
      for (const post of postsHI) {
        routes.push({
          url: `/hi/${post.to}/`,
          changefreq: 'daily',
          lastmod: post.updatedAt,
          links: ['en', 'hi', 'x-default'].map(lang => {
            let url = lang === 'en' || lang === 'x-default' ? `${post.to}/` : `/${lang}${post.to}/`
            return {
              lang: lang,
              url: url
            }
          })
        });
      }
      return routes;
    },
    filter({ routes }) {
      return routes.map((route) => {
        return {
          url: route.url.endsWith(`/`) ? route.url : `${route.url}/`, // Slash
          changefreq: route.changefreq ? route.changefreq : 'daily',
          lastmod: route.lastmod ? route.lastmod : new Date(),
          links: route.links && route.links.length > 0
            ? route.links
            : ['en', 'hi', 'x-default'].map(lang => {
              let page = route.name.split('__')[0] // https://github.com/nuxt-community/sitemap-module/issues/122#issuecomment-659377003
              page = page === 'index' ? '' : `${page}/`
              let url = lang === 'en' || lang === 'x-default' ? `/${page}` : `/${lang}/${page}`;
              return {
                lang: lang,
                url: url
              }
            })
        }
      })
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    dir: 'content-jainaagam',
    tocDepth: 4,
    nestedProperties: ['body.children', 'aagam.title', 'order.cat', 'order.aagam', 'order.aagam.position', 'order.book', 'order.book.position', 'order.section', 'order.section.position', 'order.part', 'order.part.position', 'order.chapter', 'order.chapter.position', 'order.lesson', 'order.lesson.position', 'order.sutra', 'order.sutra.position', 'parent.type', 'children.type', 'children.count', 'children.children'],
    extendParser: {
      // https://github.com/nuxt/content/issues/432
    },
    markdown: {
      remarkPlugins: [
        ['remark-breaks'],
        ['remark-autolink-headings', { behavior: 'append' }],
        ['remark-external-links', {
          target: '_blank',
          rel: 'noopener noreferrer',
          content: {
            type: "element",
            tagName: "svg",
            properties: {
              'aria-hidden': "true",
              className: ["tw-w-4", "tw-h-4", "tw-ml-1", "tw-fill-current"],
              role: "img",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
            },
            children: [
              {
                type: "element",
                tagName: "path",
                properties: { d: mdiOpenInNew }
              }
            ]
          },
          contentProperties: {
            'aria-hidden': "true",
            className: ["tw-inline-flex", "tw-justify-center", "tw-items-center", "tw-align-middle", "tw-text-gray-600"]
          },
        }],
        // ['remark-directive'],
        // ['~/plugins/remark/directive-custom.js'],
        ['@silvenon/remark-smartypants', { dashes: 'oldschool' }],
        // ['remark-textr', { plugins: [textrCustom] }],
        // ['~/plugins/remark/contributors.js'],
      ],
      prism: {
        theme: '~/assets/css/themes/prism-ghcolors.css'
      }
    },
    liveEdit: false,
    // fullTextSearchFields: ['title', 'description', 'text', 'slug']
  },

  vuetify: {
    customVariables: ['~/assets/css/themes/vuetify-variables.sass'],
    optionsPath: '~/plugins/vuetify.js',
    defaultAssets: false,
    treeShake: process.env.NODE_ENV === 'production'
  },

  hooks: {
    'content:file:beforeParse': (file) => {
      if (file.extension !== '.md') {
        return
      }
      else {
        file.data = file.data.replace(/(?<=\p{sc=Deva})S(?=\p{sc=Deva})/gu, 'ऽ')
        // S to avagrah in Devanagari

        if (file.path.match(/\\content\\hi\\/gi)) {
          // only on Hindi locale
          file.data = file.data.replace("## Meaning", "## अर्थ")
          file.data = file.data.replace("## Explanation", "## विवेचन")
        }
      }
    },
    'content:file:beforeInsert': async (document, database) => {
      if (document.extension === '.md') {
        const { time } = require('reading-time')(document.text)
        document.readingTime = time;

        const { dir, path, slug } = document

        const regexp = new RegExp(`^/(en|hi|gu)`, 'gi')
        const _dir = dir.replace(regexp, '')
        const _slug = slug.replace(/^index/, '')
        document.to = `${_dir}/${_slug}`

        // dir = dir.endsWith('/') ? dir : dir + '/';
        // path = path.endsWith('/') ? path : path + '/';

      }
      if (document.sutra) {
        document.sutra = {
          body: await database.markdown.generateBody(document.sutra),
        };
        // Now sutra has got a body, which makes it parse markdown content even in yaml.
        // https://github.com/nuxt/content/issues/628
      }
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // extractCSS: true,
    filenames: {
      app: ({ isDev, isModern }) => isDev ? `[name]${isModern ? '.modern' : ''}.js` : `[name].[contenthash:7]${isModern ? '.modern' : ''}.js`,
      chunk: ({ isDev, isModern }) => isDev ? `[name]${isModern ? '.modern' : ''}.js` : `[name].[contenthash:7]${isModern ? '.modern' : ''}.js`,
      css: ({ isDev }) => isDev ? '[name].css' : 'css/[name].[contenthash:7].css',
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[name].[contenthash:7].[ext]',
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[name].[contenthash:7].[ext]',
      video: ({ isDev }) => isDev ? '[path][name].[ext]' : 'videos/[name].[contenthash:7].[ext]'
    },
    // https://github.com/nuxt/nuxt.js/issues/4552#issuecomment-761786540
    // https://philipwalton.com/articles/deploying-es2015-code-in-production-today/
    // https://web.dev/codelab-serve-modern-code/
    babel: {
      presets({ isClient }, preset) {
        if (isClient) {
          preset[1].targets = {
            browsers: [
              'Chrome >= 60',
              'Safari >= 10.1',
              'iOS >= 10.3',
              'Firefox >= 54',
              'Edge >= 15',
            ]
          }
        }
        return [preset]
      }
    },
  },
  generate: {
    exclude: [//
    ],
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-generate#fallback
    fallback: '404.html',
    cache: {
      ignore: [
        '.nuxt', // buildDir
        'static', // dir.static
        'dist', // generate.dir
        'node_modules',
        '.**/*',
        '.*',
        'README.md',
        'archivecode', // archive folder
        // 'content-draft', // content draft folder
        'firebase.json' // firebase file (including redirects)
      ]
    }
  },

  // router: { trailingSlash: true },

}
