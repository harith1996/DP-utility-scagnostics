import React, { useEffect } from "react";
import "./App.css";
import Scagnostics from "./lib/scagnostics.js";
import FileUploadSingle from "./components/FileUploadSingle";
import { parse } from "papaparse";
import BinnedData2D from "./classes/BinnedData2D";
import Data2D from "./classes/Data2D";

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
	const [scagnostics, setScagnostics] = React.useState<Scagnostics>([]);
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
			setScagnostics(new Scagnostics(originalData.getData()));
			privBinnedData2D.transposeData();
		}
	}, [originalData, privBinnedData2D]);
	useEffect(() => {
		if (scagnostics && originalData) {
			console.log(scagnostics);
			console.log(originalData!.binData(32, 32));
			console.log(privBinnedData2D);
			console.log(
				privBinnedData2D?.getUnbinnedData(
					originalData.xRange,
					originalData.yRange
				)
			);
		}
	}, [scagnostics]);
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
		</div>
	);
}

export default App;
