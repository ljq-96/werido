import { useMemo } from 'react'
import { themeFactory, ThemeColor, ThemeSize, ThemeIcon, ThemeFont, ThemeGlobal } from '@milkdown/core'
import { generate } from '@ant-design/colors'
import { useUser } from '../../../../contexts/useUser'
import './fix.less'

function useTheme() {
  const [{ themeColor }] = useUser()

  const theme = useMemo(() => {
    const [c1, c2, c3, c4, c5, c6, c7] = generate(themeColor)
    console.log(c1, c2, c3, c4, c5, c6, c7)
    const iconMapping = {
      downArrow: 'icon-down',
      image: 'icon-image',
    }

    return themeFactory((emotion, manager) => {
      manager.set(ThemeColor, ([key, opacity]) => {
        switch (key) {
          case 'primary':
            return c6
          case 'secondary':
            return c4
          case 'solid':
            return '#f0f0f0'
          case 'neutral':
            return '#4a4a4a'
          case 'line':
            return '#e6e6e6'
          case 'shadow':
            return '#eee'
        }
      })
      manager.set(ThemeFont, (key) => {
        if (key === 'typography') return 'Roboto, arial, sans-serif'
        return 'Fira Code'
      })
      manager.set(ThemeIcon, (key) => {
        const icon = iconMapping[key]
        if (!icon) {
          return
        }
        const span = document.createElement('span')
        span.className = 'icon'
        span.innerHTML = `<svg width="1em" height="1em" fill="currentColor"><use xlink:href="#${icon}"></use></svg>`
        return {
          dom: span,
          label: '123',
        }
      })
      // manager.set(ThemeGlobal, () => {
      //   emotion.injectGlobal`
      //     * {
      //       margin: 0;
      //     }
      //     .paragraph.empty-node::before {
      //       color: #aaa;
      //     }
      //     h1,h2 {
      //       margin: 25px 0;
      //       padding: 15px 0;
      //       border-bottom: 2px solid #eee;
      //     }
      //   `
      // })
    })
  }, [themeColor])
  return theme
}

export default useTheme
