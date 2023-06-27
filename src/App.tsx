import React, { useEffect } from "react";
import { parse } from "papaparse";
import collectData from "./services/dataCollector";

import "./App.css";
//import libraries
import Scagnostics from "./lib/scagnostics.js";

//import components
import FileUploadSingle from "./components/FileUploadSingle";
import ScagnosticsTable from "./components/ScagnosticsTable";
import Plots from "./components/Plots";

//import classes
import BinnedData2D from "./classes/BinnedData2D";
import Data2D from "./classes/Data2D";

//import visualizations

//import services
import * as dataService from "./services/dataService";
import Filters from "./components/Filters";
import { filter } from "d3";
import { Slider } from "@mui/material";
import pointInPolygon from "./utilities/pointInPolygon";
const scagOptions = {
	binType: "leader",
};

/* eslint-disable-next-line no-restricted-globals */
function App() {
	const [originalDataName, setOriginalDataName] = React.useState<
		string | undefined
	>(undefined);
	const [originalData, setOriginalData] = React.useState<Data2D | undefined>(
		undefined
	);
	const [binnedData, setBinnedData] = React.useState<
		BinnedData2D | undefined
	>();
	const [privBinnedData2D, setPrivBinnedData2D] = React.useState<
		BinnedData2D | undefined
	>(undefined);
	const [privUnbinnedData2D, setPrivUnbinnedData] = React.useState<
		Data2D | undefined
	>(undefined);
	const [ogScagnostics, setOGScagnostics] = React.useState<any>([]);
	const [unbinScagnostics, setUnbinScagnostics] = React.useState<any>([]);
	const [unbinConvHullScagnostics, setUnbinConvHullScagnostics] =
		React.useState<any>([]);
	const [binningMode, setBinningMode] = React.useState<number>(32);
	const extractDataValues = (data: any) => {
		return data.map((d: any) =>
			Object.values(d).map((v: any) => parseFloat(v))
		);
	};

	const [filterParams, setFilterParams] = React.useState<any>({});

	const [unbinThreshold, setUnbinThreshold] = React.useState<
		number | number[]
	>(0);

	const handleUnbinThresholdChange = (
		event: Event,
		newValue: number | number[],
		activeThum: number
	) => {
		setUnbinThreshold(newValue);
	};

	const handleParamChange = (params: any) => {
		setOriginalDataName(params.Dataset);
		setBinningMode(parseInt(params["Number of bins"]) || 32);
		dataService.getPrivateData(params).then((data) => {
			let dataValues = extractDataValues(data).slice(0, -1);
			const binnedData = new BinnedData2D(dataValues, undefined);
			binnedData.transposeData();
			setPrivBinnedData2D(binnedData);
		});
	};

	//fetch filterParams
	useEffect(() => {
		dataService.getFilterParams().then((params) => {
			setFilterParams(params);
		});
	}, []);

	//fetch original data from server
	useEffect(() => {
		if (originalDataName) {
			// collectData();
			console.log("fetching original data");
			dataService
				.getDataset("original", originalDataName + ".csv")
				.then((data) => {
					let dataValues = extractDataValues(data).slice(0, -1);
					setOriginalData(new Data2D(dataValues));
				});
		}
	}, [originalDataName]);

	//set binned data from original data
	useEffect(() => {
		if (originalData) {
			console.log("setting binned data");
			const b = originalData?.binData(binningMode, binningMode);
			setBinnedData(b);
		}
	}, [originalData, binningMode]);

	//set unbinned data from priv binned data
	useEffect(() => {
		console.log("setting unbinned data");
		if (originalData && privBinnedData2D) {
			let unbinnedData = privBinnedData2D.getUnbinnedData(
				originalData.xRange,
				originalData.yRange,
				originalData.xMin,
				originalData.yMin,
				unbinThreshold as number
			);
			setPrivUnbinnedData(unbinnedData);
		}
	}, [originalData, privBinnedData2D, unbinThreshold]);

	//compute scagnostics
	useEffect(() => {
		if (originalData) {
			console.log("computing scagnostics - original");
			const scag = new Scagnostics(originalData.data, scagOptions);
			console.log(scag);
			setOGScagnostics(scag);
		}
	}, [originalData]);

	useEffect(() => {
		if (privUnbinnedData2D) {
			console.log("computing scagnostics - private unbinned");
			//get convex hull of original data
			const convHull = ogScagnostics["convexHull"];
			const scagWhole = new Scagnostics(
				privUnbinnedData2D.data,
				scagOptions
			) as any;
			//filter points outside of convex hull
			const normalizedPoints = scagWhole.normalizedPoints;
			const filteredData = normalizedPoints.filter((d: number[]) => {
				return pointInPolygon(convHull, d);
			});
			const scagConvHull = new Scagnostics(filteredData, scagOptions);
			console.log(scagWhole);
			setUnbinConvHullScagnostics(scagConvHull);
			setUnbinScagnostics(scagWhole);
			originalData?.denoiseData(1, 32);
		}
	}, [ogScagnostics, privUnbinnedData2D]);
	return (
		<div className="App">
			<Filters onSubmit={handleParamChange} data={filterParams}></Filters>
			<div id="unbin-threshold-slider">
				<h5>Denoise Level</h5>
				<Slider
					aria-label="Temperature"
					defaultValue={0}
					step={1}
					marks
					min={0}
					max={10}
					value={unbinThreshold}
					valueLabelDisplay="on"
					onChange={handleUnbinThresholdChange}
				/>
			</div>
			<div id="content">
				<div id="plots">
					<Plots
						plotInputs={[
							{
								unbinned: originalData,
								binned: binnedData,
								titleUnbinned: "Original Data",
								titleBinned: "Original Data (Binned)",
								xDomain: undefined,
								yDomain: undefined,
								convexHull: []
							},
							{
								unbinned: privUnbinnedData2D,
								binned: privBinnedData2D,
								titleUnbinned: "Private Data (Unbinned)",
								titleBinned: `Private Data (Binned)`,
								xDomain: [
									originalData?.xMin,
									originalData?.xMax,
								],
								yDomain: [
									originalData?.yMin,
									originalData?.yMax,
								],
								convexHull: []
							},
						]}
					></Plots>
				</div>

				<div>
					<ScagnosticsTable
						scagList={[ogScagnostics, unbinScagnostics, unbinConvHullScagnostics]}
					></ScagnosticsTable>
				</div>
			</div>
		</div>
	);
}

export default App;
