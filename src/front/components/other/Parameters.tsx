//класс выбора настроек для индикатора
import React, {ReactElement} from "react";

//вид кнопки
export function FButton(name :string|ReactElement){
    return <div className="" style={{width:"100%"}}> {name}</div>
}
//стрелка для кнопки
export function FNameButton(type :boolean, name:string|ReactElement) {return FButton(<p className={"toPTextIndicator"}>{(type?"▼ ":"▶ ")+name}</p>);}

export function CParameter(props: {
    name: ReactElement | string,
    children?: React.ReactNode | readonly React.ReactNode[],
    style?: React.CSSProperties | undefined,
    enabled?: boolean
}) {
    return <div className="toLine LeftMenuParameters toIndicatorMenuButton" style={{position: "relative"}}>
        <div className="toLine" style={{width: "auto", ...props.style}}>
            {props.name}
        </div>
        <div className="toLine toRight" style={props.enabled == false ? {opacity: 0.5} : {}}>
            {props.children}
        </div>
    </div>
}

