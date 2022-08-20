import React from 'react'
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

const URL = 'http://localhost:9000/api/result'

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super();
    this.state = initialState
  }
  getX = ()=>{
    const theIndex = this.state.index;
    if (theIndex === 0 || theIndex === 1  || theIndex === 2 ){
      this.setState({
        ...this.state,
        x: 1
      })} 
      if (theIndex === 3 || theIndex === 4  || theIndex === 5 ){
        this.setState({
          ...this.state,
          x: 2
        })} 
        if (theIndex === 6 || theIndex === 7  || theIndex === 8 ){
          this.setState({
            ...this.state,
            x: 3
          })} 
    }

  getY = () =>{
    const theIndex = this.state.index
    if (theIndex === 0 || theIndex === 3  || theIndex === 6 ){
      this.setState({
        ...this.state,
        y: 1
      }, this.getX)} 
      if (theIndex === 1 || theIndex === 4  || theIndex === 7 ){
        this.setState({
          ...this.state,
          y: 2
        }, this.getX)} 
        if (theIndex === 2 || theIndex === 5  || theIndex === 8 ){
          this.setState({
            ...this.state,
            y: 3
          }, this.getX)} 
    }
    
  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const point = direction.target.id
    
    if (point === 'left') {
      this.state.index > 0 && this.state.index !== 3 && this.state.index !== 6?
      this.setState({ ...this.state, index: this.state.index -1, steps: this.state.steps +1, cords: grid[this.state.index -1], message: '' }, 
      this.getY) :
      this.setState({ ...this.state, message: `You can't go left`})
    }
    if (point === 'right') {
      this.state.index < 8 && this.state.index !== 2 && this.state.index !== 5?
      this.setState({ ...this.state, index: this.state.index +1, steps: this.state.steps +1, cords: grid[this.state.index +1 ], message: '' }, 
      this.getY) :
      this.setState({ ...this.state, message: `You can't go right`});
    }    
    if (point === 'up') {
      this.state.index >= 3?
      this.setState({ ...this.state, index: this.state.index -3, steps: this.state.steps +1, cords: grid[this.state.index -3], message: '' }, 
       this.getY) :
      this.setState({ ...this.state, message: `You can't go up`});
    }
    if (point === 'down') {
      this.state.index <= 5?
      this.setState({ ...this.state, index: this.state.index +3, steps: this.state.steps +1, cords: grid[this.state.index +3], message: '' }, 
      this.getY) :
      this.setState({ ...this.state, message: `You can't go down`});
    }
  }
  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      ...this.state,
      email: evt.target.value
  })
  }


  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    const email = this.state.email;
    if (email === ''){
      this.setState({ ...this.state, message: `Ouch: email is required`})
    }
  
    evt.preventDefault()
    axios.post(URL, { "x": this.state.x, "y": this.state.y, "steps": this.state.steps, "email": this.state.email }
    )
    .then( async res =>{
      const expected = res.data.message
      const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );
      this.reset()
      await delay(500)
      this.setState({ ...this.state, message: expected})
      ;
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.state.cords}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.getNextIndex} id="left">LEFT</button>
          <button onClick={this.getNextIndex} id="up">UP</button>
          <button onClick={this.getNextIndex} id="right">RIGHT</button>
          <button onClick={this.getNextIndex} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form>
          <input onChange={this.onChange} id="email" type="email" placeholder="type email"></input>
          <input onClick={this.onSubmit} id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
