import { useState, useEffect, useRef } from 'react'
import { Ball, BallProps, Astronaut, AstronautProps } from './element'
import chroma from 'chroma-js'

interface SpaceProps {

}

class Space {
  x: number = 0
  y: number = 0
  W: number = 0
  H: number = 0
  renderBalls:  Ball[] = []
  color: string = '#42666'
  difColor: string
  sun:string =  'rgb(255,187,57)'
  astronaut: AstronautProps
  renderAstronaut: Astronaut
  orbital: {
    R: number
    speed: number
    stars: (BallProps & { diff1?: string, angle?: number }) []
  }[] = []
  constructor(props: SpacepProps) {
    this.x = 0
    this.y = 0
    this.W = 0
    this.H = 0
    this.orbital = []
    this.renderBalls = []
    Object.assign(this, props)
  }
  init(ctx) {
    this.orbital.forEach(item => {
      new Ball({
        x: this.x,
        y: this.y,
        r: item.R,
        fillStyle: 'rgba(0, 0, 0, 0)',
        strokeStyle: this.difColor,
        lineWidth: 2
      }).render(ctx)
    })
    this.orbital.forEach(item => {
      item.stars.forEach(star => {
        const { fillStyle, diff1, r, angle, strokeStyle, lineWidth } = star
        this.renderBalls.push(
          new Ball({
            fillStyle,
            diff1,
            r,
            angle,
            strokeStyle,
            lineWidth,
            R: item.R,
            X: this.x,
            Y: this.y,
            speed: item.speed
          })
        )
      })
    })
    this.renderAstronaut = new Astronaut(this.astronaut)
  }
  render(ctx) {
    const grd = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, 1300)
    grd.addColorStop(0, this.sun)
    grd.addColorStop(0.06, this.difColor)
    grd.addColorStop(1, this.color)
    ctx.fillStyle = grd
    console.log(this.difColor, this.color);
    console.log(this.W, this.H);
    
    
    ctx.fillRect(0, 0, this.W, this.H)
  }
}

export default (props: { color?: string }) => {
  const { color = '#426666' } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D>(null)
  const timerRef = useRef(0)

  const init = () => {
    window.cancelAnimationFrame(timerRef.current)
    const { offsetWidth, offsetHeight } = canvasRef.current.parentElement
    canvasRef.current.width = offsetWidth
    canvasRef.current.height = offsetHeight
    draw([offsetWidth, offsetHeight])
  }

  const draw = ([W, H]: [number, number]) => {
    ctxRef.current.clearRect(0, 0, W, H)
    const diff1 = chroma(chroma.random())
        .luminance(0.6)
        .css()
    const diff2 = chroma(chroma.random())
      .luminance(0.6)
      .css()
    const diff3 = chroma(chroma.random())
      .luminance(0.6)
      .css()
    const loh = chroma(color).luminance(0.35).css()
    const sun = 'rgb(255,187,57)'
    const space = new Space({
      x: W * 0.8,
      y: H * 0.2,
      W: W,
      H: H,
      color: chroma(color).luminance(0.2).css(),
      difColor: loh,
      sun: sun,
      astronaut: {
        x: W * 0.2,
        y: H * 0.4,
        jet: 400,
        jetStyle: loh
      },
      orbital: [
        {
          R: W * 0.25,
          speed: 0.0012,
          stars: [
            {
              fillStyle: diff1,
              r: 6,
              angle: 0,
              strokeStyle: loh,
              lineWidth: 2
            },
            {
              fillStyle: diff1,
              r: 10,
              angle: 4.4,
              strokeStyle: loh,
              lineWidth: 4
            },
            {
              fillStyle: diff2,
              r: 20,
              angle: 2,
              strokeStyle: loh
            },
            {
              fillStyle: diff2,
              r: 8,
              angle: 2.5,
              strokeStyle: loh,
              lineWidth: 4
            },
            {
              fillStyle: diff3,
              r: 13,
              angle: 5,
              strokeStyle: loh
            }
          ]
        },
        {
          R: W * 0.4,
          speed: 0.0006,
          stars: [
            {
              fillStyle: diff3,
              r: 24,
              angle: 1.2,
              strokeStyle: loh
            },
            {
              fillStyle: diff3,
              r: 8,
              angle: 1.8,
              strokeStyle: loh
            },
            {
              fillStyle: diff3,
              r: 18,
              angle: 2.6,
              strokeStyle: loh,
              lineWidth: 18
            },
            {
              fillStyle: diff1,
              r: 18,
              angle: 6,
              strokeStyle: loh,
              lineWidth: 15
            },
            {
              fillStyle: diff1,
              r: 8,
              angle: 4
            },
            {
              fillStyle: diff2,
              r: 26,
              angle: 3.1,
              strokeStyle: loh
            }
          ]
        },
        {
          R: W * 0.7,
          speed: 0.0002,
          stars: [
            {
              fillStyle: diff2,
              r: 26,
              angle: 3.2,
              strokeStyle: loh
            },
            {
              fillStyle: diff2,
              r: 16,
              angle: 3.6,
              strokeStyle: loh
            },
            {
              fillStyle: diff2,
              r: 35,
              angle: 5.8,
              strokeStyle: loh
            },
            {
              fillStyle: diff3,
              r: 20,
              angle: 2.4,
              strokeStyle: loh
            },
            {
              fillStyle: diff3,
              r: 12,
              angle: 0,
              strokeStyle: loh,
              lineWidth: 14
            },
            {
              fillStyle: diff1,
              r: 18,
              angle: 4.7
            },
            {
              fillStyle: diff1,
              r: 22,
              angle: 1.6,
              strokeStyle: loh,
              lineWidth: 20
            },
            {
              fillStyle: diff1,
              r: 8,
              angle: 0.4,
              strokeStyle: loh,
              lineWidth: 12
            }
          ]
        }
      ]
    })
    space.init(ctxRef.current)
    let move = () => {
      ctxRef.current.clearRect(0, 0, W, H)
      space.render(ctxRef.current)
      space.renderBalls.forEach(star => {
        star.x = star.X + star.R * Math.cos(star.angle)
        star.y = star.Y + star.R * Math.sin(star.angle)
        star.angle += star.speed
        star.angle %= Math.PI * 2
        star.render(ctxRef.current)
      })
      if (space.renderAstronaut.x > W + space.renderAstronaut.jet) {
        space.renderAstronaut.x = -60
      }
      space.renderAstronaut.x += 0.5
      space.renderAstronaut.render(ctxRef.current)
      timerRef.current = requestAnimationFrame(move)
    }
    move()
  }

  // useEffect(draw, [size])

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d')
      init()
      window.onresize = () => {
        init()
      }
    }
  })

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
