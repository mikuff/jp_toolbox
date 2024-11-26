// 图标
import HomeIcon from "../assets/icon/Home.svg";
import {ReactComponent as SettingIcon} from "../assets/icon/Setting.svg";
import DataIcon from "../assets/icon/Data.svg";
import WordIcon from "../assets/icon/Word.svg";


import {Route, Routes, Link, useLocation} from "react-router-dom";

import SettingConfig from "./setting/SettingConfig";
import ControlConfig from "./control/ControlConfig.jsx";
import WordPractice from "./practice/word/WordPractice.jsx";
import {useEffect} from "react";

import {getView} from "../utils/ViewUtil.js";

const Menu = () => {
    const location = useLocation();
    return <div className="h-full w-[4rem] flex items-center flex-col justify-between bg-white rounded-full">
        <div className="flex w-[4rem] justify-center py-6 px-0  rounded-full">
            <img src={HomeIcon} className="h-8 w-8 cursor-pointer fill-current"/>
        </div>
        <div className="flex flex-col f-full items-center w-[4rem] justify-start py-6 px-0">
            <hr className="my-4"/>
            <Link to="/wordPractice">
                <img src={WordIcon} className="h-8 w-8 cursor-pointer fill-current"/>
            </Link>
            <hr className="my-4"/>
            <Link to="/controlConfig">
                <img src={DataIcon} className="h-8 w-8 cursor-pointer fill-current"/>
            </Link>
        </div>

        <div
            className={`flex w-[4rem] justify-center py-6 px-0 rounded-full hover:text-blue-500 ${location.pathname == '/settingConfig' ? 'text-blue-500' : 'text-gray-200'}`}>
            <Link to="/settingConfig">
                <SettingIcon className="h-8 w-8 cursor-pointer fill-current"/>
            </Link>
        </div>
    </div>
}

const IndexContent = () => {
    return <div className="h-full w-full flex items-center justify-center">
        <Routes>
            <Route path="/settingConfig" element={<SettingConfig/>}/>
            <Route path="/controlConfig" element={<ControlConfig/>}/>
            <Route path="/wordPractice" element={<WordPractice/>}/>
        </Routes>
    </div>
}

const Index = () => {
    useEffect(() => {
        const defaultBg = "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)";
        const setBgColor = async () => {
            const valueData = await getView();
            if (valueData && valueData.background && valueData.background !== "") {
                document.body.style.background = valueData.background;
            } else if (valueData && valueData.background) {
                document.body.style.backgroundColor = valueData.background;
            } else {
                // 默认的背景
                document.body.style.background = defaultBg;
            }
        };
        setBgColor();
        return () => {
            document.body.style.background = defaultBg;
        };
    }, []);



    return (<div className="flex h-lvh">
        <div className="w-[6rem] p-2 flex items-center justify-center ">
            <Menu/>
        </div>
        <div className="flex-1 p-2 flex items-center justify-center">
            <IndexContent/>
        </div>
    </div>)
}
export default Index;