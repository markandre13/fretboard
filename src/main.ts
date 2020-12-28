export function main() {
  console.log("Hello World")

  const left = 40.5,
        top = 20.5,
        sx = 40.0,
        sy = 24.0,
        r = 5.0

  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.style.border = "1px solid #ddd"
  svg.setAttributeNS("", "width", `${left * 2 + sx * 22}`)
  svg.setAttributeNS("", "height", `${top * 2 + sy * 5}`)
  // svg.setAttributeNS("", "viewBox", "0 0 390 190")

  for(let i=0; i<6; ++i) {
    const y = top + i * sy
    svg.appendChild(line(left, y, left + 22 * sx, y))
  }

  for(let i=0; i<23; ++i) {
    const x = left + i * sx
    const l = line(x, top, x, top + 5 * sy)
    if ( i == 0 )
      l.setAttributeNS("", "stroke-width", "3")
    svg.appendChild(l)
    const cx = left + i * sx + sx / 2.0
    const cy = top + sy * 2.5;
    switch(i) {
      case 2:
      case 4:
      case 6:
      case 8: 
      case 14:
      case 16:
      case 18:
      case 20: {      
        svg.appendChild(circle(cx, cy, r))
      } break
      case 11: {
        svg.appendChild(circle(cx, cy-sy, r))
        svg.appendChild(circle(cx, cy+sy, r))
      }   
    }
  }

  document.body.appendChild(svg)
}

function line(x1: number, y1: number, x2: number, y2: number): SVGLineElement {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
  line.setAttributeNS("", "stroke", "#000")
  line.setAttributeNS("", "x1", `${x1}`)
  line.setAttributeNS("", "y1", `${y1}`)
  line.setAttributeNS("", "x2", `${x2}`)
  line.setAttributeNS("", "y2", `${y2}`)
  return line
}

function circle(cx: number, cy: number, r: number): SVGCircleElement {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
  circle.setAttributeNS("", "stroke", "#000")
  circle.setAttributeNS("", "cx", `${cx}`)
  circle.setAttributeNS("", "cy", `${cy}`)
  circle.setAttributeNS("", "r", `${r}`)
  return circle
}