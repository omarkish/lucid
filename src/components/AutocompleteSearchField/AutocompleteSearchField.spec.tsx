import * as _ from 'lodash';
import React from 'react';
import { shallow } from 'enzyme';
import { common } from '../../util/generic-tests';
import { AutocompleteSearchFieldDumb as AutocompleteSearchField } from './AutocompleteSearchField.reducers';
import { DropMenuDumb as DropMenu } from '../DropMenu/DropMenu';

const { Option } = AutocompleteSearchField;

describe('AutocompleteSearchField', () => {
	common(AutocompleteSearchField, {
		exemptFunctionProps: ['optionFilter'] as any,
	});

	describe('render', () => {
		it('should render selections', () => {
			const wrapper = shallow(
				<AutocompleteSearchField>
					<Option>option a</Option>
					<Option>option b</Option>
					<Option>option c</Option>
				</AutocompleteSearchField>
			);

			expect(wrapper.find(DropMenu).length).toBe(1);
		});

		it('should pass `isDisabled` to `Options`', () => {
			const wrapper = shallow(
				<AutocompleteSearchField>
					<Option isDisabled>option a</Option>
					<Option>option b</Option>
					<Option>option c</Option>
				</AutocompleteSearchField>
			);
			const [first, second, third] = wrapper
				.find(DropMenu.Option)
				.map((option) => option.prop('isDisabled'));
			expect(first).toBe(true);
			expect(second).toBe(false);
			expect(third).toBe(false);
		});
	});

	describe('props', () => {
		describe('onSearch', () => {
			it('should work', () => {
				const onSearch = jest.fn();
				const wrapper: any = shallow(
					<AutocompleteSearchField onSearch={onSearch}>
						<Option callbackId={'zero'}>Zero</Option>
						<Option callbackId={'one'}>One</Option>
					</AutocompleteSearchField>
				);
				const expected = {
					event: 'fake',
					props: {
						callbackId: 'zero',
						children: 'Zero',
						isDisabled: false,
						isHidden: false,
						isWrapped: true,
					},
				};

				wrapper.find('SearchField').prop('onChange')('ero', { event: 'fake' });

				expect(onSearch).toHaveBeenCalledWith('ero', 0, expected);
			});
		});

		describe('onSelect', () => {
			it('should work when fired from the DropMenu', () => {
				const onSelect = jest.fn();
				const mockSelectionCallback = {
					event: {
						preventDefault: _.noop,
					},
					props: {},
				};

				const wrapper: any = shallow(
					<AutocompleteSearchField onSelect={onSelect}>
						<Option>option a</Option>
					</AutocompleteSearchField>
				);

				wrapper.find('DropMenu').first().prop('onSelect')(
					10,
					mockSelectionCallback
				);

				expect(onSelect).toHaveBeenCalledWith(10, mockSelectionCallback);
			});

			it('should work when selecting filtered options', () => {
				const onSelect = jest.fn();
				const mockSelectionCallback = {
					event: { stopPropagation: _.noop, preventDefault: _.noop },
					props: {},
				};

				const wrapper: any = shallow(
					<AutocompleteSearchField onSelect={onSelect}>
						<Option isHidden>option a</Option>
						<Option>option b</Option>
					</AutocompleteSearchField>
				);

				wrapper.find('DropMenu').first().prop('onSelect')(
					0,
					mockSelectionCallback
				);

				expect(onSelect).toHaveBeenCalledWith(0, mockSelectionCallback);
			});

			it('should work when fired from the selection removal ', () => {
				const onSelect = jest.fn();
				const mockSelectionCallback = {
					event: {
						preventDefault: _.noop,
					},
					props: {},
				};

				const wrapper: any = shallow(
					<AutocompleteSearchField
						onSelect={onSelect}
						onSearch={_.noop}
						selectedIndex={0}
					>
						<Option>option a</Option>
					</AutocompleteSearchField>
				);

				wrapper.find('Selection').first().prop('onRemove')(
					mockSelectionCallback
				);

				expect(onSelect).toHaveBeenCalledWith(null, mockSelectionCallback);
			});
		});

		describe('Error', () => {
			it('should apply the appropriate classNames to the saerch', () => {
				const wrapper = shallow(
					<AutocompleteSearchField Error={'Erroring out'}>
						<Option>option a</Option>
						<Option>option b</Option>
					</AutocompleteSearchField>
				);

				const searchWrapper = wrapper.find(
					'.lucid-AutocompleteSearchField-search-is-error'
				);

				expect(searchWrapper.exists()).toBeTruthy();
			});

			it('should render out the error div', () => {
				const wrapper = shallow(
					<AutocompleteSearchField Error={'Erroring out'}>
						<Option>option a</Option>
						<Option>option b</Option>
					</AutocompleteSearchField>
				);

				const searchWrapper = wrapper.find(
					'.lucid-AutocompleteSearchField-error-content'
				);

				expect(searchWrapper.text()).toEqual('Erroring out');
			});

			it('should not render the error div', () => {
				const wrapper = shallow(
					<AutocompleteSearchField Error={true}>
						<Option>option a</Option>
						<Option>option b</Option>
					</AutocompleteSearchField>
				);

				const searchWrapper = wrapper.find(
					'.lucid-AutocompleteSearchField-search-is-error'
				);
				const errorWrapper = wrapper.find(
					'.lucid-AutocompleteSearchField-error-content'
				);
				expect(errorWrapper.exists()).toBeFalsy();
				expect(searchWrapper).toBeTruthy();
			});
		});
	});

	describe('custom formatting', () => {
		it('should render Option child function by passing in {searchText}, setting filterText on each option and using a custom optionFilter', () => {
			const optionFilter = (searchText: any, { filterText }: any) => {
				if (filterText) {
					return new RegExp(_.escapeRegExp(searchText), 'i').test(filterText);
				}
				return true;
			};

			expect(
				shallow(
					<AutocompleteSearchField optionFilter={optionFilter} searchText='tion'>
						<Option name='OptionA' Selected='option a' filterText='option a'>
							{({ searchText }: any) => (
								<div style={{ display: 'flex' }}>
									<div style={{ width: 100 }}>{searchText}</div>
									<div>option a</div>
								</div>
							)}
						</Option>
						<Option name='OptionB' Selected='option b' filterText='option b'>
							{({ searchText }: any) => (
								<div style={{ display: 'flex' }}>
									<div style={{ width: 100 }}>{searchText}</div>
									<div>option b</div>
								</div>
							)}
						</Option>
						<Option name='OptionC' Selected='option c' filterText='option c'>
							{({ searchText }: any) => (
								<div style={{ display: 'flex' }}>
									<div style={{ width: 100 }}>{searchText}</div>
									<div>option c</div>
								</div>
							)}
						</Option>
					</AutocompleteSearchField>
				)
			).toMatchSnapshot();
		});
	});
});
