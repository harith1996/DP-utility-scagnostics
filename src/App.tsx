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
import Scatterplot from "./visualizations/Scatterplot";
import BinnedScatterplot from "./visualizations/BinnedScatterplot";
import Legend from "./visualizations/Legend";

//import services
import * as dataService from "./services/dataService";

/* eslint-disable-next-line no-restricted-globals */
function App() {
	const [originalData, setOriginalData] = React.useState<Data2D | undefined>(
		undefined
	);
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
	const extractDataValues = (data: any) => {
		return data.map((d: any) =>
			Object.values(d).map((v: any) => parseFloat(v))
		);
	};
	const handleOriginalData = (data: File | undefined) => {
		data!.text().then((data) => {
			let parsedData = parse(data, { header: true }).data;
			let dataValues = extractDataValues(parsedData).slice(0, -1);
			setOriginalData(new Data2D(dataValues));
		});
	};
	const handlePrivBinnedData = (data: File | undefined) => {
		data!.text().then((data) => {
			let parsedData = parse(data, { header: false }).data;
			let dataValues = extractDataValues(parsedData).slice(0, -1);
			setPrivBinnedData2D(new BinnedData2D(dataValues));
		});
	};

	//transpose DP output, set unbinned data from priv binned data
	useEffect(() => {
		if (originalData && privBinnedData2D) {
			privBinnedData2D.transposeData();
			let unbinnedData = privBinnedData2D.getUnbinnedData(
				originalData.xRange,
				originalData.yRange,
				originalData.xMin,
				originalData.yMin
			);
			setPrivUnbinnedData(new Data2D(unbinnedData.data));
		}
	}, [originalData, privBinnedData2D]);

	//compute scagnostics
	useEffect(() => {
		if (originalData) {
			setOGScagnostics(new Scagnostics(originalData.data));
		}
	}, [originalData]);

	useEffect(() => {
		if (privUnbinnedData2D) {
			setUnbinScagnostics(new Scagnostics(privUnbinnedData2D.data));
		}
	}, [privUnbinnedData2D]);

	//console log
	useEffect(() => {
		if (ogScagnostics && originalData) {
			console.log(ogScagnostics);
			console.log(originalData!.binData(32, 32));
			console.log(privBinnedData2D);
			//test dataService
			dataService.getDatasets("private").then((data) => {
				console.log(data);
			});
		}
	}, [ogScagnostics]);
	return (
		<div className="App">
			<div className="loader">
				<div>
					Upload Original Unbinned Data (.csv)
					<FileUploadSingle
						fileExtension=".csv"
						onUpload={handleOriginalData}
					></FileUploadSingle>
				</div>
				<div>
					Upload Private Binned Data (.csv)
					<FileUploadSingle
						fileExtension=".csv"
						onUpload={handlePrivBinnedData}
					></FileUploadSingle>
				</div>
			</div>
			<div id="content">
				<div id="plots">
					<Plots
						plotInputs={[
							{
								unbinned: originalData,
								binned: originalData?.binData(32, 32),
								titleUnbinned: "Original Data",
								titleBinned: "Original Data (Binned)",
							},
							{
								unbinned: privUnbinnedData2D,
								binned: privBinnedData2D,
								titleUnbinned: "Private Data (Unbinned)",
								titleBinned:
									"Private Data (DAWA, bins = 32x32, epsilon=0.5)",
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
