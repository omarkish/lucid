import { Selection } from 'd3-selection';
import _ from 'lodash';
import * as d3Array from 'd3-array';
import ReactDOM from 'react-dom';

export type IXAxisRenderProp = (xValue: string) => JSX.Element;
type ISelection = Selection<SVGElement | any, {} | any, null, undefined | any>;

const setLineAttributes = (
	selection: any,
	orientation: any,
	range: [number, number]
) => {
	const [min, max] = range;

	selection
		.attr('x1', min)
		.attr('x2', max)
		.attr('y1', 0)
		.attr('y2', 0);
};

const getGroup = (selection: ISelection, className: string): ISelection => {
	const xAxisGroup = selection.select(`.${className}`);
	if (xAxisGroup.empty()) {
		return selection.append('g').classed(className, true);
	}
	return xAxisGroup;
};
const getGroups = (
	selection: ISelection,
	className: string,
	dataset: any
): ISelection => {
	const selectionGroup = selection.selectAll(`.${className}`);
	if (selectionGroup.empty()) {
		const xAxisGroup = selectionGroup.data(dataset).order();
		return xAxisGroup
			.enter()
			.append('g')
			.classed(className, true);
	}
	return selectionGroup;
};

const getTickObj = (selection: ISelection): ISelection => {
	let data = selection.selectAll('.innerDiv');
	if (data.empty()) {
		data = selection
			.selectAll('foreignObject')
			.append('xhtml:div')
			.style('transform', 'translate(0px, -50px)')
			.classed('innerDiv', true);
	}
	return data;
};

const getTickRender = (
	selection: ISelection,
	containerWidth: number
): ISelection => {
	const tickRender = selection.selectAll('.tickRender');
	if (!tickRender.empty()) {
		tickRender.remove();
	}
	return selection
		.append('xhtml:div')
		.style('width', `${containerWidth}px`)
		.attr('id', (d: any) => d)
		.classed('tickRender', true);
};

const getLines = (
	selection: ISelection,
	xScale: any,
	tickSize: number
): ISelection => {
	const lines = selection.selectAll('line');
	if (lines.empty()) {
		return selection
			.append('line')
			.attr('x1', 0)
			.attr('x2', 0)
			.attr('y1', 0)
			.attr('y2', -tickSize || 5);
	}
	return lines;
};

const getForeignObject = (selection: ISelection): ISelection => {
	const fO = selection.selectAll('foreignObject');
	if (fO.empty()) {
		return selection
			.append('foreignObject')
			.style('overflow', 'visible')
			.style('display', 'flex')
			.attr('x', 0)
			.attr('y', 0)
			.attr('height', 1)
			.attr('width', 1);
	}
	return fO;
};
const lucidXAxis = (
	selection: ISelection,
	{
		xScale,
		tickSize,
		xAxisRenderProp,
		dataIsCentered,
	}: {
		xScale: any;
		tickSize: number;
		xAxisRenderProp?: IXAxisRenderProp;
		dataIsCentered?: boolean;
	}
): void => {
	const range = xScale.range();
	const domain = xScale.domain();
	const rMin = Number(d3Array.min(range)) || 0;
	const rMax = Number(d3Array.max(range)) || 0;
	const domainLength = dataIsCentered ? domain.length - 1 : domain.length;
	const axisGroup = getGroup(selection, 'axis');
	axisGroup
		.append('line')
		.attr('stroke', 'black')
		.call(setLineAttributes, 'TOP', [rMin, rMax]);

	const xLines = getGroups(axisGroup, 'xLines', domain);
	const xLine = xLines.attr(
		'transform',
		(d: any) => `translate( ${xScale(d)}, 0)`
	);
	getLines(xLine, xScale, tickSize);
	getForeignObject(xLine);
	if (!xAxisRenderProp) {
		xLine.append('text').text((d: any) => d);
	} else {
		const tickObj = getTickObj(xLine);
		const tickRender = getTickRender(tickObj, (rMax - rMin) / domainLength);
		tickRender.html((xValue: any, num: any, node: any) => {
			if (xValue !== '' && !_.isNil(xValue)) {
				ReactDOM.render(xAxisRenderProp(xValue), node[0]);
			} else return xValue;
		});
	}
};

export { lucidXAxis, getGroup };
