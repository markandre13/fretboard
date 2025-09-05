import { Model } from 'toad.js/model/Model'

export class GuitarChoordModel extends Model {
    tuning: Array<number>
    fret: Array<number>

    constructor(init?: Array<number>) {
        super()
        this.tuning = [64, 59, 55, 50, 45, 40]
        if (init === undefined) {
            this.fret = new Array<number>()
            this.fret.fill(-1, 0, 5)
        } else {
            this.fret = Array.from(init)
        }
    }

    toggleStringAtFret(stringNo: number, fretNo: number) {
        if (this.fret[stringNo] == fretNo)
            this.fret[stringNo] = -1
        else
            this.fret[stringNo] = fretNo
        this.signal.emit()
    }

    getNoteOfString(s: number) {
        if (this.fret[5 - s] < 0)
            return -1
        return this.tuning[5 - s] + this.fret[5 - s]
    }
}
