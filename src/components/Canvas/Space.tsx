import { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react'
import { Ball, BallProps, Astronaut, AstronautProps } from './element'
import { randomInArr } from '../../utils/common'
import { generate } from '@ant-design/colors'

class Space {
  x: number = 0
  y: number = 0
  W: number = 0
  H: number = 0
  color: string = '#42666'
  difColor: string
  sun: string = 'rgb(255,187,57)'
  astronaut: AstronautProps
  orbital: {
    R: number
    speed: number
    stars: {
      fillStyle?: string
      r: number
      angle: number
      strokeStyle: string
      lineWidth: number
    }[]
  }[] = []
  constructor(props, ctx: CanvasRenderingContext2D) {
    this.x = 0
    this.y = 0
    this.W = 0
    this.H = 0
    this.orbital = []
    Object.assign(this, props)
    this.init(ctx)
  }
  init(ctx) {
    const grd = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, 1300)
    grd.addColorStop(0, this.sun)
    grd.addColorStop(0.06, this.difColor)
    grd.addColorStop(1, this.color)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, this.W, this.H)
    this.orbital.forEach((item) => {
      new Ball(
        {
          x: this.x,
          y: this.y,
          r: item.R,
          fillStyle: 'rgba(0, 0, 0, 0)',
          strokeStyle: this.difColor,
          lineWidth: 2,
        },
        ctx,
      )
      item.stars.forEach((star) => {
        const { fillStyle, r, angle, strokeStyle, lineWidth } = star
        const x = this.x + item.R * Math.cos(angle)
        const y = this.y + item.R * Math.sin(angle)
        new Ball(
          {
            r,
            strokeStyle,
            lineWidth,
            x: x,
            y: y,
            fillStyle,
          },
          ctx,
        )
      })
    }, ctx)
    new Astronaut(this.astronaut, ctx)
  }
}

interface IProps {
  color: string
  sunColor: string
  starColors: string[]
  animate?: boolean
}

export default (props: IProps) => {
  const { color, starColors, sunColor, animate = false } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D>(null)
  const timerRef = useRef(0)

  const colorPlane = useMemo(() => generate(color), [color])

  const init = () => {
    if (canvasRef.current) {
      window.cancelAnimationFrame(timerRef.current)
      const { offsetWidth, offsetHeight } = canvasRef.current.parentElement
      canvasRef.current.width = offsetWidth
      canvasRef.current.height = offsetHeight
      draw([offsetWidth, offsetHeight])
    }
  }

  const draw = ([W, H]: [number, number]) => {
    ctxRef.current.clearRect(0, 0, W, H)
    const options = {
      x: W * 0.8,
      y: H * 0.2,
      W: W,
      H: H,
      color: colorPlane[6],
      difColor: colorPlane[4],
      sun: sunColor,
      astronaut: {
        x: W * 0.2,
        y: H * 0.4,
        jet: 400,
        jetStyle: colorPlane[5],
        scale: 0.7,
      },
      orbital: [
        {
          R: W * 0.25,
          speed: 0.0012,
          stars: [
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.003,
              angle: 0,
              strokeStyle: colorPlane[4],
              lineWidth: W * 0.001,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.005,
              angle: 4.4,
              strokeStyle: colorPlane[4],
              lineWidth: W * 0.002,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.01,
              angle: 2,
              strokeStyle: colorPlane[4],
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.004,
              angle: 2.5,
              strokeStyle: colorPlane[4],
              lineWidth: W * 0.002,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.003,
              angle: 5,
              strokeStyle: colorPlane[4],
            },
          ],
        },
        {
          R: W * 0.4,
          speed: 0.0006,
          stars: [
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.012,
              angle: 1.2,
              strokeStyle: colorPlane[4],
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.004,
              angle: 1.8,
              strokeStyle: colorPlane[4],
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.009,
              angle: 2.6,
              strokeStyle: colorPlane[4],
              lineWidth: W * 0.009,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.009,
              angle: 6,
              strokeStyle: colorPlane[4],
              lineWidth: W * 0.008,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.004,
              angle: 4,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.013,
              angle: 3.1,
              strokeStyle: colorPlane[4],
            },
          ],
        },
        {
          R: W * 0.7,
          speed: 0.0002,
          stars: [
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.013,
              angle: 3.2,
              strokeStyle: colorPlane[4],
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.008,
              angle: 3.6,
              strokeStyle: colorPlane[4],
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.018,
              angle: 5.8,
              strokeStyle: colorPlane[4],
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.01,
              angle: 2.4,
              strokeStyle: colorPlane[4],
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.006,
              angle: 0,
              strokeStyle: colorPlane[4],
              lineWidth: W * 0.007,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.009,
              angle: 4.7,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.011,
              angle: 1.6,
              strokeStyle: colorPlane[4],
              lineWidth: W * 0.01,
            },
            {
              fillStyle: randomInArr(starColors),
              r: W * 0.004,
              angle: 0.4,
              strokeStyle: colorPlane[4],
              lineWidth: W * 0.006,
            },
          ],
        },
      ],
    }

    let move = () => {
      ctxRef.current.clearRect(0, 0, W, H)
      new Space(options, ctxRef.current)
      options.orbital.forEach((i) => {
        i.stars.forEach((j) => {
          j.angle += i.speed
          j.angle %= Math.PI * 2
        })
      })
      if (options.astronaut.x > W + options.astronaut.jet) {
        options.astronaut.x = -60
      }
      options.astronaut.x += 0.5
      animate && (timerRef.current = requestAnimationFrame(move))
    }
    move()
  }

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d')
      init()
      window.addEventListener('resize', init)
    }
    return () => {
      window.removeEventListener('resize', init)
    }
  }, [color])

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
