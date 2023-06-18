import React from "react";
import { useForm } from "react-hook-form";

interface FilterProps {
	onSubmit: (data: any) => void;
	data: DPParamUniqueValues;
}

interface DPParams {
	Dataset: string;
	Algorithm: string;
	Epsilon: string;
	NumberOfBins: string;
}

interface DPParamUniqueValues {
	datasetNames: string[];
	algorithms: string[];
	epsilons: string[];
	numBins: string[];
}

export default function Filters(props: FilterProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const onSubmit = (data: any) => {
		console.log(data);
		props.onSubmit(data as DPParams);
	};

	const data = props.data;

	return (
		<form className="filter-form" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor="Dataset">Dataset</label>
				<select {...register("Dataset", { required: true })}>
					{/* for each dataset, create an option */}
					{data.datasetNames?.map((dataset) => (
						<option key={dataset} value={dataset}>{dataset}</option>
					))}
				</select>
			</div>

			<div>
				<label>Algorithm</label>
				<select {...register("Algorithm", { required: true })}>
					{/* for each algorithm, create an option */}
					{data.algorithms?.map((algo) => (
						<option key= {algo} value={algo}>{algo}</option>
					))}
				</select>
			</div>
			<div>
				<label>Epsilon</label>
				<select {...register("Epsilon", { required: true })}>
					{/* for each epsilon, create an option */}
					{data.epsilons?.map((eps) => (
						<option key = {eps} value={eps}>{eps}</option>
					))}
				</select>
			</div>
			<div>
				<label>Number of bins</label>
				<select {...register("Number of bins", { required: true })}>
					{/* for each number of bins, create an option */}
					{data.numBins?.map((num) => (
						<option key = {num} value={num}>{num + "x" + num}</option>
					))}
				</select>
			</div>
			<div>

			<input type="submit" />
			</div>
		</form>
	);
}
