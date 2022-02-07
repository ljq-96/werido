import { useState, useEffect, createContext, useRef, useContext } from 'react'
import './index.css'

interface IProps {
  tagName?: 'div' | 'ul' | 'ol' | 'tr'
  children?: JSX.Element | JSX.Element[] | string
  light?: {
    size: [number, number, number]
    color: [string, string]
  }
}

const defultStyle = {
  size: [50, 100, 10],
  color: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 1)']
}

const Position = createContext({
  x: -1,
  y: -1,
  width: 0,
  height: 0,
  light: defultStyle
})

const FluentDesign = (props: IProps) => {
  const { tagName: Tag = 'div', light, children } = props
  const [x, setX] = useState(-1)
  const [y, setY] = useState(-1)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const wrapper = useRef<HTMLElement>(null)

  useEffect(() => {
    setWidth(wrapper.current?.offsetWidth || 0)
    setHeight(wrapper.current?.offsetHeight || 0)
  }, [])

  return (
    <Position.Provider value={{x, y, width, height, light : light || defultStyle}}>
      <Tag
        className='fd'
        ref={wrapper as any}
        onMouseLeave={() => {
          setX(-1000)
          setY(-1000)
        }}
        onMouseMove={e => {
          const { clientX, clientY } = e
          const { left, top } = (e.currentTarget as HTMLElement).getBoundingClientRect()
          setX(clientX - left)
          setY(clientY - top)
        }}
      >
        {children}
      </Tag>
    </Position.Provider>
  )
}

FluentDesign.Item = (props: IProps) => {
  const { tagName: Tag = 'div', children, light: pLight } = props
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [left, setLeft] = useState<number>(0)
  const [top, setTop] = useState<number>(0)
  const itemRef = useRef<HTMLElement>(null)
  const {x, y, light: cLight} = useContext(Position)
  const light = { ...cLight, ...pLight }

  useEffect(() => {
    setWidth(itemRef.current?.offsetWidth || 0)
    setHeight(itemRef.current?.offsetHeight || 0)
    setLeft(itemRef.current?.offsetLeft || 0)
    setTop(itemRef.current?.offsetTop || 0)
  }, [])

  return (
    <Tag
      ref={itemRef as any}
      className='fd_item'
    >
        {children}
        <div
          className='fd_item_light'
          style={{
            border: `${light.size[2] + 1}px solid transparent`,
            borderImage: `radial-gradient(circle ${light.size[1]}px at ${x - left}px ${y - top}px, ${light.color[1]}, transparent) ${light.size[2]}`,
            backgroundImage: x > left && x < left + width && y > top && y < top + height ? 
                `radial-gradient(circle ${light.size[0]}px at ${x - left}px ${y - top}px, ${light.color[0]}, transparent)`: ''
          }}
        />
    </Tag>
  )
}

export default FluentDesign
