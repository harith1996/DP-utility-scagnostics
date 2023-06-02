//export a class for two dimensional data
export default class Data2D {
    data: { x: number; y: number; }[];
    constructor(data: Array<{ x: number; y: number}>) {
        this.data = data;
        console.log("Data2D");
    }
    
    //extract maximum and minimum values from data
    getRanges() {
        let xMin = Infinity;
        let xMax = -Infinity;
        let yMin = Infinity;
        let yMax = -Infinity;
        for (let i = 0; i < this.data.length; i++) {
            let x = this.data[i].x;
            let y = this.data[i].y;
            if (x < xMin) {
                xMin = x;
            }
            if (x > xMax) {
                xMax = x;
            }
            if (y < yMin) {
                yMin = y;
            }
            if (y > yMax) {
                yMax = y;
            }
        }
        return {
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax,
        };
    }
}