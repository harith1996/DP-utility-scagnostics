import React, { useEffect } from "react";
import "./App.css";
import Scagnostics from "./lib/scagnostics.js";
import FileUploadSingle from "./components/FileUploadSingle";
import { parse } from "papaparse";
import BinnedData2D from "./classes/BinnedData2D";
import Data2D from "./classes/Data2D";
import Scatterplot from "./classes/Scatterplot";
import BinnedScatterplot from "./classes/BinnedScatterplot";
import { Config, TopLevelSpec, compile } from "vega-lite";
import ScagnosticsDisplay from "./components/ScagnosticsDisplay";

type Data = {
	x: number;
	y: number;
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
	useEffect(() => {
		if (originalData && privBinnedData2D) {
			setOGScagnostics(new Scagnostics(originalData.data));
			privBinnedData2D.transposeData();
		}
	}, [originalData, privBinnedData2D]);
	useEffect(() => {
		if (ogScagnostics && originalData) {
			console.log(ogScagnostics);
			console.log(originalData!.binData(32, 32));
			console.log(privBinnedData2D);
			console.log(
				privBinnedData2D?.getUnbinnedData(
					originalData.xRange,
					originalData.yRange
				)
			);
			Scatterplot(
				originalData!.data.map((d) => {
					return { x: d[0], y: d[1] };
				}),
				{
					x: (d: any) => d.x,
					y: (d: any) => d.y,
					title: (d: any) => "",
					xDomain: [originalData.xMin, originalData.xMax],
					yDomain: [originalData.yMin, originalData.yMax],
					xFormat: ".2f",
					yFormat: ".2f",
					xLabel: "x",
					yLabel: "y",
					width: 300,
					height: 300,
					stroke: "rgba(139, 139, 255, 0.2)",
					svgNodeSelector: "#og-scatterplot",
				}
			);
			BinnedScatterplot(originalData.binData(32, 32), {
				x: (d: any) => d.x,
				y: (d: any) => d.y,
				title: (d: any) => "",
				xDomain: [originalData.xMin, originalData.xMax],
				yDomain: [originalData.yMin, originalData.yMax],
				xFormat: ".2f",
				yFormat: ".2f",
				xLabel: "x",
				yLabel: "y",
				width: 300,
				height: 300,
				stroke: "rgba(139, 139, 255, 0.2)",
				svgNodeSelector: "#og-binned-scatterplot",
				xNumBins: 32,
				yNumBins: 32,
			});
			BinnedScatterplot(privBinnedData2D!.data, {
				x: (d: any) => d.x,
				y: (d: any) => d.y,
				title: (d: any) => "",
				xDomain: [originalData.xMin, originalData.xMax],
				yDomain: [originalData.yMin, originalData.yMax],
				xFormat: ".2f",
				yFormat: ".2f",
				xLabel: "x",
				yLabel: "y",
				width: 300,
				height: 300,
				stroke: "rgba(139, 139, 255, 0.2)",
				svgNodeSelector: "#priv-binned-scatterplot",
				xNumBins: 32,
				yNumBins: 32,
			});
			let unbinned = privBinnedData2D!.getUnbinnedData(
				originalData.xRange,
				originalData.yRange
			);
			setUnbinScagnostics(new Scagnostics(unbinned.data));
			Scatterplot(
				unbinned.data.map((d) => {
					return { x: d[0], y: d[1] };
				}),
				{
					x: (d: any) => d.x,
					y: (d: any) => d.y,
					title: (d: any) => "",
					xDomain: [unbinned.xMin, unbinned.xMax],
					yDomain: [unbinned.yMin, unbinned.yMax],
					xFormat: ".2f",
					yFormat: ".2f",
					xLabel: "x",
					yLabel: "y",
					width: 300,
					height: 300,
					stroke: "rgba(139, 139, 255, 0.2)",
					svgNodeSelector: "#priv-unbinned-scatterplot",
				}
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
					<svg id="og-scatterplot"></svg>
					<ScagnosticsDisplay
						scagnostics={ogScagnostics}
					></ScagnosticsDisplay>
				</div>
				<svg id="og-binned-scatterplot"></svg>
				<svg id="priv-binned-scatterplot"></svg>
				<div>
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
