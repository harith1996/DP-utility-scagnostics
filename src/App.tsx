import React, { useEffect } from "react";
import { parse } from "papaparse";

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

/* eslint-disable-next-line no-restricted-globals */
function App() {
	const [originalDataName, setOriginalDataName] = React.useState<string>("");
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
	const [ogScagnostics, setOGScagnostics] = React.useState<Scagnostics>([]);
	const [unbinScagnostics, setUnbinScagnostics] = React.useState<Scagnostics>(
		[]
	);
	const [binningMode, setBinningMode] = React.useState<number>(32);
	const extractDataValues = (data: any) => {
		return data.map((d: any) =>
			Object.values(d).map((v: any) => parseFloat(v))
		);
	};

	const [filterParams, setFilterParams] = React.useState<any>({});

	const handleParamChange = (params: any) => {
		setOriginalDataName(params.Dataset);
		setBinningMode(parseInt(params["Number of bins"]) || 32);
		dataService.getPrivateData(params).then((data) => {
			let dataValues = extractDataValues(data).slice(0, -1);
			const binnedData = new BinnedData2D(dataValues);
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
				originalData.yMin
			);
			setPrivUnbinnedData(unbinnedData);
		}
	}, [originalData, privBinnedData2D]);

	//compute scagnostics
	useEffect(() => {
		if (originalData) {
			console.log("computing scagnostics - original");
			setOGScagnostics(new Scagnostics(originalData.data));
		}
	}, [originalData]);

	useEffect(() => {
		if (privUnbinnedData2D) {
			console.log("computing scagnostics - private unbinned");
			setUnbinScagnostics(new Scagnostics(privUnbinnedData2D.data));
		}
	}, [privUnbinnedData2D]);
	return (
		<div className="App">
			<Filters onSubmit={handleParamChange} data={filterParams}></Filters>
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
							},
							{
								unbinned: privUnbinnedData2D,
								binned: privBinnedData2D,
								titleUnbinned: "Private Data (Unbinned)",
								titleBinned:
									"Private Data (DAWA, bins = 32x32, epsilon=0.5)",
								xDomain: [
									originalData?.xMin,
									originalData?.xMax,
								],
								yDomain: [
									originalData?.yMin,
									originalData?.yMax,
								],
							},
						]}
					></Plots>
				</div>
				<div>
					<ScagnosticsTable
						scagList={[ogScagnostics, unbinScagnostics]}
					></ScagnosticsTable>
				</div>
			</div>
		</div>
	);
}

export default App;
