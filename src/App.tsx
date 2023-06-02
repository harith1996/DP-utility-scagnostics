import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Scagnostics from "./lib/scagnostics.js";
import FileUploadSingle from "./components/FileUploadSingle";
import { parse } from "papaparse";
import BinnedData from "./classes/BinnedData";

/* eslint-disable-next-line no-restricted-globals */
function App() {
	const [originalData, setOriginalData] = React.useState<any>(null);
	const [privBinnedData, setPrivBinnedData] = React.useState<any>(null);
	const handleOriginalData = (data: File | undefined) => {
		data!.text().then((data) => {
			let parsedData = parse(data, { header: true }).data;
			let dataValues = parsedData.map((d: any) => Object.values(d).map((v: any) => parseFloat(v))).slice(0, -1);
			setOriginalData(dataValues);
		});
	};
	const handlePrivBinnedData = (data: File | undefined) => {
		data!.text().then((data) => {
			setPrivBinnedData(parse(data, { header: false }).data);
		});
	};
  useEffect(() => {
    if (originalData && privBinnedData) {
      console.log(originalData);
      console.log(new Scagnostics(originalData));
      const binned = new BinnedData(privBinnedData);
      console.log(binned);
    }
  }, [originalData, privBinnedData]);
	return (
		<div className="App">
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
	);
}

export default App;
