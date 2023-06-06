import React from "react";
import scagnostics from "../lib/scagnostics";

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

export default function ScagnosticsDisplay(props: any) {
	return (
		<div>
			<div>
                <h4>Scagnostics</h4>
				<table>
					{scores.map((score) => {
						if (props.scagnostics.hasOwnProperty(score))
							return (
								// make a table with the scagnostics scores

								<tr key={score}>
									<td>{score}</td>
									<td>
										{props.scagnostics[score].toFixed(5)}
									</td>
								</tr>
							);
						return "";
					})}
				</table>
			</div>
		</div>
	);
}
