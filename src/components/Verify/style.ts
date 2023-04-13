import { css } from '@emotion/react'
import { theme } from 'antd'
import { CSSProperties, useMemo } from 'react'

export default function useStyle() {
  const { token } = theme.useToken()
  return useMemo(
    () =>
      css({
        position: 'relative',
        '.canvasArea': {
          borderRadius: token.borderRadius,
          overflow: 'hidden',
        },
        '.block': {
          position: 'absolute',
          left: 0,
          top: 0,
          cursor: 'grab',
        },

        '.block:active': {
          cursor: 'grabbing',
        },

        '.sliderContainer': {
          position: 'relative',
          textAlign: 'center',
          width: 310,
          height: 40,
          lineHeight: 40,
          marginTop: 15,
          background: token.colorBgLayout,
          color: '#45494c',
          border: `1px solid ${token.colorBorder}`,
          borderRadius: token.borderRadius,
          overflow: 'hidden',
        },

        '.sliderContainer_active .slider': {
          height: 38,
          color: '#fff !important',
          backgroundColor: `${token.colorInfo} !important`,
        },

        '.sliderContainer_active .sliderMask': {
          height: 38,
        },

        '.sliderContainer_success .slider': {
          height: 38,
          color: '#fff !important',
          backgroundColor: `${token.colorSuccess} !important`,
        },

        '.sliderContainer_success .sliderMask': {
          height: 38,
          backgroundColor: token.colorSuccessBg,
        },

        '.sliderContainer_success .sliderIcon': {
          backgroundPosition: '0 -26px !important',
        },

        '.sliderContainer_fail .slider': {
          height: 38,
          color: '#fff !important',
          backgroundColor: `${token.colorError} !important`,
          transition: '0.4s',
        },

        '.sliderContainer_fail .sliderMask': {
          height: 38,
          backgroundColor: token.colorErrorBg,
        },

        '.sliderContainer_fail .sliderIcon': {
          top: 14,
          backgroundPosition: '0 -82px !important',
        },

        '.sliderContainer_active .sliderText,.sliderContainer_success .sliderText,.sliderContainer_fail .sliderText': {
          display: 'none',
        },

        '.sliderMask': {
          position: 'absolute',
          left: 0,
          top: 0,
          height: 40,
          border: 'none',
          background: token.colorInfoBg,
        },

        '.slider': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: 38,
          height: 38,
          background: '#fff',
          boxShadow: token.boxShadowTertiary,
          transition: 'background 0.2s linear',
          cursor: 'grab',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },

        '.slider:active': {
          cursor: 'grabbing',
        },

        '.sliderIcon': {
          fontSize: 18,
          color: '#000',
        },

        '.refreshIcon': {
          position: 'absolute',
          right: 5,
          top: 5,
          color: '#fff !important',
        },

        '.loadingContainer': {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 310,
          height: 155,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 14,
          color: '#45494c',
          zIndex: 2,
          background: '#edf0f2',
        },
      }),
    [token],
  )
}
