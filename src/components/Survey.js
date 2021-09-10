/*for the survey, we get the data dinamically during the runtime.
The data are queried by React (see below getRecords function) not by Gatsby plugin, they are displayed for the user to vote.
when the user votes the data are updated dinamically in airtable and then the data are fetched back
In Gatsby config we don't add the table "survey" there is in airtable as the data are not queried at
build time like the projects for example. On the other hand, the survey data are queried when the components is rendered in the browser (at runtime).
The component renders and the useEffect hook fires getRecords function that retrieves the data.
For this to happen, the airbase.js node package is used*/

import React, { useEffect, useState } from 'react'
import Title from './Title'
import styled from 'styled-components'
import base from './Airtable'
import { FaVoteYea } from 'react-icons/fa'

const Survey = () => {
  const [items, setItems] = useState([])
  //loading is displayed while the component is spinning up
  const [loading, setLoading] = useState(true)
  const getRecords = async () => {
    //"survey" is the name of my table in Airtable
    //we are able to access data in airtable inside the survey table as we have setup the API keys and base id
    //inside the Airtable.js file
    const records = await base('survey')
      .select({})
      .firstPage()
      .catch(err => console.log(err))
    console.log(records)
    //I grab only the data I need, the id and the field, by mapping over the records
    const newItems = records.map(record => {
      const { id, fields } = record
      return { id, fields }
    })
    setItems(newItems)
    setLoading(false)
  }

  const giveVote = async id => {
    //right after we click to vote the loading message is visible for a short time
    setLoading(true)
    //we map over the items and we increase the vote for the item which has a matching id
    const tempItems = [...items].map(item => {
      if (item.id === id) {
        let { id, fields } = item
        fields = { ...fields, votes: fields.votes + 1 }
        return { id, fields }
      } else {
        return item
      }
    })
    //below the update of the data in airtable with the method "update" and their render in the survey component
    //by firing setItems
    const records = await base('Survey')
      .update(tempItems)
      .catch(err => console.log(err))
    const newItems = records.map(record => {
      const { id, fields } = record
      return { id, fields }
    })
    setItems(newItems)
    setLoading(false)
  }

  //when the survey component has rendered the getRecords is fired:
  useEffect(() => {
    getRecords()
  }, [])
  console.log(items)
  return (
    <Wrapper className="section">
      <div className="container">
        <Title title="survey"></Title>
        <h3>most impostant room in the house?</h3>
        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <ul>
            {items.map(item => {
              const {
                id,
                fields: { name, votes },
              } = item
              return (
                <li key={id}>
                  <div className="key">
                    {name.toUpperCase().substring(0, 2)}
                  </div>
                  <div>
                    <h4>{name}</h4>
                    <p>{votes} votes</p>
                  </div>
                  {/*we use the id to increment the votes for a specific element */}
                  <button onClick={() => giveVote(id)}>
                    <FaVoteYea />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  .container {
    width: 90vw;
    max-width: var(--max-width);

    margin: 0 auto;
    h3 {
      text-align: center;
      color: var(--clr-grey-5);
      margin-bottom: 4rem;
    }
    ul {
      margin-top: 2rem;
      display: grid;
      gap: 2rem;
      grid-gap: 2rem;
      @media (min-width: 992px) {
        & {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (min-width: 1200px) {
        & {
          grid-template-columns: 1fr 1fr 1fr;
        }
      }
    }
    li {
      background: var(--clr-grey-10);
      border-radius: var(--radius);
      padding: 0.75rem 1rem;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 0 3rem;
      grid-gap: 0 3rem;
      align-items: center;
      .key {
        color: var(--clr-white);
        font-size: 1.5rem;
        background: var(--clr-primary-7);
        padding: 0.5rem 1rem;
        border-radius: var(--radius);
      }
      p {
        margin-bottom: 0;
        color: var(--clr-grey-5);
        letter-spacing: var(--spacing);
      }
      h4 {
        margin-bottom: 0;
      }
      button {
        background: transparent;
        border-color: transparent;
        font-size: 2rem;
        cursor: pointer;
        color: var(--clr-black);
      }
      button:disabled {
        color: var(--clr-grey-6);
        cursor: not-allowed;
      }
    }
  }
`
export default Survey
