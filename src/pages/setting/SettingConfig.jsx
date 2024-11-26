import VoiceVox from "./VoiceVox.jsx";
import View from "./View.jsx";
import {Space} from "antd";
import Data from "./Data.jsx";


const SettingConfig = () => {
    return (<div className="flex w-full h-full p-4 overflow-y-scroll">
        <Space direction="vertical" size="middle" className="w-full h-full">
            <View/>
            <Data />
            <VoiceVox/>
        </Space>

    </div>)
}
export default SettingConfig;