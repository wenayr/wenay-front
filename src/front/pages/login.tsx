export function Login({onClick}: {onClick: ({pas, login})=> void}) {
    let pas = "", login =""
    return <div style={{position: "absolute", left: "30%", top: "30%", width: "40%", height: "40%"}}>
        <label>{"name"}</label>
        <input type={"text"} style={{width: "100%"}} onChange={(e) => {
            login = e.target.value ?? ""
        }}/>
        <label>{"password"}</label>
        <input type={"text"} style={{width: "100%"}} onChange={(e) => {
            pas = e.target.value ?? ""
        }}/>
        <div
            onClick={() => {
                onClick({login, pas})
            }}
        >login
        </div>
    </div>
}