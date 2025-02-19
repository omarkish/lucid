import _ from 'lodash';
import React from 'react';
import createClass from 'create-react-class';
import { Lines, d3Scale, chartConstants } from './../../index';

export default {
	title: 'Visualizations/Lines',
	component: Lines,
	parameters: {
		docs: {
			description: {
				component: (Lines as any).peek.description,
			},
		},
	},
};

/* Default */
export const Default = () => {
	const width = 800;
	const height = 400;

	const data = [
		{ x: 'one', y0: 20, y1: 18, y2: 16, y3: 14, y4: 12, y5: 10, y6: 8 },
		{ x: 'two', y0: 2, y1: 3, y2: 4, y3: 6, y4: 8, y5: 9, y6: 6 },
		{ x: 'three', y0: 2, y1: 4, y2: 5, y3: 6, y4: 9, y5: 10, y6: 3 },
		{ x: 'four', y0: 3, y1: 6, y2: 7, y3: 7, y4: 7, y5: 4, y6: 2 },
		{ x: 'five', y0: 4, y1: 8, y2: 9, y3: 8, y4: 5, y5: 4, y6: 3 },
		{ x: 'six', y0: 20, y1: 18, y2: 16, y3: 14, y4: 12, y5: 10, y6: 8 },
	];

	const yFields = ['y0', 'y1', 'y2', 'y3', 'y4', 'y5', 'y6'];
	const yMax: any = _.max(
		_.reduce(
			yFields,
			(acc, field) => {
				return acc.concat(_.map(data, field) as any);
			},
			[]
		)
	);

	const xScale = d3Scale
		.scalePoint()
		.domain(_.map(data, 'x'))
		.range([0, width]);

	const yScale = d3Scale.scaleLinear().domain([0, yMax]).range([height, 0]);

	const Component = createClass({
		render() {
			return (
				<div>
					<svg width={width} height={height}>
						<Lines
							data={data}
							xScale={xScale}
							yScale={yScale}
							yFields={yFields}
						/>
					</svg>

					<svg width={width} height={height}>
						<Lines
							data={data}
							xScale={xScale}
							yScale={yScale}
							yFields={yFields}
							isStacked={true}
						/>
					</svg>
				</div>
			);
		},
	});

	return <Component />;
};
Default.storyName = 'Default';

/* Custom Colors */
export const CustomColors = () => {
	/* eslint-disable comma-spacing */

	const width = 1000;
	const height = 400;

	const data = [
		{ x: 'one', y0: 1, y1: 2, y2: 3, y3: 5 },
		{ x: 'two', y0: 2, y1: 3, y2: 4, y3: 6 },
		{ x: 'three', y0: 2, y1: 4, y2: 5, y3: 6 },
		{ x: 'four', y0: 3, y1: 6, y2: 7, y3: 7 },
		{ x: 'five', y0: 4, y1: 8, y2: 9, y3: 8 },
		{ x: 'six', y0: 20, y1: 8, y2: 9, y3: 1 },
	];

	const yFields = ['y0', 'y1', 'y2', 'y3'];
	const yMax: any = _.max(
		_.reduce(
			yFields,
			(acc, field) => {
				return acc.concat(_.map(data, field) as any);
			},
			[]
		)
	);

	const xScale = d3Scale
		.scalePoint()
		.domain(_.map(data, 'x'))
		.range([0, width]);

	const yScale = d3Scale.scaleLinear().domain([0, yMax]).range([height, 0]);

	const Component = createClass({
		render() {
			return (
				<div>
					<svg width={width} height={height}>
						<Lines
							data={data}
							xScale={xScale}
							yScale={yScale}
							yFields={yFields}
							colorMap={{
								y0: chartConstants.COLOR_BAD,
								y1: chartConstants.COLOR_GOOD,
								y2: '#ff8800',
								y3: '#abc123',
							}}
						/>
					</svg>
				</div>
			);
		},
	});

	return <Component />;
};
CustomColors.storyName = 'CustomColors';
