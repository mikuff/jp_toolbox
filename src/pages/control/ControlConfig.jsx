import {Card, Tabs} from 'antd';

import CollectionTab from "./CollectionTab.jsx";
import WordTab from "./WordTab.jsx";


const items = [
    {
        key: '1',
        label: '集合',
        children: <CollectionTab />,
    },
    {
        key: '2',
        label: '单词',
        children: <WordTab />,
    },
];

const onChange = (key) => {
    console.log(key);
};

const ControlConfig = () => {
    return (
        <div className="flex w-full h-full flex-col p-4">
            <Card bordered={false} style={{width: "100%"}}>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange}/>
            </Card>
        </div>
    )
}
export default ControlConfig;