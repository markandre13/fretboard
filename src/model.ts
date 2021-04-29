import { Model } from 'toad.js'

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

    getNoteOfString(s: number) {
        if (this.fret[5 - s] < 0)
            return -1
        return this.tuning[5 - s] + this.fret[5 - s]
    }
}
