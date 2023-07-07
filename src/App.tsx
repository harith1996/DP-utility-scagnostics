import React, { useEffect } from "react";

import "./App.css";
//import libraries
import Scagnostics from "./lib/scagnostics.js";

//import components
import ScagnosticsTable from "./components/ScagnosticsTable";
import Plots from "./components/Plots";
import Filters from "./components/Filters";
import { Slider } from "@mui/material";

//import classes
import BinnedData2D from "./classes/BinnedData2D";
import Data2D from "./classes/Data2D";

//import visualizations

//import services
import * as dataService from "./services/dataService";
import {collectData, collectCSV} from "./services/dataCollector";

//import utilities
import pointInPolygon from "./utilities/pointInPolygon";

const scagOptions = {
	binType: "leader",
};

/* eslint-disable-next-line no-restricted-globals */
function App() {
	const [originalDataName, setOriginalDataName] = React.useState<
		string | undefined
	>(undefined);
	const [ogData, setOgData] = React.useState<Data2D | undefined>();
	const [denoisedOgData, setDenoisedOgData] = React.useState<
		Data2D | undefined
	>(undefined);
	const [binnedOgData, setBinnedOgData] = React.useState<
		BinnedData2D | undefined
	>();
	const [binnedPrivData, setBinnedPrivData] = React.useState<
		BinnedData2D | undefined
	>(undefined);
	const [unbinnedPrivData, setUnbinnedPrivData] = React.useState<
		Data2D | undefined
	>(undefined);
	const [ogScagnostics, setOgScagnostics] = React.useState<any>([]);
	const [denoisedOgScagnostics, setDenoisedOgScagnostics] =
		React.useState<any>([]);
	const [privScagnostics, setPrivScagnostics] = React.useState<any>([]);
	const [privConvHullScagnostics, setPrivConvHullScagnostics] =
		React.useState<any>([]);
	const [binningMode, setBinningMode] = React.useState<number>(32);
	const extractDataValues = (data: any) => {
		return data.map((d: any) =>
			Object.values(d).map((v: any) => parseFloat(v))
		);
	};

	const [ogDataReady, setOgDataReady] = React.useState<boolean>(false);

	const [filterParams, setFilterParams] = React.useState<any>({});

	const [unbinThreshold, setUnbinThreshold] = React.useState<
		number | number[]
	>(0);

	const [activeParams, setActiveParams] = React.useState<any>({});

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
		setActiveParams(params);
	};

	//fetch filterParams
	useEffect(() => {
		dataService.getFilterParams().then((params) => {
			setFilterParams(params);
		});
	}, []);

	//fetch private data from server
	useEffect(() => {
		if (ogDataReady) {
			dataService.getPrivateData(activeParams).then((data) => {
				let dataValues = extractDataValues(data).slice(0, -1);
				const binnedData = new BinnedData2D(dataValues, undefined);
				binnedData.transposeData();
				setBinnedPrivData(binnedData);
			});
		}
	}, [activeParams, ogDataReady]);

	//fetch original data from server
	useEffect(() => {
		if (originalDataName) {
			setOgDataReady(false);
			collectCSV().then((data) => {
				//Save as JSON file
				const json = JSON.stringify(data);
				const blob = new Blob([json], { type: "application/json" });
				const href = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = href;
				link.download = "data.json";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				
			});
			console.log("fetching original data");
			dataService
				.getDataset("original", originalDataName + ".csv")
				.then((data) => {
					let dataValues = extractDataValues(data).slice(0, -1);
					setOgData(new Data2D(dataValues));
					console.log("computing scagnostics - original data");
					setOgScagnostics(new Scagnostics(dataValues, scagOptions));
				});
		}
	}, [originalDataName]);

	//set binned data from original data
	useEffect(() => {
		if (denoisedOgData && ogData && ogDataReady) {
			console.log("setting binned data");
			const b = denoisedOgData?.binData(
				binningMode,
				binningMode,
				ogData.xRange,
				ogData.yRange,
				ogData.xMin,
				ogData.yMin
			);
			setBinnedOgData(b);
		}
	}, [denoisedOgData, binningMode, ogData, ogDataReady]);

	//set unbinned_priv_data from binned_priv_data
	useEffect(() => {
		console.log("setting unbinned data");
		if (binnedPrivData && ogData && ogDataReady) {
			let unbinnedData = binnedPrivData.getUnbinnedData(
				ogData.xRange,
				ogData.yRange,
				ogData.xMin,
				ogData.yMin,
				unbinThreshold as number
			);
			setUnbinnedPrivData(unbinnedData);
			console.log(unbinnedData);
		}
	}, [binnedPrivData, ogData, unbinThreshold, ogDataReady]);

	//denoise data
	useEffect(() => {
		if (ogData && binningMode) {
			let denoised = new Data2D(
				ogData?.denoisedData(unbinThreshold as number, binningMode)
			);
			setDenoisedOgData(denoised);
		}
	}, [unbinThreshold, ogData, binningMode]);

	//compute scagnostics
	useEffect(() => {
		if (denoisedOgData) {
			console.log("computing scagnostics - original denoised");
			const scag = new Scagnostics(denoisedOgData.data, scagOptions);
			console.log(scag);
			setDenoisedOgScagnostics(scag);
			setOgDataReady(true);
		}
	}, [denoisedOgData]);

	useEffect(() => {
		if (unbinnedPrivData && ogDataReady) {
			console.log("computing scagnostics - private unbinned ");
			const scagWhole = new Scagnostics(
				unbinnedPrivData.data,
				scagOptions
			) as any;
			console.log(scagWhole);

			//get convex hull of original data
			const convHull = ogScagnostics["convexHull"];
			const normalizedPoints = scagWhole.normalizedPoints;
			//filter points outside of convex hull
			const filteredData = normalizedPoints.filter((d: number[]) => {
				return pointInPolygon(convHull, d);
			});
			console.log(
				"computing scagnostics - private unbinned convex hull "
			);
			const scagConvHull = new Scagnostics(filteredData, scagOptions);
			console.log(scagConvHull);
			setPrivConvHullScagnostics(scagConvHull);
			setPrivScagnostics(scagWhole);
		}
	}, [ogScagnostics, unbinnedPrivData, ogDataReady]);
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
								unbinned: denoisedOgData,
								binned: binnedOgData,
								titleUnbinned: "Original Data",
								titleBinned: "Original Data (Binned)",
								xDomain: [ogData?.xMin, ogData?.xMax],
								yDomain: [ogData?.yMin, ogData?.yMax],
								convexHull: [],
							},
							{
								unbinned: unbinnedPrivData,
								binned: binnedPrivData,
								titleUnbinned: "Private Data (Unbinned)",
								titleBinned: `Private Data (Binned)`,
								xDomain: [ogData?.xMin, ogData?.xMax],
								yDomain: [ogData?.yMin, ogData?.yMax],
								convexHull: [],
							},
						]}
					></Plots>
				</div>

				<div>
					<ScagnosticsTable
						scagList={[
							denoisedOgScagnostics,
							privScagnostics,
							privConvHullScagnostics,
							ogScagnostics,
						]}
					></ScagnosticsTable>
				</div>
			</div>
		</div>
	);
}

export default App;
