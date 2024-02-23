import React, { useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
interface ScagnosticsDisplayProps {
	scagList: Array<any>;
}

const SCORES = [
	"clumpyScore",
	"convexScore",
	"outlyingScore",
	"skinnyScore",
	"sparseScore",
	"striatedScore",
	"monotonicScore",
	"stringyScore",
	"skewedScore",
];

const columns: GridColDef[] = [
	{ field: "scoreName", headerName: "Scagnostics Measure", width: 200 },
	{ field: "score0", headerName: "Score (original)", width: 200 },
	{ field: "score1", headerName: "Score (original denoised)", width: 200 },
	{ field: "score2", headerName: "Score (private)", width: 200 },
	// { field: "score3", headerName: "Score (private convex hull)", width: 200 },
	{
		field: "diff12",
		headerName: "Difference (private - original)",
		width: 200,
	},
	// {
	// 	field: "diff13",
	// 	headerName: "Difference (private convex hull - original)",
	// 	width: 200,
	// },
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
		SCORES.forEach((score) => {
			if (props.scagList[0].hasOwnProperty(score)) {
				let score0 = props.scagList[3][score];
				let score1 = props.scagList[0][score];
				let score2 = props.scagList[1][score];
				let score3 = props.scagList[2][score];
				let diff12 = score2 - score1;
				let diff13 = score3 - score1;
				rows.push({
					id: score,
					scoreName: score,
					score0: score0?.toFixed(6),
					score1: score1?.toFixed(6),
					score2: score2?.toFixed(6),
					score3: score3?.toFixed(6),
					diff12: diff12?.toFixed(6),
					diff13: diff13?.toFixed(6),
				});
			}
		});
		setRows(rows);
	}, [props.scagList]);

	return (
		<div className="scag-table">
			<h4>Scagnostics</h4>
			<DataGrid rows={rows} columns={columns} />
		</div>
	);
}
