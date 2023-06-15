import React, { useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
interface ScagnosticsDisplayProps {
	scagList: Array<any>;
}

const scores = [
	"clumpyScore",
	"convexScore",
	"outlyingScore",
	"outlyingUpperBound",
	"skinnyScore",
	"sparseScore",
	"striatedScore",
	"monotonicScore",
	"stringyScore",
];

const columns: GridColDef[] = [
	{ field: "scoreName", headerName: "Scagnostics Measure", width: 200 },
	{ field: "score1", headerName: "Score (original)", width: 200 },
	{ field: "score2", headerName: "Score (private)", width: 200 },
	{
		field: "diff",
		headerName: "Difference (private - original)",
		width: 200,
	},
	{
		field: "diff_perc",
		headerName: "Difference % (private - original)",
		width: 200,
	},
	// {
	// 	field: "age",
	// 	headerName: "Age",
	// 	type: "number",
	// 	width: 90,
	// },
	// {
	// 	field: "fullName",
	// 	headerName: "Full name",
	// 	description: "This column has a value getter and is not sortable.",
	// 	sortable: false,
	// 	width: 160,
	// 	valueGetter: (params: GridValueGetterParams) =>
	// 		`${params.row.firstName || ""} ${params.row.lastName || ""}`,
	// },
];

export default function ScagnosticsTable(props: ScagnosticsDisplayProps) {
	const [rows, setRows] = React.useState<any[]>([]);
	useEffect(() => {
		let rows: any[] = [];
		scores.forEach((score) => {
			if (props.scagList[0].hasOwnProperty(score)) {
				let score1 = props.scagList[0][score];
				let score2 = props.scagList[1][score];
				let diff = score2 - score1;
				let diff_perc = (diff / score1) * 100;
				rows.push({
					id: score,
					scoreName: score,
					score1: score1?.toFixed(6),
					score2: score2?.toFixed(6),
					diff: diff?.toFixed(6),
					diff_perc: diff_perc?.toFixed(6),
				});
			}
		});
		setRows(rows);
	}, [props.scagList]);

	return (
		<div>
			<h4>Scagnostics</h4>
			<DataGrid rows={rows} columns={columns} />
		</div>
	);
}
