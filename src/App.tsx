import React, { useEffect } from "react";
import "./App.css";
import Scagnostics from "./lib/scagnostics.js";
import FileUploadSingle from "./components/FileUploadSingle";
import { parse } from "papaparse";
import BinnedData2D from "./classes/BinnedData2D";
import Data2D from "./classes/Data2D";
import Scatterplot from "./visualizations/Scatterplot";
import BinnedScatterplot from "./visualizations/BinnedScatterplot";
import Legend from "./visualizations/Legend";
import { Config, TopLevelSpec, compile } from "vega-lite";
import ScagnosticsDisplay from "./components/ScagnosticsDisplay";

type Data = {
	x: number;
	y: number;
};

let scatterplotSpec = {
	x: (d: any) => d.x,
	y: (d: any) => d.y,
	title: (d: any) => "",
	xFormat: ".2f",
	yFormat: ".2f",
	xLabel: "x",
	yLabel: "y",
	width: 400,
	height: 400,
	stroke: "rgba(139, 139, 255, 0.2)",
};

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

	//set unbinned data from priv binned data
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
		if (privUnbinnedData2D) {
			setUnbinScagnostics(new Scagnostics(privUnbinnedData2D.data));
		}
	}, [originalData && privUnbinnedData2D]);

	//console log and show plots
	useEffect(() => {
		if (ogScagnostics && originalData) {
			console.log(ogScagnostics);
			console.log(originalData!.binData(32, 32));
			console.log(privBinnedData2D);

			//original data scatterplot
			Scatterplot(
				originalData!.data.map((d) => {
					return { x: d[0], y: d[1] };
				}),
				Object.assign(
					{
						x: (d: any) => d.x,
						y: (d: any) => d.y,
						title: (d: any) => "",
						xDomain: [originalData.xMin, originalData.xMax],
						yDomain: [originalData.yMin, originalData.yMax],
						svgNodeSelector: "#og-scatterplot",
					},
					scatterplotSpec
				)
			);

			//original data binned scatterplot
			let b1 = BinnedScatterplot(
				originalData.binData(32, 32),
				Object.assign(
					{
						xDomain: [originalData.xMin, originalData.xMax],
						yDomain: [originalData.yMin, originalData.yMax],
						svgNodeSelector: "#og-binned-scatterplot",
						xNumBins: 32,
						yNumBins: 32,
					},
					scatterplotSpec
				)
			);
			Legend(b1.colorScale, {
				title: "# data points",
				svgSelector: "#og-binned-scatterplot-legend",
				tickFormat: undefined,
				tickValues: undefined,
			});

			//private data binned scatterplot
			let b2 = BinnedScatterplot(
				privBinnedData2D!.data,
				Object.assign(
					{
						xDomain: [originalData.xMin, originalData.xMax],
						yDomain: [originalData.yMin, originalData.yMax],
						svgNodeSelector: "#priv-binned-scatterplot",
						xNumBins: 32,
						yNumBins: 32,
					},
					scatterplotSpec
				)
			);
			Legend(b2.colorScale, {
				title: "# data points",
				svgSelector: "#priv-binned-scatterplot-legend",
				tickFormat: undefined,
				tickValues: undefined,
			});

			//private data unbinned scatterplot
			Scatterplot(
				privUnbinnedData2D!.data.map((d) => {
					return { x: d[0], y: d[1] };
				}),
				Object.assign(
					{
						xDomain: [privUnbinnedData2D!.xMin, privUnbinnedData2D!.xMax],
						yDomain: [privUnbinnedData2D!.yMin, privUnbinnedData2D!.yMax],
						svgNodeSelector: "#priv-unbinned-scatterplot",
					},
					scatterplotSpec
				)
			);
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
			<div className="plots">
				<div>
					<h3>Original Data</h3>
					<svg id="og-scatterplot"></svg>
					<ScagnosticsDisplay
						scagnostics={ogScagnostics}
					></ScagnosticsDisplay>
				</div>
				<div>
					<h3>Original Binned Data</h3>
					<svg id="og-binned-scatterplot"></svg>
					<svg id="og-binned-scatterplot-legend"></svg>
				</div>
				<div>
					<h3>
						Privatized Binned Data ( DAWA, epsilon=0.5, bins=32){" "}
					</h3>
					<svg id="priv-binned-scatterplot"></svg>
					<svg id="priv-binned-scatterplot-legend"></svg>
				</div>
				<div>
					<h3>Unbinned version of private data</h3>
					<svg id="priv-unbinned-scatterplot"></svg>
					<ScagnosticsDisplay
						scagnostics={unbinScagnostics}
					></ScagnosticsDisplay>
				</div>
			</div>
		</div>
	);
}

export default App;
