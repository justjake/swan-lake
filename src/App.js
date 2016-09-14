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
      prev_x: this.state.x,
      prev_y: this.state.y,
    })
    console.log(this.state)
  }

  render() {
    const style = {
      flexGrow: 1,
    }

    const x_off_dest = offset(xr(this.state.x))
    const y_off_dest = offset(yr(this.state.y))

    const x_off_prev = offset(xr(this.state.prev_x))
    const y_off_prev = offset(yr(this.state.prev_y))

    return (
      <div>
        <Paper c="butt" h={10}>
          {
            range(11).map(h => <Paper h={h} />)
          }
        </Paper>

        <Motion style={{
          h: spring( scale(1, 10, this.state.y / window.innerHeight)),
          x_off: wob(x_off_dest),
          y_off: wob(y_off_dest),
        }}>
          {
            ({h, x_off, y_off}) => {
              const xp = progress(x_off_prev, x_off_dest, x_off)
              const yp = progress(y_off_prev, y_off_dest, y_off)

              const distance = (xp + yp) / 2

              const p = parabola(distance)
              const height = scale(1, 10, p)
              console.log(x_off, x_off_dest, distance, p, height)

              return <Paper c="butt" h={height} style={{
                top: y_off,
                left: x_off,
              }}>
              x: {x_off_dest} <br/>
                curr_x: {x_off}<br/>

                distance: {distance}<br/>

              </Paper>
            }
          }
        </Motion>
    </div>
    );
  }
}

const progress = (prev, next, cur) => (cur - prev) / (next - prev)
const between = (min, max, value) => Math.max(Math.min(max, value), min)
const scale = (min, max, ratio) => ((max - min) * between(0, 1, ratio)) + min
const parabola = (x) => -x * (x - 1)
const xr = x => x / window.innerWidth
const yr = y => y / window.innerHeight
const offset = n => scale(-100, 100, n)
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
