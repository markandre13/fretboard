import { GuitarChoordModel } from './model'
import { FretboardView } from './view'
import { OptionModel } from 'toad.js'
import { FormSelect } from 'toad.js/view/FormSelect'
import { Form } from 'toad.js/view/Form'

// note visualization
// colors
// wheel
// sine waves (for notes within a choord)

function main() {
    const o = new OptionModel(1, [
        [1, "C"],
        [2, "Cm"],
    ], { label: "Choord" } )

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

    // for (let i = 0; i < 6; ++i) {
    //     console.log(`${i}: ${choord.getNoteOfString(i)}`)
    // }

    // FIXME: <><FormCombobox model={...}></> renders as
    // [object HTMLElement],[object HTMLElement],[object HTMLElement]

    document.body.replaceChildren(...(
        <>
            <h1>Fretboard</h1>
            <FretboardView model={choord}></FretboardView>
            <br />
            <Form variant='narrow'>
                <FormSelect model={o} />
            </Form>
        </>
    ))
}

main()
