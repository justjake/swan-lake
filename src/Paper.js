
class App extends Component {

  constructor(poops) {
    super(poops)
    this.state = {
      show: false,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      prev_x: window.innerWidth / 2,
      prev_y: window.innerHeight / 2,
      perspective: 500,
      stiffness: 70,  // presets.wobbly.stiffness,
      damping: 8 // presets.wobbly.damping,
    }
    this.prev_pos = {x: this.state.x, y: this.state.y}
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
      <Paper c="butt" h={2}>
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

    const size = 100

    const uncenter = (point, width) => ({
      x: point.x - width / 2,
      y: point.y - width / 2})

    const dest = uncenter({x: this.state.x, y: this.state.y}, size);
    const prev_dest = uncenter({x: this.state.prev_x, y: this.state.prev_y}, size);

    return (
      <div style={{perspective: this.state.perspective}}>
        <Paper c="butt" h={2}>
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
          x: this.spring(dest.x),
          y: this.spring(dest.y),
        }}>
          {
            ({x, y}) => {
              const maxAngle = 50

              const pos = {x, y}
              const prog = pointwise(progress)(prev_dest, dest, pos)
              const directions = {
                x: pos.x >= this.prev_pos.x ? 1 : -1,
                y: pos.y >= this.prev_pos.y ? 1 : -1,
              }

              const arc = pointwise(parabola)(prog)

              // TODO: scale maxAngle based on width:height ratio of the object being transformed

              const rotateX = (directions.y * -1) * scale(0, maxAngle, arc.y)
              //const rotateY = directions.x * scale(0, maxAngle * 2, arc.y)

              const height = scale(3, 50, magnitude(arc))
              const transforms = [
               //`translateZ(${scale(0, 400, magnitude(arc))}px)`,
               //`rotateX(${scale(maxAngle, 0, xp)}deg)`,
               //`rotateY(${scale(maxAngle, 0, yp)}deg)`,
               `rotateX(${rotateX}deg)`,
               //`rotateY(${rotateY}deg)`,
              ]

              const saturation = 81;
              const lightness = 65 + rotateX * 2

              const transform = transforms.join(' ')
              const background = `hsl(225, ${saturation}%, ${lightness}%)`
              //console.log(x_off, x_off_dest, distance, p, height)

              this.prev_pos = pos

              // console.log({prev_dest, dest, pos, prog, directions, arc})
              console.log(transform, arc, prog)

              return <Paper h={height} style={{
                position: 'fixed',
                top: y,
                left: x,
                transform,
                background,
                width: size,
                height: size,
                margin: 0,
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

export default App;
