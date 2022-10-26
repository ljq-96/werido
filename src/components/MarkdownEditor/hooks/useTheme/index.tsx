import { useMemo } from 'react'
import {
  themeFactory,
  ThemeColor,
  ThemeSize,
  ThemeIcon,
  ThemeShadow,
  ThemeBorder,
  ThemeGlobal,
  ThemeScrollbar,
  ThemeFont,
} from '@milkdown/core'
import { generate } from '@ant-design/colors'
import { useUser } from '../../../../contexts/useUser'
import { useAllPresetRenderer } from '@milkdown/theme-pack-helper'
import { getStyle } from './style'
// import './fix.less'

const size = {
  radius: '4px',
  lineWidth: '1px',
}

function useTheme() {
  const [{ themeColor }] = useUser()

  const theme = useMemo(() => {
    const [c1, c2, c3, c4, c5, c6, c7] = generate(themeColor)
    const iconMapping = {
      h1: {
        label: '一级标题',
        icon: 'icon-h-1',
      },
      h2: {
        label: '二级标题',
        icon: 'icon-h-2',
      },
      h3: {
        label: '三级标题',
        icon: 'icon-h-3',
      },
      loading: {
        label: 'loading',
        icon: 'icon-image',
      },
      quote: {
        label: 'quote',
        icon: 'icon-quote',
      },
      code: {
        label: '代码块',
        icon: 'icon-code',
      },
      table: {
        label: '表格',
        icon: 'icon-image',
      },
      divider: {
        label: '分隔线',
        icon: 'icon-image',
      },
      image: {
        label: '图片',
        icon: 'icon-image',
      },
      brokenImage: {
        label: 'broken image',
        icon: 'icon-image',
      },
      bulletList: {
        label: '无序列表',
        icon: 'icon-unorderedlist',
      },
      orderedList: {
        label: '有序列表',
        icon: 'icon-orderedlist',
      },
      taskList: {
        label: '任务列表',
        icon: 'icon-checklist',
      },
      bold: {
        label: '加粗',
        icon: 'icon-bold',
      },
      italic: {
        label: '倾斜',
        icon: 'icon-italic',
      },
      inlineCode: {
        label: '行内代码',
        icon: 'icon-inlinecode',
      },
      strikeThrough: {
        label: '删除线',
        icon: 'icon-strikethrough',
      },
      link: {
        label: '链接',
        icon: 'icon-link',
      },
      leftArrow: {
        label: 'left arrow',
        icon: 'icon-left',
      },
      rightArrow: {
        label: 'right arrow',
        icon: 'icon-right',
      },
      upArrow: {
        label: 'up arrow',
        icon: 'icon-up',
      },
      downArrow: {
        label: 'down arrow',
        icon: 'icon-down',
      },
      alignLeft: {
        label: 'align left',
        icon: 'icon-align-left',
      },
      alignRight: {
        label: 'align right',
        icon: 'icon-align-right',
      },
      alignCenter: {
        label: 'align center',
        icon: 'icon-align-center',
      },
      delete: {
        label: 'delete',
        icon: 'icon-delete',
      },
      select: {
        label: 'select',
        icon: 'icon-selectall',
      },
      unchecked: {
        label: 'unchecked',
        icon: 'icon-image',
      },
      checked: {
        label: 'checked',
        icon: 'icon-image',
      },
      undo: {
        label: '撤回',
        icon: 'icon-image',
      },
      redo: {
        label: 'redo',
        icon: 'icon-image',
      },
      liftList: {
        label: 'lift list',
        icon: 'icon-image',
      },
      sinkList: {
        label: 'sink list',
        icon: 'icon-image',
      },
      dragHandle: {
        label: 'drag handle',
        icon: 'icon-holder',
      },
      text: {
        label: '正文',
        icon: 'icon-paragraph',
      },
    }

    return themeFactory((emotion, manager) => {
      const { css } = emotion
      manager.set(ThemeColor, ([key, opacity]) => {
        switch (key) {
          case 'primary':
            return c6
          case 'secondary':
            return c1
          case 'solid':
            return '#f0f0f0'
          case 'neutral':
            return '#4a4a4a'
          case 'line':
            return '#f0f0f0'
          case 'shadow':
            return '#eee'
          case 'background':
            return '#f5f5f5'
        }
      })

      manager.set(ThemeSize, key => {
        if (!key) return
        return size[key]
      })

      manager.set(ThemeScrollbar, ([direction = 'y', type = 'normal'] = ['y', 'normal'] as never) => {
        const main = manager.get(ThemeColor, ['secondary', 0.38])
        const bg = manager.get(ThemeColor, ['secondary', 0.12])
        const hover = manager.get(ThemeColor, ['secondary'])
        return css`
          scrollbar-width: thin;
          scrollbar-color: ${main} ${bg};
          -webkit-overflow-scrolling: touch;

          &::-webkit-scrollbar {
            ${direction === 'y' ? 'width' : 'height'}: ${type === 'thin' ? 2 : 12}px;
            background-color: transparent;
          }

          &::-webkit-scrollbar-track {
            border-radius: 999px;
            background: transparent;
            border: 4px solid transparent;
          }

          &::-webkit-scrollbar-thumb {
            border-radius: 999px;
            background-color: ${main};
            border: ${type === 'thin' ? 0 : 4}px solid transparent;
            background-clip: content-box;
          }

          &::-webkit-scrollbar-thumb:hover {
            background-color: ${hover};
          }
        `
      })

      manager.set(ThemeShadow, () => {
        const lineWidth = manager.get(ThemeSize, 'lineWidth')
        const getShadow = (opacity: number) => manager.get(ThemeColor, ['shadow', opacity])
        return css`
          box-shadow: 0 ${lineWidth} ${lineWidth} ${getShadow(0.14)}, 0 2px ${lineWidth} ${getShadow(0.12)},
            0 ${lineWidth} 3px ${getShadow(0.2)};
        `
      })

      manager.set(ThemeBorder, direction => {
        const lineWidth = manager.get(ThemeSize, 'lineWidth')
        const line = manager.get(ThemeColor, ['line'])
        if (!direction) {
          return css`
            border: ${lineWidth} solid ${line};
          `
        }
        return css`
          ${`border-${direction}`}: ${lineWidth} solid ${line};
        `
      })

      manager.set(ThemeIcon, key => {
        const icon = iconMapping[key]
        if (!icon) {
          return
        }
        const span = document.createElement('span')
        span.className = 'icon'
        span.innerHTML = `<svg width="1em" height="1em" fill="currentColor"><use xlink:href="#${icon.icon}"></use></svg>`
        return {
          dom: span,
          label: icon.label,
        }
      })

      manager.set(ThemeGlobal, () => {
        getStyle(manager, emotion)
      })

      manager.set(ThemeFont, key => {
        if (key === 'typography') return 'Roboto, arial, sans-serif'
        return 'code'
      })

      useAllPresetRenderer(manager, emotion)
    })
  }, [themeColor])
  return theme
}

export default useTheme
