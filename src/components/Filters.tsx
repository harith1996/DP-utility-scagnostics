import React from "react";
import { useForm } from "react-hook-form";

interface SubmitHandler {
	onSubmit: (data: any) => void;
}

interface DPParams{
	Dataset: string;
	Features: string;
	Algorithm: string;
	Epsilon: string;
	NumberOfBins: string;
}

export default function Filters(props: SubmitHandler) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const onSubmit = (data: any) => {
		console.log(data);
		props.onSubmit(data as DPParams);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<label htmlFor="Dataset">Dataset</label>
			<select {...register("Dataset", { required: true })}>
				<option value="0">0</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="9">9</option>
			</select>
			
			<label>Features</label>
			<select {...register("Features", { required: true })}>
				<option value="distribution">distribution</option>
				<option value="correlation">correlation</option>
				<option value="clusters">clusters</option>
			</select>

			<label>Algorithm</label>
			<select {...register("Algorithm", { required: true })}>
				<option value="DAWA">DAWA</option>
				<option value="AGrid">AGrid</option>
				<option value="AHP">AHP</option>
				<option value="Geometric">Geometric</option>
			</select>
			
			<label>Epsilon</label>
			<select {...register("Epsilon", { required: true })}>
				<option value="0.5">0.5</option>
				<option value="0.1">0.1</option>
				<option value="0.05">0.05</option>
				<option value="0.01">0.01</option>
			</select>
			
			<label>Number of bins</label>
			<select {...register("Number of bins", { required: true })}>
				<option value="32">32x32</option>
				<option value="64">64x64</option>
			</select>

			<input type="submit" />
		</form>
	);
}
