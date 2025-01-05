import {CellClassParams} from "ag-grid-community";
import {
    colorSchemeDarkBlue,
    iconSetMaterial,
    provideGlobalGridOptions,
    themeAlpine
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";



// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);
export function GridStyleDefault(){
    const theme = themeAlpine
        .withPart(colorSchemeDarkBlue)
        .withPart(iconSetMaterial)
        .withParams({
            'fontFamily': 'Roboto',
            'fontSize': '12px',
            'backgroundColor' :'rgb(24,27,33)'
        });
// Mark all grids as using legacy themes
    provideGlobalGridOptions({ theme: theme});
    return {theme, provideGlobalGridOptions};
}

export const StyleGridDefault = {
    //    'color':'#1d262c',
    'fontFamily': 'Roboto',
    'fontStyle': 'normal',
    'fontWeight': '400',
    'fontSize': '12px',
    // 'paddingLeft': '1px',
    // 'paddingRight': '1px',
    // 'lineHeight': '12px',
    // 'paddingTop': '10px',
    // 'paddingBottom': '3px',
    //    'background-color': 'whitesmoke',
    'textAlign': 'center',

    // "justifyContent":'center'
}

export function StyleCSSHeadGridEdit(name: string, rules: string) {
    let style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    style.sheet?.insertRule(name + "{" + rules + "}", 0);
}

export function StyleCSSHeadGrid() {
    // уменьшаем отступы с боков для заголовков
    StyleCSSHeadGridEdit('.ag-theme-alpine-dark .ag-theme-alpine .ag-header-cell, .ag-theme-alpine-dark .ag-header-group-cell',
        "padding-left: 3px; padding-right: 3px;"
    );
    // выравнивание в заголовке по центру
    StyleCSSHeadGridEdit('.ag-header-cell-label', 'justify-content: center');
}

export type tCallFuncAgGrid<T> = (params: CellClassParams & { data: T }) => {}
