import { theme } from 'antd'
import './style.less'

function Cat() {
  const {
    token: { colorBgContainer, colorBorderSecondary, borderRadiusLG },
  } = theme.useToken()
  return (
    <div className='cat'>
      <div
        className='container'
        style={{
          borderRadius: borderRadiusLG,
          background: colorBgContainer,
          border: `1px solid ${colorBorderSecondary}`,
        }}
      >
        <div className='artboard'>
          <div className='window'>
            <div className='window__outside outside'>
              <div className='outside__moon'></div>
              <div className='outside__clouds cloud'>
                <div className='cloud__one'></div>
                <div className='cloud__two'></div>
                <div className='cloud__three'></div>
                <div className='cloud__four'></div>
                <div className='cloud__five'></div>
              </div>
              <div className='outside__trees trees'>
                <div className='trees__one'></div>
                <div className='trees__two'></div>
                <div className='trees__three'></div>
                <div className='trees__four'></div>
                <div className='trees__five'></div>
              </div>
              <div className='outside__stars stars'>
                <div className='star stars__one'></div>
                <div className='star stars__two'></div>
                <div className='star stars__three'></div>
                <div className='star stars__four'></div>
                <div className='star stars__five'></div>
                <div className='star stars__six'></div>
                <div className='star stars__seven'></div>
                <div className='star stars__eight'></div>
                <div className='star stars__nine'></div>
                <div className='star stars__ten'></div>
                <div className='star stars__eleven'></div>
                <div className='star stars__twelve'></div>
                <div className='star star__thirteen'></div>
                <div className='star star__fourteen'></div>
                <div className='star star__fifteen'></div>
              </div>
            </div>
            <div className='window__glass window__glass-one'></div>
            <div className='window__glass window__glass-two'></div>
            <div className='cat'>
              <div className='cat__head'>
                <div className='cat__eyes'>
                  <div className='cat__eye cat__eye-left'></div>
                  <div className='cat__eye cat__eye-right'></div>
                </div>
                <div className='cat__ears'>
                  <div className='cat__ear cat__ear-left'></div>
                  <div className='cat__ear cat__ear-right'></div>
                </div>
              </div>
              <div className='cat__body'></div>
              <div className='cat__tail'>
                <div className='line-one'>
                  <div className='line-one'>
                    <div className='line-one'>
                      <div className='line-one'>
                        <div className='line-one'>
                          <div className='line-one'>
                            <div className='line-one'>
                              <div className='line-one'>
                                <div className='line-one'>
                                  <div className='line-one'>
                                    <div className='line-two'>
                                      <div className='line-two'>
                                        <div className='line-two'>
                                          <div className='line-two'>
                                            <div className='line-two'>
                                              <div className='line-two'>
                                                <div className='line-two'>
                                                  <div className='line-two'>
                                                    <div className='line-two'>
                                                      <div className='line-two'>
                                                        <div className='line-two'>
                                                          <div className='line-two'>
                                                            <div className='line-two'></div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='window__sill sill'>
              <div className='sill__one'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cat
