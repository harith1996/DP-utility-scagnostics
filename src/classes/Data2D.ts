//export a class for two dimensional data
export default class Data2D {
    data: number[][];
    constructor(data: number[][]) {
        this.data = data;
        console.log("Data2D");
    }

    getData() {
        return this.data;
    }
    
    //extract maximum and minimum values from data
    getRanges() {
        let xMin = Infinity;
        let xMax = -Infinity;
        let yMin = Infinity;
        let yMax = -Infinity;
        for (let i = 0; i < this.data.length; i++) {
            let x = this.data[i][0];
            let y = this.data[i][1];
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

    //bin data into a 2D array
    binData(numBinsX: number, numBinsY: number) {
        let xRange = this.getRanges().xMax - this.getRanges().xMin;
        let yRange = this.getRanges().yMax - this.getRanges().yMin;
        let xBinSize = xRange / numBinsX;
        let yBinSize = yRange / numBinsY;
        let binnedData : number[][]= [];
        for (let i = 0; i < numBinsX; i++) {
            binnedData.push([]);
            for (let j = 0; j < numBinsY; j++) {
                binnedData[i].push(0);
            }
        }
        for (let i = 0; i < this.data.length; i++) {
            let x = this.data[i][0];
            let y = this.data[i][1];
            let xBin = Math.floor((x - this.getRanges().xMin) / xBinSize);
            let yBin = Math.floor((y - this.getRanges().yMin) / yBinSize);
            xBin = xBin > numBinsX - 1 ? numBinsX - 1 : xBin;
            yBin = yBin > numBinsY - 1 ? numBinsY - 1 : yBin;
            binnedData[xBin][yBin]++;
        }
        return binnedData;
    }
}