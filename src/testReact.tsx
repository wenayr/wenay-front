import {createRoot} from "react-dom/client";

export function Test() {
    return <div>123

    </div>
}
function GeneralInit(pare:HTMLElement){
    const root = createRoot(pare!); // createRoot(container!) if you use TypeScript
    root.render(<Test />)
}


export function TestReact(){
    document.body.style.margin = '0'

    const buf = document.createElement("project");
    buf.style.width = '100%';
    buf.style.height = '100%';
    document.body.appendChild(buf)

    GeneralInit(buf)
}

