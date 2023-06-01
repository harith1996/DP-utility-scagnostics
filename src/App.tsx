import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import scagnostics from "./lib/scagnostics.min.js";
import FileUploadSingle from "./components/FileUploadSingle";
import { parse } from "papaparse";
import BinnedData from "./classes/BinnedData";

/* eslint-disable-next-line no-restricted-globals */
function App() {
	const [originalData, setOriginalData] = React.useState<any>(null);
	const [privBinnedData, setPrivBinnedData] = React.useState<any>(null);
	const handleOriginalData = (data: File | undefined) => {
		data!.text().then((data) => {
			setOriginalData(parse(data, { header: true }).data);
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
      console.log(new scagnostics(originalData));
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
