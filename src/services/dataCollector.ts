import * as dataService from "./dataService";
import BinnedData2D from "../classes/BinnedData2D";
import Data2D from "../classes/Data2D";
import Scagnostics from "../lib/scagnostics.js";
import { unparse } from "papaparse";
const SCORES = [
	"clumpyScore",
	"convexScore",
	"outlyingScore",
	"outlyingUpperBound",
	"skinnyScore",
	"sparseScore",
	"striatedScore",
	"monotonicScore",
	"stringyScore",
	"skewedScore"
];

const extractDataValues = (data: any) => {
	return data.map((d: any) =>
		Object.values(d).map((v: any) => parseFloat(v))
	);
};

export default function collectData() {
	let data = [] as any[];
	//get filter params
	return dataService.getFilterParams().then((params) => {
		params.datasetNames.forEach((datasetName: string) => {
			//get original dataset
			dataService
				.getDataset("original", datasetName + ".csv")
				.then((original) => {
					//construct Data2D object from original data
					let originalData = new Data2D(
						extractDataValues(original).slice(0, -1)
					);
					//compute scagnostics
					let ogScag = new Scagnostics(originalData.data) as any;
					//get private dataset
					params.algorithms.forEach((algorithm: string) => {
						params.epsilons.forEach((epsilon: number) => {
							params.numBins.forEach((numBins: number) => {
								let filename = `${datasetName}_${algorithm}_${epsilon}_${numBins}.csv`;
								//get private dataset
								dataService
									.getDataset("private", filename)
									.then((privateData) => {
										//make a BinnedData2D object from the private data
										let privateBinnedData =
											new BinnedData2D(
												extractDataValues(privateData)
											);

										privateBinnedData.transposeData();
										//unbin the data
										let privateUnbinnedData =
											privateBinnedData.getUnbinnedData(
												originalData.xRange,
												originalData.yRange,
												originalData.xMin,
												originalData.yMin
											);

										//compute scagnostics
										let privScag = new Scagnostics(
											privateUnbinnedData.data
										) as any;

										//push data to array
										const row: { [index: string]: any } =
											{};
										Object.assign(row, {
											dataset: datasetName,
											algorithm: algorithm,
											epsilon: epsilon,
											numBins: numBins,
										});
										SCORES.forEach((score: string) => {
											row[score + "_og"] = ogScag[score];
											row[score + "_priv"] =
												privScag[score];
										});
										data.push(row);
									});
							});
						});
					});
				});
		});

		console.log(data);
		return data;
	});
}
