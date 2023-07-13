import Data2D from "./Data2D";

type BinMap = number[][][];
export default class BinnedData2D {
	data: number[][];
	numberOfBins: number;
	binMap: BinMap;
	constructor(data: number[][], binMap: BinMap | undefined) {
		this.data = data;
		this.numberOfBins = data.length;
		this.binMap = binMap || [];
	}

	/**
	 *
	 * @param xRange
	 * @param yRange
	 * @returns
	 */
	getUnbinnedData(
		xRange: number,
		yRange: number,
		xMin: number,
		yMin: number,
		unbinThreshold: number = 4,
		unbinLimit: number = 20
	) {
		let n = this.numberOfBins;
		let unbinnedData = [];
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				let numberOfPoints = this.data[i][j];
				let x1 = (i * xRange) / n;
				let y1 = (j * yRange) / n;
				let x2 = ((i + 1) * xRange) / n;
				let y2 = ((j + 1) * yRange) / n;
				if (numberOfPoints > unbinThreshold) {
					for (let k = 0; k < Math.min(numberOfPoints, unbinLimit); k++) {
						let x = xMin + Math.random() * (x2 - x1) + x1;
						let y = yMin + Math.random() * (y2 - y1) + y1;
						// let x = Math.random() * (x2 - x1) + x1;
						// let y = Math.random() * (y2 - y1) + y1;
						unbinnedData.push([x, y]);
					}
				}
			}
		}
		return new Data2D(unbinnedData);
	}

	getNumberOfBins() {
		return this.data.length;
	}

	transposeData() {
		let newData: number[][] = [];
		for (let i = 0; i < this.data.length; i++) {
			newData.push([]);
			for (let j = 0; j < this.data.length; j++) {
				newData[i].push(this.data[j][i]);
			}
		}
		this.data = newData;
	}
}
