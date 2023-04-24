/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Tag, theme } from 'antd'
import { useState } from 'react'

const MAX_ROW = 10
const MAX_COL = 10
const DEFAULT_ROW = 3
const DEFAULTCOL = 3

export default function TableSizeSelector({ onChange }: { onChange?: (row: number, col: number) => void }) {
  const [row, setRow] = useState(DEFAULT_ROW + 1)
  const [col, setCol] = useState(DEFAULTCOL + 1)
  const [currentRow, setCurrentRow] = useState(DEFAULT_ROW)
  const [currentCol, setCurrentCol] = useState(DEFAULTCOL)

  const {
    token: { colorBorder, colorBgElevated, boxShadow, borderRadius, colorPrimary },
  } = theme.useToken()

  return (
    <div>
      <div>表格</div>
      {Array.from({ length: row })
        .map((_, i) => i + 1)
        .map(i => (
          <div key={`row-${i}`} css={css({ display: 'flex', margin: '4px 0' })}>
            {Array.from({ length: col })
              .map((_, j) => j + 1)
              .map(j => (
                <div
                  key={`col-${j}`}
                  css={[
                    css({
                      width: 20,
                      height: 20,
                      border: `1px solid ${colorBorder}`,
                      borderRadius: 2,
                      margin: '0 2px',
                      transition: 'all 0.4s',
                    }),
                    i <= currentRow && j <= currentCol && css({ background: colorBorder }),
                    i === currentRow &&
                      j === currentCol &&
                      css({ background: colorPrimary, borderColor: colorPrimary }),
                  ]}
                  onClick={() => onChange?.(i, j)}
                  onMouseEnter={() => {
                    setCurrentRow(i)
                    setCurrentCol(j)
                    setRow(Math.min(i + 1, MAX_ROW))
                    setCol(Math.min(j + 1, MAX_COL))
                  }}
                />
              ))}
          </div>
        ))}
      <Tag bordered={false} css={css({ marginBottom: 4 })}>
        {currentRow} x {currentCol}
      </Tag>
    </div>
  )
}
