export interface BallProps {
  x?: number
  y?: number
  r?: number
  fillStyle?: string
  strokeStyle?: string 
  lineWidth?: number
}

export class Ball implements BallProps {
  x?: number = 0
  y?: number = 0
  r?: number = 20
  fillStyle?: string = 'rgba(0, 0, 0, 0)'
  strokeStyle?: string = 'rgba(0, 0, 0, 0)'
  lineWidth?: number = 1
  constructor(props: BallProps, ctx: CanvasRenderingContext2D) {
    Object.assign(this, props)
    ctx.save()
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.lineWidth = this.lineWidth
    ctx.translate(this.x, this.y)
    // this.creatPath(ctx)
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}

export interface AstronautProps {
  x?: number
  y?: number
  jet?: number
  peopleStyle?: string
  jetStyle?: string
}

export class Astronaut {
  x: number = 0
  y: number = 0
  jet: number = 500
  peopleStyle: string = 'rgb(255,255,255)'
  jetStyle: string = 'rgb(0,0,0)'
  constructor(props, ctx: CanvasRenderingContext2D) {
    Object.assign(this, props)
    this.creatJet(ctx)
    this.creatBody(ctx)
  }
  private creatBody(ctx) {
    ctx.save()
    ctx.fillStyle = this.peopleStyle
    ctx.lineJoin = 'round'
    ctx.translate(this.x, this.y)
    ctx.beginPath()
    ctx.arc(-10, 0, 10, Math.PI * 0.5, Math.PI * 1.9)
    ctx.quadraticCurveTo(-19, -10, -8, 10)
    ctx.moveTo(-20, 3)
    ctx.quadraticCurveTo(-20, 8, -26, 10)
    ctx.lineTo(-42, 7)
    ctx.quadraticCurveTo(-47, 6, -50, 3)
    ctx.lineTo(-74, 0)
    ctx.lineTo(-80, 2)
    ctx.lineTo(-75, -5)
    ctx.lineTo(-20, -5)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  private creatJet(ctx) {
    ctx.save()
    ctx.fillStyle = this.jetStyle
    ctx.translate(this.x, this.y)
    ctx.beginPath()
    ctx.arc(-27, -4, 8, Math.PI * 1.5, Math.PI * 2)
    ctx.lineTo(-40, -4)
    ctx.lineTo(-44, -12)
    ctx.closePath()
    ctx.moveTo(-48, -5)
    ctx.lineTo(-this.jet, -8)
    ctx.lineTo(-51, -11)
    ctx.closePath()
    ctx.moveTo(-10, 0)
    ctx.arc(-10, 0, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}
