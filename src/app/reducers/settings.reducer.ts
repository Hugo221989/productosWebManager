import * as SettingsActions from '../settings/settings.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { SettingsState } from '../settings/settings.models';


export const initialState: SettingsState = {
    currentLanguage: null
}

const reducer = createReducer( 
    initialState, 
    on(SettingsActions.actionSettingsCurrentLanguage,
        (state, action) => ({...state, ...action}) )
)

export function settingsReducer(
    state: SettingsState | undefined,
    action: Action
){
    return reducer(state, action);
}