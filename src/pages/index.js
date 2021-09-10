import React from 'react'
import { graphql } from 'gatsby'
import {
  Layout,
  Hero,
  About,
  Projects,
  Survey,
  Slider,
  GridProjects,
} from '../components'

//data are the ones coming from the query
const HomePage = ({ data }) => {
  console.log(data)
  //below we destructure the object data and give an alias of "projects"
  const {
    allAirtable: { nodes: projects },
    customers: { nodes },
  } = data
  return (
    <Layout>
      <Hero />
      <About />
      {/*the queried data are passed as a prop to the Projects components */}
      <Projects projects={projects} title="latest projects" />
      <Survey />
      <Slider customers={nodes} />
    </Layout>
  )
}
export const query = graphql`
  {
    allAirtable(
      filter: { table: { eq: "Projects" } }
      limit: 3
      sort: { order: DESC, fields: data___date }
    ) {
      nodes {
        id
        data {
          Name
          date
          type
          image {
            localFiles {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED, placeholder: TRACED_SVG)
              }
            }
          }
        }
      }
    }

    customers: allAirtable(filter: { table: { eq: "customers" } }) {
      nodes {
        data {
          Name
          quote
          title
          image {
            localFiles {
              childImageSharp {
                gatsbyImageData(
                  layout: FIXED
                  width: 150
                  height: 150
                  placeholder: TRACED_SVG
                )
              }
            }
            id
          }
        }
      }
    }
  }
`
export default HomePage
