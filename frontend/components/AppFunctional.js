import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'


// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const grid = [
  ["1,1"],["1,2"],["1,3"],["2,1"],["2,2"],["2,3"],["3,1"],["3,2"],["3,3"]
]
const x = 2
const y = 2

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
  cords: grid[initialIndex],
  grid: grid,
  x: x,
  y: y,
}
export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [point, setPoint] = useState(initialState)
  const [prop, setProp] = useState(props)

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getX (){
    const theIndex = point.index;
    if (theIndex === 0 || theIndex === 1  || theIndex === 2 ){
      setPoint({
        ...point,
         x: point.x = 1
      }
      )} 
      if (theIndex === 3 || theIndex === 4  || theIndex === 5 ){
        setPoint({
          ...point,
          x: point.x = 1
        }
        )} 
        if (theIndex === 6 || theIndex === 7  || theIndex === 8 ){
          setPoint({
            ...point,
            x: point.x = 1
          }
          )} 
    }
  function getY(){
    const theIndex = point.index;
    if (theIndex === 0 || theIndex === 3  || theIndex === 6 ){
      setPoint({
        ...point,
        y: point.y = 1
      }) , getX()} 
      if (theIndex === 1 || theIndex === 4  || theIndex === 7 ){
        setPoint({
          ...point,
          y: point.y = 1
        }) , getX()} 
        if (theIndex === 2 || theIndex === 5  || theIndex === 8 ){
          setPoint({
            ...point,
            y: point.y = 1
          }) , getX()}  
    }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    let red = getX()
    let blue = getY()
   setPoint({...point, message: `Coordinates ${red}, ${blue}`}) 
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setPoint(initialState)
  }

  async function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const evtTarget = direction.target.id
    
    if (evtTarget === 'left') {
      point.index > 0 && point.index !== 3 && point.index !== 6?
      setPoint({
         ...point, index: point.index -1, steps: point.steps +1, cords: grid[point.index -1], message: '' }) :
      setPoint({ ...point, message: `You can't go left`});
    }
    if (evtTarget === 'right') {
      point.index < 8 && point.index !== 2 && point.index !== 5?
      setPoint({ ...point, index: point.index +1, steps: point.steps +1, cords: grid[point.index +1 ], message: '' }):
      setPoint({ ...point, message: `You can't go right`});
    }    
    if (evtTarget === 'up') {
      point.index >= 3?
      setPoint({ ...point, index: point.index -3, steps: point.steps +1, cords: grid[point.index -3], message: '' }) :
      setPoint({ ...point, message: `You can't go up`});
    }
    if (evtTarget === 'down') {
      point.index <= 5?
      setPoint({ ...point, index: point.index +3, steps: point.steps +1, cords: grid[point.index +3], message: '' }) :
      setPoint({ ...point, message: `You can't go down`});
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setPoint({
      ...point,
      email: evt.target.value
    })
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    const email = point.email;
    if (email === ''){
     setPoint({ ...point, message: `Ouch: email is required`})
    }
    evt.preventDefault()
    useEffect(()=>{
    axios.post(URL, { "x": point.x, "y": point.y, "steps": point.steps, "email": point.email }
    )
    .then( async res =>{
      const expected = res.data.message
      const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );
      await delay(500)
     setPoint({ ...point, message: expected})
      ;
      
    })
    .catch(function (error) {
      console.log(error);
    });
  })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{point.cords}</h3>
        <h3 id="steps">You moved {point.steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === point.index ? ' active' : ''}`}>
              {idx === point.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{point.message}</h3>
      </div>
      <div id="keypad">
        <button onClick={getNextIndex} id="left">LEFT</button>
        <button onClick={getNextIndex} id="up">UP</button>
        <button onClick={getNextIndex}id="right">RIGHT</button>
        <button onClick={getNextIndex} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form>
        <input onChange={onChange} id="email" type="email" placeholder="type email"></input>
        <input onClick={onSubmit} id="submit" type="submit"></input>
      </form>
    </div>
  )
}
