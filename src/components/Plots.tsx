//import all visualizations
import Scatterplot from "../visualizations/Scatterplot";
import BinnedScatterplot from "../visualizations/BinnedScatterplot";
import Legend from "../visualizations/Legend";
import { useEffect } from "react";
import BinnedData2D from "../classes/BinnedData2D";
import Data2D from "../classes/Data2D";

interface PlotInput {
	unbinned: Data2D | undefined;
	binned: BinnedData2D | undefined;
	titleUnbinned: string | undefined;
	titleBinned: string | undefined;
}

interface PlotsProps {
	plotInputs: Array<PlotInput>;
}

const scatterplotSpec = {
	x: (d: any) => d.x,
	y: (d: any) => d.y,
	title: (d: any) => "",
	xFormat: ".2f",
	yFormat: ".2f",
	xLabel: "x",
	yLabel: "y",
	width: 400,
	height: 400,
	stroke: "rgba(139, 139, 255, 0.2)",
};

export default function Plots(props: PlotsProps) {
	//loop through each PlotInput
	useEffect(() => {
		let inputs = props.plotInputs;
		inputs.forEach(
			(input, index) => {
				if (
					input.unbinned !== undefined &&
					input.binned !== undefined
				) {
					Scatterplot(
						input.unbinned.data.map((d) => {
							return { x: d[0], y: d[1] };
						}),
						Object.assign(
							{
								svgNodeSelector: `#scatterplot${index}`,
								xDomain: [
									input.unbinned.xMin,
									input.unbinned.xMax,
								],
								yDomain: [
									input.unbinned.yMin,
									input.unbinned.yMax,
								],
							},
							scatterplotSpec
						)
					);

					let b = BinnedScatterplot(
						input.binned.data,
						Object.assign(
							{
								svgNodeSelector: `#binnedScatterplot${index}`,
								xDomain: [
									input.unbinned.xMin,
									input.unbinned.xMax,
								],
								yDomain: [
									input.unbinned.yMin,
									input.unbinned.yMax,
								],
								xNumBins: input.binned.numberOfBins,
								yNumBins: input.binned.numberOfBins,
							},
							scatterplotSpec
						)
					);
					Legend(b.colorScale, {
						title: "# data points",
						svgSelector: `#colorLegend${index}`,
						tickFormat: undefined,
						tickValues: undefined,
					});
				}
			},
			[props.plotInputs]
		);
	});

	//for each binned scatterplot, create a color legend
	//for each scatterplot, display scagnostics
	//return a div with all of these plots

	return (
		<div className="plots">
			{
				//for each plotInput, create two svgs with a unique id
				props.plotInputs.map((combo, index) => {
					return (
						<div className="plot" key={index}>
							<div>
								<h3>{combo.titleUnbinned}</h3>
								<div className="scatterplot-with-scag">
									<svg id={`scatterplot${index}`} />
								</div>
							</div>
							<div className="binnedscatterplot-with-legend">
								<h3>{combo.titleBinned}</h3>
								<svg id={`binnedScatterplot${index}`} />
								<svg id={`colorLegend${index}`} />
							</div>
						</div>
					);
				})
			}
		</div>
	);
}
