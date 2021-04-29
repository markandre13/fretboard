import { GenericView, Model, TableModel, bind } from 'toad.js'

class GuitarChoordModel extends Model {
  tuning: Array<number>
  fret: Array<number>

  constructor(init?: Array<number>) {
    super()
    this.tuning = [ 64, 59, 55, 50, 45, 40 ]
    if (init === undefined) {
      this.fret = new Array<number>()
      this.fret.fill(-1, 0, 5)
    } else {
      this.fret = Array.from(init)
    }
  }

  getNoteOfString(s: number) {
    if (this.fret[5-s] < 0)
      return -1
    return this.tuning[5-s] + this.fret[5-s]
  }
}

class FretboardView extends GenericView<GuitarChoordModel> {

  noteIndex!: number
  markedIndices: number[]

  constructor() {
    super()
    this.markedIndices = []
    this.attachShadow({mode: 'open'})
    this.shadowRoot!.appendChild(document.importNode(this.getStyle(), true))
    this.shadowRoot!.appendChild(this.create())
  }
  
  updateModel() {
    if (!this.model) // FIXME: handle this in the caller?
      return
  }

  updateView() {
    if (!this.model) // FIXME: handle this in the caller?
      return

    const svg = this.shadowRoot?.childNodes[1]! as HTMLElement

    for(const x of this.markedIndices)
      svg.children[x].classList.remove("play")
    this.markedIndices = []

    for(let i=0; i<6; ++i) {
      const j = this.model.fret[i]
      if (j>=0) {
        const idx = this.noteIndex + (i * 23 + j) * 2
        this.markedIndices.push(idx)
        svg.children[idx].classList.add("play")    
      }
    }
  }

  getStyle(): HTMLStyleElement {
    const style = document.createElement("style")
    style.textContent = `
      svg {
        background: none;
        font-family: sans-serif;
        font-size: 10px;
      }

      .note {
        fill: #fff;
      }

      .note.play {
        fill: #000;
      }

      .note.play + text {
        fill: #fff;
      }
    `
    return style
  }

  create(): Element {
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
      svg.appendChild(this.line(left, y, left + 22 * sx, y))
    }
  
    for(let i=0; i<23; ++i) {
      const x = left + i * sx
      const l = this.line(x, top, x, top + 5 * sy)
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
          svg.appendChild(this.circle(cx, cy, r))
        } break
        case 11: {
          svg.appendChild(this.circle(cx, cy-sy, r))
          svg.appendChild(this.circle(cx, cy+sy, r))
        }   
      }
    }
  
    this.noteIndex = svg.childElementCount

    for(let i=0; i<6; ++i) {
      for(let j=0; j<23; ++j) {
        const x = left + (j-1) * sx + sx/2.0
        const y = top + i * sy
  
        const nr = 9
        const c = this.circle(x, y, nr)
        c.classList.add("note")
  
        c.onmousedown = (e: MouseEvent) => {
          // TODO: move into model
          if (this.model !== undefined) {
            if (this.model.fret[i] == j)
              this.model.fret[i] = -1
            else
              this.model.fret[i] = j
            this.model.modified.trigger()
          }
          // console.log(`mouse down on string ${i}, fret ${j}`)
        }
  
        svg.appendChild(c)
  
        const name = this.noteName(this.guitarTuning[i]+j)
  
        let dx = 0
        switch(name.length) {
          case 1: dx = 3.5; break
          case 2: dx = 6; break
          case 3: dx = 8.5; break
        }
  
        const t = this.text(x - dx, y + 3.5, name)
        svg.appendChild(t)
      }
    }
  
    // document.body.appendChild(svg)
    return svg
  }
  
  line(x1: number, y1: number, x2: number, y2: number): SVGLineElement {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "line")
    node.setAttributeNS("", "stroke", "#000")
    node.setAttributeNS("", "x1", `${x1}`)
    node.setAttributeNS("", "y1", `${y1}`)
    node.setAttributeNS("", "x2", `${x2}`)
    node.setAttributeNS("", "y2", `${y2}`)
    return node
  }
  
  circle(cx: number, cy: number, r: number): SVGCircleElement {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    node.setAttributeNS("", "stroke", "#000")
    node.setAttributeNS("", "cx", `${cx}`)
    node.setAttributeNS("", "cy", `${cy}`)
    node.setAttributeNS("", "r", `${r}`)
    return node
  }
  
  text(x: number, y: number, text: string): SVGTextElement {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "text")
    node.setAttributeNS("", "fill", "#000")
    node.setAttributeNS("", "x", `${x}`)
    node.setAttributeNS("", "y", `${y}`)
    node.appendChild(document.createTextNode(text))
    // node.style.fontFamily = "sans-serif"
    // node.style.fontSize = "10px"
    node.style.pointerEvents = "none"
    return node
  }
  
  // guitar tuning as string number to midi note number
  guitarTuning = [ 64, 59, 55, 50, 45, 40 ]
  
  noteName(note: number): string
  {
    // Middle C: C4 (Yamaha numbers it as octave 3: C3), MIDI 60
    // ♯ uses more space than #
    const name = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]
    const octave = Math.round(note/12)
    if (octave==4)
      return name[note%12]
    return `${name[note%12]}${octave-2}`
  }
}

window.customElements.define("m13-fretboard", FretboardView)

const x = {
  "C": [0, 1, 0, 2, 3, -1],
  "Cm": [3, 4, 5, 5, 3, -1],
  "C5": [-1, -1, 5, 5, 3, -1],
  "C7": [0, 1, 3, 2, 3, -1],
  "Cm7": [3, 4, 3, 5, 3, -1],

  "C#": [-1, 6, 6, 6, 4, -1],
  "C#m": [-1, 5, 6, 6, 4, -1],
  "C#5": [-1, -1, 6, 6, 4, -1]
}

export function main() {
  const choord = new GuitarChoordModel(x["C"])
  bind("choord", choord)

  for(let i=0; i<6; ++i) {
    console.log(`${i}: ${choord.getNoteOfString(i)}`)
  }
}


