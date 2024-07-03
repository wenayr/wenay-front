import React from "react";
import {Button, ButtonAbs, StyleOtherColum} from "../components/commonNew/commonFuncReact";
import {FMenuRBase, tMenuReact, tMenuReactStrictly} from "../components/common/miniMenu";
import {Cash, staticGetAdd} from "../../utils/sis";
import {renderBy, updateBy} from "../updateBy";
import {mouse, MouseR} from "../components/other/mouse";
import {PageTester} from "./pageTester";
import {pageLoader} from "./pageLoader";
import {PageAdmin} from "./pageAdmin";
import {MessageEventLogs, PageLogs2} from "../components/other/logs";
import {DivRnd} from "../components/commonNew/RNDFunc";
import {ClientPage} from "../components/clientPage/main";

type ty = {name: string, key: string, page: (a?: any) => React.JSX.Element | null}

const defPageBase = {
    keyPage: "main1"
}

const pages: ty[] = [
    {name: "tester", key: "PageLoader", page: PageTester},
    {name: "admin", key: "PageAdmin", page: PageAdmin},
    {name: "loader", key: "PageTest", page: pageLoader},
    {name: "null", key: "null", page: ()=> null},
    {name: "client", key :"PageClient", page: ClientPage}
    // {name: "client", key :"PageClient", page: ClientPage}
]


const eMenu: tMenuReact[] = [
    {name: "base", next: ()=> [
            {name: "base1", onClick: ()=> {
                }},
            {name: "base2", onClick: ()=> {
                }},
        ]}
];


const eMenu2: tMenuReact[] = [
    {name: "cash", next: ()=> [
            {name: "load", onClick: ()=> {
                    Cash.load().then(()=>{
                        Cash.getArr.forEach(([k,v])=>{
                            v.forEach(e=> renderBy(e))
                        })
                    })
                }},
            {name: "save", onClick: ()=> {
                    Cash.save()
                }},
            {name: "clean", onClick: ()=> {
                    Cash.clean()
                }},
        ]},
    {
        name: (a) => "mouse " + a,
        getStatus: ()=> staticGetAdd(mouse.name, mouse.value).status? "on" : "off",
        onClick: ()=> {
            const datum = staticGetAdd(mouse.name, mouse.value)
            datum.status = !datum.status
            renderBy(datum)
        }},
];


export function Main() {

    const datum = staticGetAdd("pageBase",defPageBase)
    updateBy(datum)
    const pagesKey = new Map(pages.map(e=>[e.key, e]))
    const Page = () => pagesKey.get(datum.keyPage)?.page() ?? null // box-shadow: 0px 0px 20px 14px rgba(34, 60, 80, 0.2);


    return <div className={"maxSize"} style={{height: "100hv"}} >
        <MessageEventLogs zIndex={110}/>
        <MouseR other={eMenu} zIndex={110}>
            <div className={"maxSize"} style={{...StyleOtherColum}}>
                <div className={"borderBottom"} style={{height: 40, flex: "0 0 auto", display: "flex"}}>
                    <div style={{width: "2%"}}></div>
                    <ButtonAbs style={{width: "auto"}} button={(e)=><div className = {e ? "toButtonA" : "toButton"}>≡ menu</div>}>
                        <FMenuRBase data={eMenu2.filter(e=>!!e) as tMenuReactStrictly[]}/>
                    </ButtonAbs>
                    {
                        pages.map((e,i) => (
                            <div key = {i}
                                 onClick = {(z)=> {
                                     datum.keyPage = e.key
                                     renderBy(datum)
                                 }}
                                 className = {datum.keyPage == e.key ? "toButtonA" : "toButton"}>{e.name}</div>
                        ))
                    }
                    <Button button={(e)=><div style={{float: "right"}} className = {e ? "toButtonA" : "toButton"}>logs</div>}>
                        {(api) => <DivRnd keyForSave={"logs"}
                                          size={{height: 300, width: 300}}
                                          className={"fon border fonLight"}
                                          moveOnlyHeader={true}
                                          onCLickClose={api.onClose}
                                          onUpdate={() => {
                                          }}
                        >
                            {(update) => <div className={"maxSize fon"} key={22}>
                                <PageLogs2 update={update} key={23}/>
                            </div>}
                        </DivRnd>}
                    </Button>
                </div>
                <Page key = {datum.keyPage}></Page>
            </div>
        </MouseR>
    </div>
}