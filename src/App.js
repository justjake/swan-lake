import React, { Component } from 'react';
import { Motion, spring, presets } from 'react-motion'
import classNames from 'classnames';
import _ from 'lodash';

window.spring = spring

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
      perspective: 500,
    }
    //window.addEventListener(
      //"mousemove",
      //_.debounce(this.onMM.bind(this), 70)
    //)
    window.addEventListener(
      "click",
      this.onClick.bind(this))
  }

  onPerspectiveChange(e) {
    this.setState({
      perspective: e.target.value
    })
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

  onClick(e) {
    this.setState({
      show: !this.state.show,
      x: e.clientX,
      y: e.clientY,
      prev_x: this.state.x,
      prev_y: this.state.y,
    })
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
      <div style={{perspective: this.state.perspective}}>
        <Paper c="butt" h={10}>
          {
            range(11).map(h => <Paper h={h} useStatic={this.state.show}/>)
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

              const distance = xp

              const p = parabola(distance)
              const height = scale(3, 30, p)
              const transform = `translateZ(${scale(0, 100, p)}px)`
              //console.log(x_off, x_off_dest, distance, p, height)

              return <Paper c="butt" h={height} style={{
                top: y_off,
                left: x_off,
                transform,
              }}>
                <label>Perspective
                  <input type="range" min="0" max="3000" value={this.state.perspective} onChange={this.onPerspectiveChange.bind(this)} />
                </label>
                <button onClick={() => this.setState({perspective: 500})}>reset</button>
                current: {this.state.perspective}px
              </Paper>
            }
          }
        </Motion>
    </div>
    );
  }
}

// returns the progress ratio of a value transitioning between a previous and next value
const progress = (prev, next, cur) => (cur - prev) / (next - prev)

// constrains a value between a min and a max
const between = (min, max, value) => Math.max(Math.min(max, value), min)

// linear scale between a min and max
const scale = (min, max, ratio) => ((max - min) * between(0, 1, ratio)) + min

// transforms a ratio to scale in a parabola, from 0, max at 0.5, to 1
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

const Paper = ({children, className, style, height, useStatic, h, c} = {height: 5, useStatic: true}) => {
  const c_ = className || c
  const h_ = between(1, 50, h || height)

  const yOffset = scale(0, 20, h_ / 10)
  const spread = scale(0.5, 2, h_ / 10)
  const darkness = scale(0.2, 0.6, h_ / 10)
  const staticDarkness = scale(0.2, 0.05, h_ / 10)

  const keyShadow = `0px ${yOffset}px ${spread}em rgba(0, 0, 0, ${darkness})`
  const staticShadow = `0px 2px 5px rgba(0, 0, 0, ${staticDarkness})`
  const shadow = useStatic ? [keyShadow, staticShadow].join(', ') : keyShadow
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
