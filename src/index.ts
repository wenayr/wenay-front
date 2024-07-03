import {StartReact} from "./front";
import {Cash} from "./utils/sis";


window.onload = async function() {
    await Cash.load()
    console.log("2321312");
    StartReact()

}


