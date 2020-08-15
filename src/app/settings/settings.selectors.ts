import { createSelector, createFeatureSelector } from "@ngrx/store";
import { SettingsState } from "./settings.models";

export const selectSettingsMemorized = createFeatureSelector<SettingsState>('settingsState');

export const selectSettingsCurrentLanguage= createSelector(
    selectSettingsMemorized,
    (state: SettingsState) => state.currentLanguage
)