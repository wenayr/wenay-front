import React, {useEffect, useRef, useState} from "react";
import {NormalizeDouble, NormalizeDoubleAnd, Params, sleepAsync} from "wenay-common";
import {logsApi} from "../other/logs";
import {renderBy, updateBy} from "../../updateBy";
import {ParametersReact} from "../other/Parameters2";

export function DialogBuySell({
                                  getPosition,
                                  onBuy,
                                  getBalance:_getBalance,
                                  onSell,
                                  type,
                                  onRefresh,
                                  onClose,
                                  symbols,
                                  getPrice: _getPrice,
                                  onSellLimit,
                                  onBuyLimit,
                                  quoteAsset,
                                  getMultQuanto
                              }:
                                  {
                                      onClose: () => Promise<any>,
                                      getPrice: () => number,
                                      symbols: string,
                                      onSell: (coin: number) => Promise<any>,
                                      onBuy: (coin: number) => Promise<any>,
                                      onSellLimit: (coin: number, price: number) => Promise<any>,
                                      onBuyLimit: (coin: number, price: number) => Promise<any>,
                                      getBalance: () => number,
                                      getPosition: () => number,
                                      onRefresh: () => Promise<any>,
                                      type: string,
                                      quoteAsset?: string,
                                      getMultQuanto?: () => number
                                  }) {
    const getPrice = () => _getPrice() || 0
    const price = getPrice()
    const getBalance = () => {
        const r = _getBalance()
        return isNaN(r) ? 0 : r
    }
    const maxBalanceUSDT = getBalance()
    const valueUSDTDef = 0//10 < maxBalanceUSDT ? 0 : 10
    const minStepUSDT = NormalizeDoubleAnd(maxBalanceUSDT / 10000, {digitsR: 2})
    const log = (txt: string) => logsApi.addLogs({time: new Date(), var: 5, id: symbols, txt: txt})
    const logError = (txt: string, err?: any) => {
        logsApi.addLogs({time: new Date(), var: 10, id: "error " + symbols, txt: txt})}
    const usdt = {
        usdt: {
            name: quoteAsset ?? 'usdt',
            value: valueUSDTDef,
            range: {min: 0, max: maxBalanceUSDT, step: minStepUSDT}
        }
    } satisfies Params.CParams
    const coin = {
        coin: {
            name: getMultQuanto ? "contracts" : "coin",
            value: price == 0 ? 0 : valueUSDTDef / price / (getMultQuanto ? getMultQuanto() : 1),
            range: {
                min: 0,
                max: price == 0 ? 0 : NormalizeDoubleAnd(maxBalanceUSDT / price / (getMultQuanto ? getMultQuanto() : 1)),
                step: price == 0 ? 0 : getMultQuanto ? 1 : NormalizeDoubleAnd(minStepUSDT / price, {digitsR: 1})
            }
        }
    } satisfies Params.CParams
    const priceLimit = {
        price: {
            name: "price",
            value: price,
            range: {min: price * 0.5, max: price * 2, step: price / 1000}
        }
    } satisfies Params.CParams
    // const position = {position: {name: `position:\t ${getPosition()}`, value: valueUSDTDef/price, range: {min: 0, max: Math.abs(getPosition()), step: minStepUSDT / price}}} satisfies CParams
    const title = {title: ""}
    title.title = `${symbols} ${getPosition()} ( ${getPosition() * (getPrice())} ${quoteAsset ?? 'USDT'} )`
    return <div style={{
        padding: 20,
        paddingTop: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around"
    }}>
        <div style={{fontSize: "12px", position: "absolute", left: 20, top: 3}}>{type}</div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <div style={{display: "flex", fontSize: "4vh"}}>
                <div style={{paddingRight: 20}}>{`${symbols} `}</div>
                <Pr3 style={({now, last}) => ({color: +now > +last ? "#12672e" : "#692f2f"})} getData={() => getPrice()}
                     ms={300}/></div>

            <div className={"msTradeAlt msTradeActive"} onClick={async() => {
                await onRefresh()
                // datumBalances.balances = await apiClient.acc()
                // position.position.range.max = getPosition();
                // position.position.name = `position:\t ${getPosition()}`
                title.title = `${symbols} ${getPosition()} ( ${getPosition() * (getPrice())} ${quoteAsset ?? 'USDT'} )`
                // renderBy(position)
                renderBy(title)
            }}>refresh
            </div>
        </div>
        <div style={{display: "flex", fontSize: "2vh"}}>
            <div style={{paddingRight: 10}}>{`balance: `}</div>
            <Pr3 style={({now, last}) => ({color: +now > +last ? "#12672e" : "#692f2f"})}
                 getData={() => NormalizeDouble(getBalance(), 2)} ms={300}/>
            <div style={{paddingRight: 10, paddingLeft: 10}}>{` position `}</div>
            <Pr3 getData={() => getPosition()} ms={1000}/>
            (<Pr3 getData={() => NormalizeDouble(getPosition() * getPrice(), 2)} ms={1000}/> {(quoteAsset ?? 'USDT')})
        </div>

        <Pr2 update={usdt} params={usdt} onChange={e => {
            usdt.usdt = e.usdt;
            coin.coin.value = NormalizeDoubleAnd(usdt.usdt.value / getPrice() / (getMultQuanto ? getMultQuanto() : 1));
            renderBy(coin)
        }}/>
        <Pr2 update={coin} params={coin} onChange={e => {
            coin.coin = e.coin;
            usdt.usdt.value = NormalizeDoubleAnd(coin.coin.value * getPrice() * (getMultQuanto ? getMultQuanto() : 1));
            renderBy(usdt)
        }}/>
        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div className={"redButton defButton"} onClick={() => {
                onClose()
                    .then((id) => log(type + " close order - ok, close = " + id))
                    .catch((error) => logError(type + " close order - error, ", error))
            }}>close
            </div>
            <div className={"blackButton defButton"} onClick={() => {
                onBuy(coin.coin.value)
                    .then((id) => log(type + " buy order - ok, close = " + id))
                    .catch((error) => logError(type + " buy order - error, ", error))
            }}>buy
            </div>
            <div className={"blackButton defButton"} onClick={() => {
                onSell(coin.coin.value)
                    .then((id) => log(type + " sell order - ok, close = " + id))
                    .catch((error) => logError(type + " sell order - error, ", error))
            }}>sell
            </div>
        </div>
        <ParametersReact params={priceLimit} onChange={(e) => {
            priceLimit.price = e.price
        }}/>

        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div className={"blackButton defButton"} onClick={() => {
                onBuyLimit(coin.coin.value, priceLimit.price.value)
                    .then((id) => log(type + " buyLimit order - ok, close = " + id))
                    .catch((error) => logError(type + " buyLimit order - error, ", error))
            }}>buy limit
            </div>
            <div className={"blackButton defButton"} onClick={() => {
                onSellLimit(coin.coin.value, priceLimit.price.value)
                    .then((id) => log(type + " sellLimit order - ok, close = " + id))
                    .catch((error) => logError(type + " sellLimit order - error, ", error))
            }}>sell limit
            </div>
        </div>
        {/*<Pr2 update={position} params={position} onChange={e=> {position.position = e.position; }}/>*/}
        {/*<Pr update={tr}/>*/}
    </div>
}

export function DialogBuySpot({
                                  getQuoteAsset,
                                  getBaseAsset,
                                  getQuoteAssetName,
                                  getBaseAssetName,
                                  onBuy,
                                  getBalance:_getBalance,
                                  onSell,
                                  type,
                                  onRefresh,
                                  onClose,
                                  symbols,
                                  getPrice: _getPrice,
                                  onSellLimit,
                                  onBuyLimit
                              }:
                                  {
                                      onClose: () => Promise<any>,
                                      getPrice: () => number,
                                      symbols: string,
                                      onSell: (coin: number, quote:number) => Promise<any>,
                                      onBuy: (coin: number, quote:number) => Promise<any>,
                                      onSellLimit: (coin: number, price: number, quote:number) => Promise<any>,
                                      onBuyLimit: (coin: number, price: number, quote:number) => Promise<any>,
                                      getBalance: () => number,
                                      getBaseAssetName: () => string,
                                      getQuoteAssetName: () => string,
                                      getBaseAsset: () => number,
                                      getQuoteAsset: () => number,
                                      onRefresh: () => Promise<any>, type: string
                                  }) {
    const getPrice = () => _getPrice() || 0
    const price = getPrice()
    const getBalance = () => {
        const r = _getBalance()
        return isNaN(r) ? 0 : r
    }
    const maxBalanceUSDT =  getBalance()
    const valueUSDTDef = 0//10 < maxBalanceUSDT ? 0 : 10
    const minStepUSDT = NormalizeDoubleAnd(maxBalanceUSDT / 10000, {digitsR: 2})
    const log = (txt: string) => logsApi.addLogs({time: new Date(), var: 5, id: symbols, txt: txt})
    const logError = (txt: string) => logsApi.addLogs({time: new Date(), var: 10, id: "error " + symbols, txt: txt})
    const usdt = {
        usdt: {
            name: getQuoteAssetName(),
            value: valueUSDTDef,
            range: {min: 0, max: maxBalanceUSDT, step: minStepUSDT}
        }
    } satisfies Params.CParams
    const coin = {
        coin: {
            name: getBaseAssetName(),
            value: price == 0 ? 0 : valueUSDTDef / price,
            range: {
                min: 0,
                max: price == 0 ? 0 : NormalizeDoubleAnd(maxBalanceUSDT / price),
                step: price == 0 ? 0 : NormalizeDoubleAnd(minStepUSDT / price, {digitsR: 1})
            }
        }
    } satisfies Params.CParams
    const priceLimit = {
        price: {
            name: "price",
            value: price,
            range: {min: price * 0.5, max: price * 2, step: price / 1000}
        }
    } satisfies Params.CParams
    // const position = {position: {name: `position:\t ${getPosition()}`, value: valueUSDTDef/price, range: {min: 0, max: Math.abs(getPosition()), step: minStepUSDT / price}}} satisfies Params.CParams
    const title = {title: ""}
    title.title = `${symbols} ${getBaseAsset()} ${getQuoteAsset()} ( ${getBaseAsset() * (getPrice())} ${getBaseAsset()} )`
    return <div style={{
        padding: 20,
        paddingTop: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around"
    }}>
        <div style={{fontSize: "12px", position: "absolute", left: 20, top: 3}}>{type}</div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <div style={{display: "flex", fontSize: "4vh"}}>
                <div style={{paddingRight: 20}}>{`${symbols} `}</div>
                <Pr3 style={({now, last}) => ({color: +now > +last ? "#12672e" : "#692f2f"})} getData={() => getPrice()}
                     ms={300}/></div>

            <div className={"msTradeAlt msTradeActive"} onClick={async() => {
                await onRefresh()
                // datumBalances.balances = await apiClient.acc()
                // position.position.range.max = getPosition();
                // position.position.name = `position:\t ${getPosition()}`
                title.title = `${symbols} ${getBaseAsset()} ( ${getBaseAsset() * (getPrice())} ${getQuoteAssetName} )`
                // renderBy(position)
                renderBy(title)
            }}>refresh
            </div>
        </div>
        <div style={{display: "flex", fontSize: "2vh"}}>
            <div style={{paddingRight: 10}}>{`balance: `}</div>
            <Pr3 style={({now, last}) => ({color: +now > +last ? "#12672e" : "#692f2f"})}
                 getData={() => NormalizeDouble(getBalance(), 2)} ms={300}/>
            <div style={{paddingRight: 10, paddingLeft: 10}}>{` position `}</div>
            <Pr3 getData={() => getBaseAsset()} ms={1000}/>
            (<Pr3 getData={() => NormalizeDouble(getBaseAsset() * getPrice(), 2)} ms={1000}/>{getQuoteAssetName()})
        </div>

        <Pr2 update={usdt} params={usdt} onChange={e => {
            usdt.usdt = e.usdt;
            coin.coin.value = NormalizeDoubleAnd(usdt.usdt.value / getPrice());
            renderBy(coin)
        }}/>
        <Pr2 update={coin} params={coin} onChange={e => {
            coin.coin = e.coin;
            usdt.usdt.value = NormalizeDoubleAnd(coin.coin.value * getPrice());
            renderBy(usdt)
        }}/>
        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div className={"redButton defButton"} onClick={() => {
                onClose()
                    .then((id) => log(type + " close order - ok, close = " + id))
                    .catch((error) => logError(type + " close order - error, " + error))
            }}>close
            </div>
            <div className={"blackButton defButton"} onClick={() => {
                onBuy(coin.coin.value, usdt.usdt.value)
                    .then((id) => log(type + " buy order - ok, close = " + id))
                    .catch((error) => logError(type + " buy order - error, " + error))
            }}>buy
            </div>
            <div className={"blackButton defButton"} onClick={() => {
                onSell(coin.coin.value, usdt.usdt.value)
                    .then((id) => log(type + " sell order - ok, close = " + id))
                    .catch((error) => logError(type + " sell order - error, " + error))
            }}>sell
            </div>
        </div>
        <ParametersReact params={priceLimit} onChange={(e) => {
            priceLimit.price = e.price
        }}/>

        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div className={"blackButton defButton"} onClick={() => {
                onBuyLimit(coin.coin.value, priceLimit.price.value, usdt.usdt.value)
                    .then((id) => log(type + " buyLimit order - ok, close = " + id))
                    .catch((error) => log(type + " buyLimit order - error, " + error))
            }}>buy limit
            </div>
            <div className={"blackButton defButton"} onClick={() => {
                onSellLimit(coin.coin.value, priceLimit.price.value, usdt.usdt.value)
                    .then((id) => log(type + " sellLimit order - ok, close = " + id))
                    .catch((error) => log(type + " sellLimit order - error, " + error))
            }}>sell limit
            </div>
        </div>
        {/*<Pr2 update={position} params={position} onChange={e=> {position.position = e.position; }}/>*/}
        {/*<Pr update={tr}/>*/}
    </div>
}

export function DialogBorrow({onBorrow, getMaxBorrow, getPrice, symbols, onRepay, type, borrowed, formula}:
                                 {
                                     getMaxBorrow: () => Promise<number>,
                                     borrowed: () => number,
                                     getPrice: () => number,
                                     symbols: string,
                                     onBorrow?: (amount: number | string) => Promise<any>,
                                     onRepay?: (coin: number | string) => Promise<any>,
                                     type: string,
                                     formula?: {
                                         usdtToCoin: (coin: number) => number,
                                         coinToUsdt: (usdt: number) => number
                                     }
                                 }
) {
    const price = getPrice() ?? 0
    let maxB = 0
    useEffect(() => {
        getMaxBorrow().then(e => {
            maxB = NormalizeDoubleAnd(+e)
            usdt.usdt.range.max = +e * (getPrice() ?? 0)
            coin.coin.range.max = +e
            usdt.usdt.range.step = NormalizeDoubleAnd((+e) * price / 10000, {digitsR: 1})
            coin.coin.range.step = NormalizeDoubleAnd(+e / 10000, {digitsR: 1})
            renderBy(coin)
            renderBy(usdt)
        }).catch(e => {
        })
    }, [true])
    const valueUSDTDef = 0 //< maxBalanceUSDT ? 0 : 10
    const minStepUSDT = 0//0.01
    const log = (txt: string) => logsApi.addLogs({time: new Date(), var: 5, id: symbols, txt: txt})
    const logError = (txt: string) => logsApi.addLogs({time: new Date(), var: 10, id: "error " + symbols, txt: txt})
    const usdt = {
        usdt: {
            name: "usdt",
            value: valueUSDTDef,
            range: {min: 0, max: maxB * price, step: minStepUSDT}
        }
    } satisfies Params.CParams
    const coin = {
        coin: {
            name: "coin",
            value: price == 0 ? 0 : valueUSDTDef / price,
            range: {min: 0, max: maxB, step: price == 0 ? 0 : minStepUSDT / price}
        }
    } satisfies Params.CParams
    const title = {title: ""}
    title.title = `${symbols}  `
    return <div style={{
        padding: 20,
        paddingTop: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around"
    }}>
        <div style={{fontSize: "12px", position: "absolute", left: 20, top: 3}}>{type}</div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <div style={{display: "flex", fontSize: "4vh"}}>
                <div style={{paddingRight: 20}}>{`${symbols} `}</div>
                <Pr3 style={({now, last}) => ({color: +now > +last ? "#12672e" : "#692f2f"})} getData={() => getPrice()}
                     ms={300}/></div>
        </div>
        <div style={{display: "flex", fontSize: "2vh"}}>
            <div style={{paddingRight: 10}}>{`maxBorrow: `}</div>
            <Pr3 style={({now, last}) => ({color: +now > +last ? "#12672e" : "#692f2f"})} getData={() => maxB}
                 ms={300}/>
            <div style={{paddingRight: 10, paddingLeft: 10}}>{` position `}</div>
        </div>

        <Pr2 update={usdt} params={usdt} onChange={e => {
            usdt.usdt = e.usdt;
            coin.coin.value = NormalizeDoubleAnd( formula?.usdtToCoin(usdt.usdt.value / getPrice()) ?? usdt.usdt.value / getPrice());
            renderBy(coin)
        }}/>
        <Pr2 update={coin} params={coin} onChange={e => {
            coin.coin = e.coin;
            usdt.usdt.value = NormalizeDoubleAnd(formula?.coinToUsdt(coin.coin.value * getPrice()) ?? coin.coin.value * getPrice());
            renderBy(usdt)
        }}/>
        <div style={{display: "flex", justifyContent: "space-around"}}>
            {onBorrow && <div className={"redButton defButton"} onClick={() => {
                onBorrow(coin.coin.value)
                    .then((id) => log(type + " Borrow - ok = " + id))
                    .catch((error) => log(type + " Borrow - error, " + error))
            }}>Borrow
            </div>}
            {onRepay && <div className={"blackButton defButton"} onClick={() => {
                onRepay(coin.coin.value)
                    .then((id) => log(type + " repay - ok, close = " + id))
                    .catch((error) => log(type + " repay - error, " + error))
            }}>repay
            </div>}
        </div>
    </div>
}

export function DialogOneRange({onClick, symbols, type, getPrice, getMax, getMin = () => 0, needRate=false, newLevel}:
                                 {
                                     symbols: string,
                                     getMin?: () => number,
                                     getMax: () => number,
                                     onClick?: (amount: number | string, rate?:number) => Promise<any>,
                                     type: string,
                                     getPrice?: () => number,
                                     needRate?: boolean,
                                     newLevel?: (v:number) => string
                                 }
) {
    const [min, max] = [getMin(), getMax()]
    const log = (txt: string) => logsApi.addLogs({time: new Date(), var: 5, id: symbols, txt: txt})
    const coin = useRef({
        coin: {
            name: "coin",
            value: 0,
            range: {min, max, step: NormalizeDoubleAnd((max - min) / 100, {digitsR: 1})}
        }
    } satisfies Params.CParams)

    const rate = useRef({
        rate: {
            name: "rate %",
            value: 0.88,
            range: {min:0.88, max:499, step: 0.88}
        }
    } satisfies Params.CParams)

    const title = {title: ""}
    title.title = `${symbols}  `
    return <div style={{
        padding: 20,
        paddingTop: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around"
    }}>
        <div style={{fontSize: "12px", position: "absolute", left: 20, top: 3}}>{type}</div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{paddingRight: 20}}>{`${symbols} `}</div>
        </div>
        <div style={{display: "flex", fontSize: "2vh"}}>
            <div style={{paddingRight: 10}}>{`min: `}</div>
            <Pr3 style={({now, last}) => ({color: 'whitesmoke'})}
                 getData={()=> getMin().toString() + (getPrice ? ` (${(getMin()*getPrice()).toFixed(2)} usdt) `:'')}
                 ms={300}/>
        </div>
        <div style={{display: "flex", fontSize: "2vh"}}>
            <div style={{paddingRight: 10}}>{`max: `}</div>
            <Pr3 style={({now, last}) => ({color: 'whitesmoke'})}
                 getData={()=> getMax().toString() + (getPrice ? ` (${(getMax()*getPrice()).toFixed(2)} usdt) `: '')}
                 ms={300}/>
        </div>

        {getPrice && <div style={{display: "flex", fontSize: "2vh"}}>
            <div style={{paddingRight: 10}}>{`current: `}</div>
            <Pr3 style={({now, last}) => ({color: 'whitesmoke'})}
                 getData={()=>(coin.current.coin.value).toString() + ` (${(coin.current.coin.value*getPrice()).toFixed(2)} usdt) `}
                 ms={300}/>
        </div>}

        {newLevel && <div style={{display: "flex", fontSize: "2vh"}}>
            <div style={{paddingRight: 10}}>{`new level: `}</div>
            <Pr3 style={({now, last}) => ({color: 'whitesmoke'})}
                 getData={()=>newLevel(coin.current.coin.value)}
                 ms={300}/>
        </div>}

        <Pr2 update={coin} params={coin.current} onChange={e => {
            coin.current.coin = e.coin;
        }}/>

        {needRate && <Pr2 update={rate} params={rate.current} onChange={e => {
            rate.current.rate = e.rate;
        }}/>}

        <div style={{display: "flex", justifyContent: "space-around"}}>
            {onClick && <div className={"redButton defButton"} onClick={() => {
                onClick(coin.current.coin.value, rate.current.rate.value)
                    .then((id) => log(type + " Borrow - ok = " + id))
                    .catch((error) => log(type + " Borrow - error, " + error))
            }}>submit
            </div>}
        </div>
    </div>
}

function Pr3<T extends string | number>({getData, ms = 100, style, onEvent}: {
    getData: () => T,
    ms: number,
    onEvent?: ()=> any,
    style?: (a: {now: T, last: T}) => React.CSSProperties
}) {
    const [a, setA] = useState<{last: T, now: T} | null>(null)
    useEffect(() => {
        let tr = true
        const tr2 = async() => {
            if (tr) {
                const r = getData();
                if (!a || r != a.now) {
                    setA({now: r, last: a? a.now : r})
                    onEvent?.()
                }
                await sleepAsync(ms);
                return tr2()
            } }
        tr2()
        return ()=> {tr = false}
    })
    return style ? <div key={"12"} style={a ? style(a): undefined}>{a?.now ?? 0}</div> : <div key={"11"}>{a?.now}</div>
}

function Pr({update}: {update: {data: number}}) {
    const [a, setA] = useState(update.data)
    updateBy(update, ()=>setA(update.data))
    return <>{a}</>
}

function Pr2<T extends Params.CParams>({params, onChange, update}: {params: T, onChange: (e: T)=> void, update: any}) {
    const [a, setA] = useState<T>(params)
    updateBy(update,
        ()=> {
            setA({...update})}
    )
    return <div>
        <ParametersReact params={a} onChange={e=> {
            onChange(e)}} onExpand={(e)=>{
            // onChange(e)
        }}/>
    </div>
}


