import React from 'react';
import createClass from 'create-react-class';
import { Resizer } from './../../index';

export default {
	title: 'Utility/Resizer',
	component: Resizer,
	parameters: {
		docs: {
			description: {
				component: (Resizer as any).peek.description,
			},
		},
	},
};

/* Default */
export const Default = () => {
	const Component = createClass({
		render() {
			return (
				<Resizer>
					{(width, height) => (
						<div>
							<div>Width: {width}</div>
							<div>Height: {height}</div>
						</div>
					)}
				</Resizer>
			);
		},
	});

	return <Component />;
};
Default.storyName = 'Default';

/* With Flex */
export const WithFlex = () => {
	const Component = createClass({
		render() {
			return (
				<div
					style={{
						display: 'flex',
					}}
				>
					<div>Other content</div>

					<Resizer
						style={{
							flexGrow: 1,
							overflow: 'hidden',
						}}
					>
						{(width) => (
							<div
								style={{
									width,
									height: width * 0.3,
									border: '1px solid black',
								}}
							>
								<div>
									When using Resizer within a flexed container, its critical to
									add <code>flexGrow: 1, overflow: 'hidden'</code> to its styles
									so it will behave correctly.
								</div>
								<div>Width: {width}</div>
								<div>Height: {width * 0.3}</div>
							</div>
						)}
					</Resizer>
				</div>
			);
		},
	});

	return <Component />;
};
WithFlex.storyName = 'WithFlex';
