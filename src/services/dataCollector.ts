import * as dataService from "./dataService";
import BinnedData2D from "../classes/BinnedData2D";
import Data2D from "../classes/Data2D";
import Scagnostics from "../lib/scagnostics.js";
import { unparse } from "papaparse";
import pointInPolygon from "../utilities/pointInPolygon";
const SCORES = [
	"clumpyScore",
	// "convexScore", //too sensitive to outliers
	"outlyingScore",
	"skinnyScore",
	"sparseScore",
	// "striatedScore", //too sensitive to outliers
	"monotonicScore",
	"stringyScore",
	"skewedScore",
];

const UNBIN = [0, 1, 2];

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
					UNBIN.forEach((unbin: number) => {
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
													extractDataValues(
														privateData
													), undefined
												);

											privateBinnedData.transposeData();
											//unbin the data
											let privateUnbinnedData =
												privateBinnedData.getUnbinnedData(
													originalData.xRange,
													originalData.yRange,
													originalData.xMin,
													originalData.yMin,
													unbin
												);

											//compute scagnostics
											let scagWhole = new Scagnostics(
												privateUnbinnedData.data
											) as any;

											const convHull =
												ogScag["convexHull"];
											//filter points outside of convex hull
											const normalizedPoints =
												scagWhole.normalizedPoints;
											const filteredData =
												normalizedPoints.filter(
													(d: number[]) => {
														return pointInPolygon(
															convHull,
															d
														);
													}
												);
											const scagConvHull =
												new Scagnostics(
													filteredData
												) as any;
											//push data to array
											const row: {
												[index: string]: any;
											} = {};
											Object.assign(row, {
												dataset: datasetName,
												algorithm: algorithm,
												epsilon: epsilon,
												numBins: numBins,
											});
											SCORES.forEach((score: string) => {
												row[score + "_og"] =
													ogScag[score];
												row[score + "_priv"] =
													scagWhole[score];
												row[score + "_convHull"] =
													scagConvHull[score];
												row[score + "_diff_og_priv"] =
													Math.abs(
														//absolute value of difference
														ogScag[score] -
															scagWhole[score]
													);
												row[
													score + "_diff_og_convHull"
												] = Math.abs(
													//absolute value of difference
													ogScag[score] -
														scagConvHull[score]
												);
											});
											//add a column for Euclidean distance between the two scagnostics vectors
											row["rmsd_og_priv"] = Math.sqrt(
												SCORES.reduce(
													(
														acc: number,
														score: string
													) =>
														acc +
														Math.pow(
															row[
																score +
																	"_diff_og_priv"
															],
															2
														),
													0
												)
											);
											row["rmsd_og_convHull"] = Math.sqrt(
												SCORES.reduce(
													(
														acc: number,
														score: string
													) =>
														acc +
														Math.pow(
															row[
																score +
																	"_diff_og_convHull"
															],
															2
														),
													0
												)
											);
											row["unbinThreshold"] = unbin;

											data.push(row);
										});
								});
							});
						});
					});
				});
		});

		console.log(data);
		console.log(unparse(data));
		return data;
	});
}
