import BinnedData2D from "./BinnedData2D";

//export a class for two dimensional data
type BinMap = number[][][];
export default class Data2D {
	data: number[][];
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
	xRange: number;
	yRange: number;
	constructor(data: number[][]) {
		this.data = data;
		let ranges = this.getRanges();
		this.xMin = ranges.xMin;
		this.xMax = ranges.xMax;
		this.yMin = ranges.yMin;
		this.yMax = ranges.yMax;
		this.xRange = this.xMax - this.xMin;
		this.yRange = this.yMax - this.yMin;
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
	binData(
		numBinsX: number,
		numBinsY: number,
		xRange: number,
		yRange: number,
		xMin: number,
		yMin: number
	) {
		let xBinSize = xRange / numBinsX;
		let yBinSize = yRange / numBinsY;
		let binnedData: number[][] = [];
		// initialize a 3d Matrix
		let binMap: BinMap = Array(numBinsX)
			.fill(0)
			.map(() =>
				Array(numBinsY)
					.fill(0)
					.map(() => [])
			);
		for (let i = 0; i < numBinsX; i++) {
			binnedData.push([]);
			for (let j = 0; j < numBinsY; j++) {
				binnedData[i].push(0);
			}
		}
		for (let i = 0; i < this.data.length; i++) {
			let x = this.data[i][0];
			let y = this.data[i][1];
			let xBin = Math.floor((x - xMin) / xBinSize);
			let yBin = Math.floor((y - yMin) / yBinSize);
			xBin = xBin > numBinsX - 1 ? numBinsX - 1 : xBin;
			yBin = yBin > numBinsY - 1 ? numBinsY - 1 : yBin;
			binnedData[xBin][yBin]++;
			let dataPointsInBin = binMap[xBin][yBin];
			dataPointsInBin.push(i);
		}
		return new BinnedData2D(binnedData, binMap);
	}

	denoiseData(threshold: number, numBins: number) {
		let binnedData = this.binData(
			numBins,
			numBins,
			this.xRange,
			this.yRange,
			this.xMin,
			this.yMin
		);
		let binMap = binnedData.binMap;
		let denoisedData: number[][] = [];
		for (let i = 0; i < numBins; i++) {
			for (let j = 0; j < numBins; j++) {
				if (binnedData.data[i][j] > threshold) {
					let indexes = binMap[i][j];
					let dataPoints = indexes.map((index: number) => {
						return this.data[index];
					});
					denoisedData = denoisedData.concat(dataPoints);
				}
			}
		}
		return denoisedData;
	}
}
