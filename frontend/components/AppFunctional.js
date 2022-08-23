import React from 'react'
import { useState } from 'react'
import axios from 'axios'


// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const grid = [
  ["(1,1)"],["(2,1)"],["(3,1)"],["(1,2)"],["(2,2)"],["(3,2)"],["(1,3)"],["(2,3)"],["(3,3)"]
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
  time: 'times',
}

const URL = 'http://localhost:9000/api/result'

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [point, setPoint] = useState(initialState)
  const [prop, setProp] = useState(props)

  function reset() {
    // Use this helper to reset all states to their initial values.
    const input = document.getElementById("email")
    setPoint(initialState)
    input.value = ''
  }

  async function getNextIndex(direction, count) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const evtTarget = direction.target.id
    const x = point.x
    const y = point.y
    if (evtTarget === 'left') {
      point.index > 0 && point.index !== 3 && point.index !== 6?
      setPoint({
         ...point, 
         index: point.index -1, 
         steps: point.steps +1, 
         cords: grid[point.index -1], 
         message: '',
         x: x -1,
         time: count
        }):
      setPoint({ ...point, message: `You can't go left`});
    }
    if (evtTarget === 'right') {
      point.index < 8 && point.index !== 2 && point.index !== 5?
      setPoint({ 
        ...point, 
        index: point.index +1, 
        steps: point.steps +1, 
        cords: grid[point.index +1 ], 
        message: '',
        x: x +1,
        time: count
      }):
      setPoint({ ...point, message: `You can't go right`});
    }    
    if (evtTarget === 'up') {
      point.index >= 3?
      setPoint({ 
        ...point, 
        index: point.index -3, 
        steps: point.steps +1, 
        cords: grid[point.index -3], 
        message: '',
        y: y -1,
        time: count
      }) :
      setPoint({ ...point, message: `You can't go up`});
    }
    if (evtTarget === 'down') {
      point.index <= 5?
      setPoint({ 
        ...point, 
        index: point.index +3, 
        steps: point.steps +1, 
        cords: grid[point.index +3], 
        message: '',
        y: y +1,
        time: count
      }) :
      setPoint({ ...point, message: `You can't go down`});
    }
  }

  function move(direction) {
    const time = 'time';
    const times = 'times'

    if (point.steps === 0 && point.index === 4){
      getNextIndex(direction, time);
    }
    if (point.steps > 0){
      getNextIndex(direction, times);
    }
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

      axios.post(URL, { 
        x:  point.x, 
        y: point.y, 
        steps: point.steps, 
        email: point.email 
        })
      .then( res =>{
        const expected = res.data.message
        console.log(res)
        setPoint({ 
          ...point, 
          message: expected, 
          email: "", 
          index: point.index, 
          cords: point.cords
          })   
        })
      .catch((error) => {
        setPoint({
          ...point,
          message: error.response.data.message
          })
        });
  }

  return (
    <div id="wrapper" className={prop.className}>
      <div className="info">
        <h3 id="coordinates">{point.cords}</h3>
        <h3 id="steps">You moved {point.steps} {point.time}</h3>
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
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move}id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form>
        <input value={point.email} onChange={onChange} id="email" type="email" placeholder="type email"></input>
        <input onClick={onSubmit} id="submit" type="submit"></input>
      </form>
    </div>
  )
}
