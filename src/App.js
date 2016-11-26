import React, { Component } from 'react';
import { Motion, spring, presets } from 'react-motion'
import classNames from 'classnames';
import _ from 'lodash';
import loremRandom from 'lorem-ipsum';

window.spring = spring

// this is wat
import logo from './logo.svg';
import './App.css';

const c_dark = '#e89371'
const c_bright = '#ff7d49'
const b_dark = '#9b9895'

const lorems = [ loremRandom({ count: 5 }) ]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusContent: true,
    }
  }

  depthToBlur(depth) {
    return scale(0, 6, progress(128, -48, depth)) + 'px'
  }

  renderRibbon(mz, hz) {
    const styles = {
      position: 'absolute',
      background: 'red',
    };

    // can't make a ribbon yet?
    if (!this.content || !this.header) {
      return <div style={styles} />
    }

    const height = 55;

    const leftEdge = this.header.offsetLeft + this.header.offsetWidth;
    const dist = this.content.offsetLeft - leftEdge;
    // thanls to nora for simplifying
    const angle = Math.atan((mz - hz) / dist);
    const ribbonZ = (mz + hz) / 2

    // TODO: calculate from selected item
    styles.top = (this.header.offsetTop + this.content.offsetTop) / 2;
    // TODO: make height of selected item
    styles.height = height;

    styles.left = (this.header.offsetLeft + this.header.offsetWidth);
    // will need to re-set this based on calculated desired hypotenuse.
    styles.width = this.content.offsetLeft - styles.left
    styles.transform = tsfm({
      translateZ: ribbonZ + 'px',
      rotateY: angle + 'rad'
    })
    return <div style={styles} />
  }

  render() {
    const focusZ = 128;
    const unfocusZ = -48;

    const { focusContent } = this.state;

    const hz = focusContent ? unfocusZ : focusZ;
    const mz = focusContent ? focusZ : unfocusZ;
    const onToggleClicked = () => this.setState({focusContent: !this.state.focusContent})

    return (
      <div style={{
        perspective: 1100,
      }}>
          <Motion style={{
            hz: spring(hz),
            mz: spring(mz),
          }}>{
            ({hz, mz}) => {
            return (
              <Paper transparent>

                <section
                  className="header"
                  style={{
                    transform: tsfm({ translateZ: hz + 'px', }),
                      filter: tsfm({blur: this.depthToBlur(hz)})
                  }}
                  onMouseEnter={() => this.setState({focusContent: false})}
                  onMouseLeave={() => this.setState({focusContent: true})}
                  ref={e => (this.header = e)}
                >
                  <h1>My Website</h1>
                  <div style={{padding: '0 10px'}}>
                    <Ipsum />
                  </div>
                  <ul className="nav">
                    { [1, 2, 3].map(i => <li key={i}>post {i}</li>) }
                    <li style={{
                      color: c_bright,
                      background: b_dark,
                    }}>
                      post 4
                    </li>
                    { [5].map(i => <li key={i}>post {i}</li>) }
                  </ul>
                </section>

                { this.renderRibbon(mz, hz) }

                <section
                  className="content"
                  style={{
                    transform: tsfm({translateZ: mz + 'px'}),
                    filter: tsfm({blur: this.depthToBlur(mz)}),
                  }}
                  ref={e => (this.content = e)}
                >
                  <h1>My post</h1>
                  <Ipsum />
                  <Ipsum />
                  <Ipsum />
                  <Ipsum />
                </section>

              </Paper>
            )
            }
          }</Motion>
      </div>
    );
  }
}

const Test3d = (style = {}) => {
  return (
    <div className="tf3d" style={style}>hi nora</div>
  )
}


// returns the progress ratio of a value transitioning between a previous and next value
const progress = (prev, next, cur) => {
  const r = (cur - prev) / (next - prev)

  // overshoot ? or should we not do this
  if (r > 1) {
    return 1 - r % 1
  }

  return r
}

// constrains a value between a min and a max
const between = (min, max, value) => Math.max(Math.min(max, value), min)

// linear scale between a min and max
const scale = (min, max, ratio) => ((max - min) * between(0, 1, ratio)) + min

// transforms a ratio to scale in a parabola, from 0, max at 0.5, to 1
const parabola = (x) => -x * (x - 1)

// returns a function that performs an operation on a point
const pointwise = f => (...points)=> (
  {
    x: f(...points.map(p => p.x)),
    y: f(...points.map(p => p.y)),
  }
)

const magnitude = p => Math.sqrt(p.x * p.y)

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

  //console.log(style_)

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

const Ipsum = (props) => {
  return (
  <p>
    { lorems[0] }
  </p>
  )
}

const tsfm = (props = {}) => Object.keys(props)
  .map(k => `${k}(${props[k]})`)
  .join(' ')

window.tsfm = tsfm;


export default App;
