import * as d3 from "d3";
export default function BinnedScatterplot(
	data,
	{
		svgNodeSelector,
		x = ([x]) => x, // given d in data, returns the (quantitative) x-value
		y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
		r = 11, // (fixed) radius of dots, in pixels
		title, // given d in data, returns the title
		marginTop = 20, // top margin, in pixels
		marginRight = 30, // right margin, in pixels
		marginBottom = 30, // bottom margin, in pixels
		marginLeft = 40, // left margin, in pixels
		inset = r * 2, // inset the default range, in pixels
		insetTop = inset, // inset the default y-range
		insetRight = inset, // inset the default x-range
		insetBottom = inset, // inset the default y-range
		insetLeft = inset, // inset the default x-range
		width = 400, // outer width, in pixels
		height = 400, // outer height, in pixels
		xType = d3.scaleLinear, // type of x-scale
		xDomain, // [xmin, xmax]
		xNumBins,
		xRange = [0, width], // [left, right]
		yType = d3.scaleLinear, // type of y-scale
		yDomain, // [ymin, ymax]
		yNumBins,
		yRange = [marginTop, height - marginBottom], // [bottom, top]
		xLabel, // a label for the x-axis
		yLabel, // a label for the y-axis
		xFormat, // a format specifier string for the x-axis
		yFormat, // a format specifier string for the y-axis
		fill = "none", // fill color for dots
		stroke = "currentColor", // stroke color for the dots
		strokeWidth = 1.5, // stroke width for dots
		halo = "#fff", // color of label halo
		haloWidth = 3, // padding around the labels
	} = {}
) {
	// Construct scales and axes.
	const colorScale = d3
		.scaleSequential(d3.interpolateBlues)
		.domain([0, 10]);
	const xScale = xType([0,xNumBins - 1], xRange);
	const yScale = yType([0,yNumBins - 1], yRange);

	const svg = d3.select(svgNodeSelector);
	r = width / xNumBins;
	svg.selectAll("*").remove();

	svg.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

	let plot = svg.append("g");
	// Add rows of rect
	let row = plot
		.append("g")
		.selectAll(".row")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "row")
		.attr("transform", (d, i) => `translate(0,${yScale(i)})`);

	let column = row
		.selectAll(".square")
		.data(function (d) {
			return d;
		})
		.enter()
		.append("rect")
		.attr("class", "square")
		.attr("x", (d, i) => xScale(i))
		.attr("y", 0)
		.attr("width", r)
		.attr("height", r)
		.style("fill", (d) => colorScale(d));

	plot.attr(
		"transform",
		`rotate(-90, ${width / 2}, ${height / 2})`
	);
	return { colorScale: colorScale };
}
