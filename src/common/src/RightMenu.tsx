import {useState, useRef, useEffect, FC, JSX, useMemo} from 'react';
import {DivOutsideClick} from "./commonFuncReact";
import {GetModalFuncJSX} from "./modal";
import {sleepAsync} from "wenay-common";
import {Drag22} from "./RNDFunc3";
import {Position, useDraggable} from "./use_draggable_hook";

type MenuElement = {
    label: string;
    subMenuContent: () => JSX.Element;
};

// Добавляем тип для пропса position
type DropdownMenuProps = {
    elements: MenuElement[];
    style?: React.CSSProperties;
    position?: 'left' | 'right'; // Новый параметр
};

export function DropdownMenu({elements, style, position: p = 'right'}: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [select, setSelect] = useState<number|null>(null);
    const data = useRef({m1: false, m2: false});
    const jsx = useMemo(GetModalFuncJSX,[])
    const jsxRender = useMemo(()=><jsx.Render/>,[jsx])
    const [position, setPosition] = useState(p)
    const [down, setDown] = useState(true)

    const handleDragEnd = (finalPosition: Position) => {
        if (position == "left") {
            if (finalPosition.x > window.innerWidth * 0.6) {
                setPosition("right")
            }
        }
        if (position == "right") {
            if (finalPosition.x < window.innerWidth * 0.4) {
                setPosition("left")
            }
        }
        // if (down) {
        //     console.log(finalPosition.y, window.innerHeight)
        //     if (finalPosition.y > window.innerHeight * 0.6) {
        //         setDown(false)
        //     }
        // } else {
        //     if (finalPosition.y < window.innerHeight * 0.4) {
        //         setDown(true)
        //     }
        // }
    };

    const {position: pos, dragProps} = useDraggable(0,0, 500, handleDragEnd)

    const handleClickOutside = () => {
        setIsOpen(false);
        setIsFixed(false);
    };

    const handleToggle = () => {
        setIsFixed(p => !p);
        setIsOpen(p => !p);
    };

    const handleSelect = (item: MenuElement, index: number) => {
        jsx.set(item.subMenuContent)
        setSelect(index)
    };
    const dop = (isFixed || isOpen) && (
            <div
                onMouseLeave={() => {
                    data.current.m1 = false
                    jsx.set(null)
                    setSelect(null)
                }}
                onMouseEnter={()=>{
                    data.current.m1 = true
                }}
                className="dropdown-content2"
                style={{
                    display: 'flex',
                    // Меняем направление в зависимости от позиции
                    [position]: 0,
                    right: position === 'left' ? 'auto' : 0,
                    flexDirection: position === 'left' ? 'row' : 'row-reverse'
                }}>
                <div className="dropdown-content"
                     onMouseLeave={async () => {
                         data.current.m1 = false
                         await sleepAsync(50)
                         if (!data.current.m2 && !data.current.m1) {
                             jsx.set(null)
                             setSelect(null)
                         }
                     }}
                     onMouseEnter={()=>{
                         data.current.m1 = true
                     }}
                >
                    {elements.map((item, index) => (
                        <div
                            key={index}
                            className={"menu-item" + (select === index ? " force-hover" : "")}
                            onMouseEnter={() => handleSelect(item, index)}
                            onClick={() => handleSelect(item, index)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
                <div
                    onMouseEnter={()=>{
                        data.current.m2 = true
                    }}
                    onMouseLeave={async ()=>{
                        data.current.m2 = false
                        await sleepAsync(50)
                        if (!data.current.m2 && !data.current.m1) {
                            jsx.set(null)
                            setSelect(null)
                        }
                    }}
                >
                    {jsx.JSX ? <div className="submenu" style={{width: '40vw', minHeight: '70vh'}}>{jsxRender}</div> : null}
                </div>
            </div>
        )

    return (
        <DivOutsideClick
            outsideClick={handleClickOutside}
            className={"menu-container" + (isFixed ? " activeM" : "")}
            style={{
                ...style,
                display: 'flex',
                // Добавляем выравнивание для позиционирования
                // [position]: 0,
                ...(p === 'left'? {
                    left: pos.x < 0 ? 0 : pos.x > window.innerWidth - 50 ? window.innerWidth - 50 : pos.x,
                    right: 'auto'
                } : {
                    right: -pos.x < 0 ? 0 : -pos.x > window.innerWidth - 50 ? window.innerWidth - 50 : -pos.x,//   ,
                    left: 'auto'
                }),
                top: pos.y < 0 ? 0 : pos.y > window.innerHeight - 50 ? window.innerHeight - 50 : pos.y,
            }}
            onMouseEnter={() => !isFixed && setIsOpen(true)}
            onMouseLeave={() => !isFixed && setIsOpen(false)}
        >
            {/*{!down && dop}*/}
            <div
                {...dragProps}
                className="menu-button"
                onClick={handleToggle}
            >
                ☰
            </div>
            {dop}
        </DivOutsideClick>
    );
};
export function MenuRightApi() {
    const elements: MenuElement[] = []
    let render: null|(React.Dispatch<React.SetStateAction<MenuElement[]>>) = null
    return {
        set(array: MenuElement[]){
            const el = array.filter(e=>elements.indexOf(e) === -1)
            if (el.length === 0) return
            elements.push(...el)
            render?.(elements)
        },
        delete(array: MenuElement[]){
            array.forEach(e=>elements.splice(elements.indexOf(e), 1))
        },
        get(){return elements},
        Render({style}:{style?: React.CSSProperties}){
            const [el, setEl] = useState(elements)
            useEffect(() => {
                render = setEl
                return ()=> {
                    render = null
                }
            }, []);
            return <DropdownMenu elements={el} style={style} position='left'/>
        }
    }
}

export function DropdownMenuTest() {
    const testData: MenuElement[] = [
        {label: "Item 1", subMenuContent: () => <SubMenu/>},
        {label: "Item 2", subMenuContent: () => <SubMenu2/>},
        {label: "Item 3", subMenuContent: () => <SubMenu/>}
    ]
    const menu = useMemo(MenuRightApi,[]);
    useEffect(() => {
        menu.set(testData)
    }, []);

    return <menu.Render/>
}


const SubMenu = () => {
    return (
        <div className="maxSize">
            <div className="submenu-item">Subitem 1</div>
            <div className="submenu-item">Subitem 2</div>
            <div className="submenu-item">Subitem 3</div>
        </div>
    );
};

const SubMenu2 = () => {
    return (
        <div>
            <div className="submenu-item">Subitem 33331</div>
            <div className="submenu-item">Subitem 33332</div>
            <div className="submenu-item">Subitem 33333</div>
        </div>
    );
};
