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
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      perspective: 500,
      x_ang: 0,
      y_ang: 0,
      stiffness: 70,  // presets.wobbly.stiffness,
      damping: 8 // presets.wobbly.damping,
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

  renderStuff() {
    return (
      <Paper c="butt" h={10}>
        { range(11).map(h => <Paper h={h} useStatic={this.state.show}/>) }
      </Paper>
    )
  }

  spring(v) {
    return spring(v, { damping: this.state.damping, stiffness: this.state.stiffness })
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
        <Paper c="butt">
          <Paper h={1} transparent grow col>
            { this.renderSlider('damping', 0, 200) }
            { this.renderSlider('stiffness', 0, 200) }
          </Paper>
          <Paper h={1} transparent grow col>
            <pre>
              { JSON.stringify(this.state, null, '  ') }
            </pre>
          </Paper>
        </Paper>

        <Motion style={{
          h: spring( scale(1, 10, this.state.y / window.innerHeight)),
          x_off: this.spring(x_off_dest),
          y_off: this.spring(y_off_dest),
        }}>
          {
            ({h, x_off, y_off}) => {
              const maxAngle = 20

              const xp = progress(x_off_prev, x_off_dest, x_off)
              const yp = progress(y_off_prev, y_off_dest, y_off)
              const distance = xp

              const goingDown = y_off > y_off_prev
              const goingRight = x_off > x_off_prev


              //debugger;

              const p = parabola(distance)

              // TODO: scale maxAngle based on width:height ratio of the object being transformed
              const rotateX = (goingDown ? -1 : 1) * scale(0, maxAngle * 1.5, p)
              const rotateY = (goingRight ? 1 : -1) * scale(0, maxAngle * 2, p)

              const height = scale(3, 50, p)
              const transforms = [
               `translateZ(${scale(0, 400, p)}px)`,
               //`rotateX(${scale(maxAngle, 0, xp)}deg)`,
               //`rotateY(${scale(maxAngle, 0, yp)}deg)`,
               `rotateX(${rotateX}deg)`,
               `rotateY(${rotateY}deg)`,
              ]

              const saturation = 81 + rotateX * 1
              const lightness = 65 + rotateX * 2

              const transform = transforms.join(' ')
              const background = `hsl(225, ${saturation}%, ${lightness}%)`
              //console.log(x_off, x_off_dest, distance, p, height)

              return <Paper h={height} style={{
                top: y_off,
                left: x_off,
                transform,
                background,
                width: 100,
                height: 100,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '30px',
              }}>
              <img src={logo} />
              </Paper>
            }
          }
        </Motion>
    </div>
    );
  }

  renderSlider(stateName, min, max) {
    const onChange = e => this.setState({[stateName]: e.target.value})
    return <label>
      {stateName}: &nbsp;
      <input
        type="range"
        min={min}
        max={max}
        value={this.state[stateName]}
        onChange={onChange}
      />
      <input
        type="number"
        value={this.state[stateName]}
        onChange={onChange}
        style={{width: '4em'}}
      />
    </label>
  }

  renderForm() {
    return (
      <div>
      <label>Perspective
        <input type="range" min="0" max="3000" value={this.state.perspective} onChange={this.onPerspectiveChange.bind(this)} />
      </label>
      <label>x ang: {this.state.x_ang}
        <input type="range" min="-10" max="10" value={this.state.x_ang} onChange={e => this.setState({x_ang: e.target.value})} />
      </label>
      <label>y ang: {this.state.y_ang}
        <input type="range" min="-10" max="10" value={this.state.y_ang} onChange={e => this.setState({y_ang: e.target.value})} />
      </label>
      <button onClick={() => this.setState({perspective: 500, x_ang: 0, y_ang: 0})}>reset</button>
      current: {this.state.perspective}px
      </div>
    )
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
const offset = n => scale(-500, 500, n)
const range = (num) => {
  const r = []
  for (let i = 0; i < num; i++) r.push(i)
  return r
}
const wob = (v) => spring(v, presets.wobbly)

const Paper = ({
  children,

  // style
  height = 5, h,
  className, c,
  style,
  transparent,
  disableStaticLight,

  // flexbox layout
  col,
  reverse,
  grow,
} = {}) => {
  const c_ = c || className
  const h_ = between(1, 50, h || height)

  const yOffset = scale(0, 20, h_ / 10)
  const spread = scale(0.5, 2, h_ / 10)
  const darkness = scale(0.2, 0.6, h_ / 10) * (transparent ? 0.3 : 1)
  const staticDarkness = scale(0.2, 0.05, h_ / 10) * (transparent ? 0.3 : 1)

  const keyShadow = `0px ${yOffset}px ${spread}em rgba(0, 0, 0, ${darkness})`
  const staticShadow = `0px 2px 5px rgba(0, 0, 0, ${staticDarkness})`
  const boxShadow = disableStaticLight ?  keyShadow : [keyShadow, staticShadow].join(', ')

  let flexDirection = col ? 'column' : 'row'
  if (reverse) flexDirection += '-reverse'

  const style_ = Object.assign({
    boxShadow,
    flexDirection,
    flexGrow: grow === true ? 1 : grow,
    background: transparent ? 'transparent': null,
  }, style)

  console.log(style_)

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
