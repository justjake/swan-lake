import React, { Component } from 'react';
import { Motion, spring, presets } from 'react-motion'
import classNames from 'classnames';
import _ from 'lodash';

// this is wat
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(poops) {
    super(poops)
    this.state = {
      show: false,
      x: null,
      y: null,
    }
    window.addEventListener(
      "mousemove",
      _.debounce(this.onMM.bind(this), 70)
    )
  }

  onMM(e) {
    this.setState({
      x: e.clientX,
      y: e.clientY,
    })
    console.log(this.state)
  }

  render() {
    const style = {
      flexGrow: 1,
    }

    const xr = this.state.x / window.innerWidth
    const yr = this.state.y / window.innerHeight

    return (
      <div>
        <Paper c="butt" h={10}>
          {
            range(11).map(h => <Paper h={h} />)
          }
        </Paper>

        <Motion style={{
          h: spring( scale(1, 10, this.state.y / window.innerHeight)),
          x_off: wob(scale(-50, 50, xr)),
          y_off: wob(scale(-50, 50, yr)),
        }}>
          {
            ({h, x_off, y_off}) => <Paper c="butt" h={h} style={{
              top: y_off,
              left: x_off,
            }} />
          }
        </Motion>
    </div>
    );
  }
}

const between = (min, max, value) => Math.max(Math.min(max, value), min)
const scale = (min, max, ratio) => ((max - min) * between(0, 1, ratio)) + min
const range = (num) => {
  const r = []
  for (let i = 0; i < num; i++) r.push(i)
  return r
}
const wob = (v) => spring(v, presets.wobbly)

const Paper = ({children, className, style, height, h, c} = {height: 5}) => {
  const c_ = className || c
  const h_ = between(1, 10, h || height)
  const shadow = `0px ${3 * h_}px ${0.5 * h_}em rgba(0, 0, 0, ${1 - scale(0.1, 0.5, h_)})`
  const style_ = Object.assign({ boxShadow: shadow }, style)

  return (
    <div className={classNames(c_, 'paper')} style={style_}>
      { children }
    </div>
  )
}


const Guy = (props) => {

  return (
    <div>guy</div>

  )
}

export default App;
