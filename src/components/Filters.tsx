import React from "react";
import {
	Slider,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	SelectChangeEvent,
} from "@mui/material";

interface DPFilterProps {
	datasetNames: string[];
	epsilons: number[];
	algorithms: string[];
	numNumBins: number[];
	features: string[];
}

export default function Filters(props: DPFilterProps) {
	const [epsilon, setEpsilon] = React.useState<number>(0.1);
	const [algorithm, setAlgorithm] = React.useState<string>("Histogram");
	const [numNumBin, setNumNumBin] = React.useState<number>(10);
	const [feature, setFeature] = React.useState<string>("distribution");
	const [datasetName, setDatasetName] = React.useState<string>("0");
	const handleChange = (event: SelectChangeEvent<{ value: any }>) => {
		console.log(event.target.value);
	};
	return (
		<div>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">Age</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={""}
					label="Age"
					onChange={handleChange}
				>
					{/* Create a MenuItem for each datasetName */}
					{props.datasetNames.map((datasetName) => (
						<MenuItem value={datasetName}>{datasetName}</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
