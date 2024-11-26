import {Card, message, Space} from "antd";
import {getView, setView} from "../../utils/ViewUtil";
import {useEffect, useState} from "react";

const View = () => {

    const colorOptions = ['linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)', 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)', 'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)', 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)', 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)', 'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)', 'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)', 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',];

    const [refresh, setRefresh] = useState(false);
    const [viewData, setViewData] = useState({background: ""});

    useEffect(() => {
        const initializeView = async () => {
            const initialData = await getView();
            setViewData(initialData);
        };
        initializeView();
    }, [refresh]);

    const setBackgroundHandler = async (color) => {
        const success = await setView(color);
        message.success(success ? `设置背景色成功` : "设置失败");
        if (success) {
            setRefresh(!refresh);
            window.location.reload();
        }

    }

    return (<div className="flex w-full h-full flex-col p-0 ">
        <Card title="样式设置" bordered={false} style={{width: "100%"}}>
            <Space direction="vertical" size="middle">
                <div>
                    <Space size="middle">
                        <div className="w-[3rem] h-[3rem] text-center leading-[3rem]">背景色</div>
                        {colorOptions.map((color, index) => (<div key={index}
                              style={{
                                  background: color,
                                  boxShadow: color === viewData.background ? "0 0 10px rgba(0, 0, 0, 0.2)" : "none",
                                  transition: "box-shadow 0.3s ease",
                              }}
                              className="w-[3rem] h-[3rem] rounded-full cursor-pointer" onClick={()=>setBackgroundHandler(color)}></div>))}
                    </Space>
                </div>
            </Space>
        </Card>
    </div>);
}
export default View;