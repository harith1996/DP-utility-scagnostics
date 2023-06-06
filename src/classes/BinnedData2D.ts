import Data2D from "./Data2D";
export default class BinnedData2D {
	data: number[][];
    numberOfBins: number;
	constructor(data: number[][]) {
		this.data = data;
        this.numberOfBins = data.length;
	}

    /**
     * 
     * @param xRange 
     * @param yRange 
     * @returns 
     */
	getUnbinnedData(xRange: number, yRange: number) {
		let n = this.numberOfBins;
		let unbinnedData = [];
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				let numberOfPoints = this.data[i][j];
				let x1 = (i * xRange) / n;
				let y1 = (j * yRange) / n;
				let x2 = ((i + 1) * xRange) / n;
				let y2 = ((j + 1) * yRange) / n;
				for (let k = 0; k < numberOfPoints; k++) {
					let x = Math.random() * (x2 - x1) + x1;
					let y = Math.random() * (y2 - y1) + y1;
					unbinnedData.push([x, y]);
				}
			}
		}
        return new Data2D(unbinnedData);
	}

	getNumberOfBins() {
		return this.data.length;
	}

	transposeData() {
		let newData : number[][] = [];
		for (let i = 0; i < this.data.length; i++) {
			newData.push([]);
			for (let j = 0; j < this.data.length; j++) {
				newData[i].push(this.data[j][i]);
			}
		}
		this.data = newData;
	}
}
