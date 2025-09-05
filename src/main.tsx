import { bindModel } from 'toad.js/controller/globalController'
import { GuitarChoordModel } from './model'
import { FretboardView } from './view'

function main() {
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

    const choord = new GuitarChoordModel(x["C"])
    bindModel("choord", choord)

    // for (let i = 0; i < 6; ++i) {
    //     console.log(`${i}: ${choord.getNoteOfString(i)}`)
    // }

    document.body.replaceChildren(...(
        <>
            <h1>Fretboard</h1>
            <FretboardView model={choord}></FretboardView>
        </>
    ))
}

main()
