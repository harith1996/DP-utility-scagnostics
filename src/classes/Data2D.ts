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
		numBinsX: number | string,
		numBinsY: number | string,
		xRange: number,
		yRange: number,
		xMin: number,
		yMin: number
	) {
		let nBinsX = parseInt(numBinsX as string);
		let nBinsY = parseInt(numBinsY as string);
		let xBinSize = xRange / nBinsX;
		let yBinSize = yRange / nBinsY;
		let binnedData: number[][] = [];
		// initialize a 3d Matrix
		let binMap: BinMap = Array(nBinsX)
			.fill(0)
			.map(() =>
				Array(nBinsY)
					.fill(0)
					.map(() => [])
			);
		for (let i = 0; i < nBinsX; i++) {
			binnedData.push([]);
			for (let j = 0; j < nBinsY; j++) {
				binnedData[i].push(0);
			}
		}
		for (let i = 0; i < this.data.length; i++) {
			let x = this.data[i][0];
			let y = this.data[i][1];
			let xBin = Math.floor((x - xMin) / xBinSize);
			let yBin = Math.floor((y - yMin) / yBinSize);
			xBin = xBin > nBinsX - 1 ? nBinsX - 1 : xBin;
			yBin = yBin > nBinsY - 1 ? nBinsY - 1 : yBin;
			if (xBin > -1 && yBin > -1 && xBin < nBinsX && yBin < nBinsY) {
				binnedData[xBin][yBin]++;
				let dataPointsInBin = binMap[xBin][yBin];
				dataPointsInBin.push(i);
			}
		}
		return new BinnedData2D(binnedData, binMap);
	}

	denoisedData(threshold: number, numBins: number) {
		let denoisedData: number[][] = [];
		if (threshold === 0) {
			denoisedData = this.data;
		} else {
			let binnedData = this.binData(
				numBins,
				numBins,
				this.xRange,
				this.yRange,
				this.xMin,
				this.yMin
			);
			let binMap = binnedData.binMap;
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
		}

		return denoisedData;
	}
}
