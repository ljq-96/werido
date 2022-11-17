import { $prose } from '@milkdown/utils'
import { Shiki } from './shiki'
import type { Highlighter } from 'shiki'

export const shikiPlugin = (options: Highlighter) => {
  return $prose(() => Shiki(options))
}
