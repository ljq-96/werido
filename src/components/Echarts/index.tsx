import { Spin } from 'antd'
import * as echarts from 'echarts'
import * as React from 'react'
import elementResizeEvent, { unbind } from '../../utils/element-resize-event'
import 'echarts-wordcloud'

export interface ReactEchartsProps {
  onChartReady?: (echartObj: echarts.ECharts) => void
  style?: React.CSSProperties
  className?: string
  loading?: boolean
  onEvents?: { [k: string]: Function }
  notMerge?: boolean
  lazyUpdate?: boolean
  option: echarts.EChartsOption
}
export default class ReactEcharts extends React.Component<ReactEchartsProps> {
  // first add
  componentDidMount() {
    const props = this.props
    let echartObj = this.renderEchartDom()
    let onEvents = Object.assign({}, props.onEvents)
    Object.keys(props).map(key => {
      let mat = key.match(/^on([A-Z]\w+)$/)
      if (mat) {
        onEvents[mat[1].toLowerCase()] = props[key]
      }
    })

    this.bindEvents(echartObj, onEvents)
    // on chart ready
    if (typeof this.props.onChartReady === 'function') this.props.onChartReady(echartObj)
  }
  // update
  componentDidUpdate() {
    this.renderEchartDom()
    this.bindEvents(this.getEchartsInstance(), this.props.onEvents || {})
  }
  // remove
  componentWillUnmount() {
    echarts.dispose(this.echartsDom)
  }
  echartsDom: HTMLDivElement
  initEchartsDom = (echartsDom: HTMLDivElement) => {
    this.echartsDom = echartsDom
  }

  // bind the events
  bindEvents = (instance: echarts.ECharts, events: { [k: string]: Function }) => {
    var _loop = function _loop(eventName) {
      instance.off(eventName)
      instance.on(eventName, function (param) {
        events[eventName](param, instance)
      })
    }

    for (var eventName in events) {
      _loop(eventName)
    }
  }
  // render the dom
  renderEchartDom = () => {
    // init the echart object
    let echartObj = this.getEchartsInstance()
    // set the echart option
    echartObj.setOption(this.props.option as any, this.props.notMerge || false, this.props.lazyUpdate || false)
    // set loading mask
    // if (this.props.loading) echartObj.showLoading()
    // else echartObj.hideLoading()

    return echartObj
  }
  getEchartsInstance = () => {
    const { echartsDom } = this
    const instance = echarts.getInstanceByDom(echartsDom)
    if (!instance) {
      let echartObj = echarts.init(echartsDom, undefined, { renderer: 'svg' })
      unbind(echartsDom.parentElement, '')
      elementResizeEvent(echartsDom.parentElement, function () {
        echartObj.resize()
      })
      return echartObj
    } else {
      instance.resize()
      return instance
    }
  }
  render() {
    let {
      loading = false,
      style = {
        height: 300,
      },
    } = this.props
    // for render
    return (
      <Spin spinning={loading}>
        <div ref={this.initEchartsDom} className={this.props.className} style={style} />
      </Spin>
    )
  }
}
