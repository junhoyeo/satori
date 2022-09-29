import { buildXMLString } from '../utils'
import radius from './border-radius'

function compareBorderDirections(a: string, b: string, style: any) {
  return (
    style[a + 'Width'] === style[b + 'Width'] &&
    style[a + 'Style'] === style[b + 'Style'] &&
    style[a + 'Color'] === style[b + 'Color']
  )
}

export default function border(
  {
    left,
    top,
    width,
    height,
    props,
  }: {
    id: string
    left: number
    top: number
    width: number
    height: number
    props: any
  },
  style: Record<string, number | string>
) {
  const directions = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft']

  // No border
  if (!directions.some((direction) => style[direction + 'Width'])) return ''

  let fullBorder = ''

  let start = 0
  while (
    start > 0 &&
    compareBorderDirections(
      directions[start],
      directions[(start + 3) % 4],
      style
    )
  ) {
    start = (start + 3) % 4
  }

  let partialSides = [false, false, false, false]
  let currentStyle = []
  for (let _i = 0; _i < 4; _i++) {
    const i = (start + _i) % 4
    const ni = (start + _i + 1) % 4

    const d = directions[i]
    const nd = directions[ni]

    partialSides[i] = true
    currentStyle = [style[d + 'Width'], style[d + 'Style'], style[d + 'Color']]

    if (!compareBorderDirections(d, nd, style)) {
      if (currentStyle[0]) {
        const w = currentStyle[0]
        fullBorder += buildXMLString('path', {
          width,
          height,
          ...props,
          fill: 'none',
          stroke: currentStyle[2],
          'stroke-width': w * 2,
          'stroke-dasharray':
            currentStyle[1] === 'dashed' ? w * 2 + ' ' + w : undefined,
          d: radius(
            { left, top, width, height },
            style as Record<string, number>,
            partialSides
          ),
        })
      }
      partialSides = [false, false, false, false]
    }
  }

  if (partialSides.some(Boolean) && currentStyle[0]) {
    const w = currentStyle[0]
    fullBorder += buildXMLString('path', {
      width,
      height,
      ...props,
      fill: 'none',
      stroke: currentStyle[2],
      'stroke-width': w * 2,
      'stroke-dasharray':
        currentStyle[1] === 'dashed' ? w * 2 + ' ' + w : undefined,
      d: radius(
        { left, top, width, height },
        style as Record<string, number>,
        partialSides
      ),
    })
  }

  return fullBorder
}