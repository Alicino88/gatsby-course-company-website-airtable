//dotenv is the package required to be able to use the env variables (.env.production and .env.development files)
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
// const queries = require("./src/constants/algolia")
module.exports = {
  siteMetadata: {
    title: `Design Shop`,
    description: `Gatsby Airtable Example. Built using Airtable, Algolia Search, Gatsby Background Image plugin and  React Context API. Containts two sliders, real-time Airtable updates and submenus. Styled using Styled-Components. `,
    author: `@johnsmilga`,
    titleTemplate: `%s | Gatsby - Airtable`,
    url: `https://gatsby-airtable-design-project.netlify.app/`,
    image: `mainBcg.png`,
    twitterUsername: `@john_smilga`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      //plugin to connect to airtable headless cms
      resolve: `gatsby-source-airtable`,
      options: {
        apiKey: process.env.GATSBY_AIRTABLE_API, // may instead specify via env, see below
        concurrency: 5,
        tables: [
          //below I connect to multiple tables in airtable:
          {
            baseId: process.env.GATSBY_AIRTABLE_BASE_ID,
            tableName: `Projects`,
            //we map to a gatsby node to be able to use gatbsyimage
            //for more info https://www.gatsbyjs.com/plugins/gatsby-source-airtable/#install under "using markdown and attachments"
            mapping: { image: `fileNode` },
          },
          {
            baseId: process.env.GATSBY_AIRTABLE_BASE_ID,
            tableName: `customers`,
            //we map to a gatsby node to be able to use gatbsyimage
            //for more info https://www.gatsbyjs.com/plugins/gatsby-source-airtable/#install under "using markdown and attachments"
            mapping: { image: `fileNode` },
          },
        ],
      },
    },
  ],
}
