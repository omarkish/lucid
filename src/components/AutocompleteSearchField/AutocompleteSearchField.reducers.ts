import * as DropMenu from '../DropMenu/DropMenu.reducers';
import SearchField from '../SearchField/SearchField.reducers';
import { IAutocompleteSearchFieldState } from './AutocompleteSearchField';

export function onSelect(
	state: IAutocompleteSearchFieldState,
	selectedIndex: number | null
) {
	return {
		...state,
		selectedIndex,
	};
}

export function onSearch(
	state: IAutocompleteSearchFieldState,
	searchText: string,
	firstVisibleIndex: number
) {
	return {
		...state,
		searchText,
		DropMenu: {
			...DropMenu.onFocusOption(state.DropMenu, firstVisibleIndex),
		},
	};
}

export { DropMenu, SearchField };
