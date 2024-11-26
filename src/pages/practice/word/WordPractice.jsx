import {Button, Card, message, Progress, Select, Space, Switch} from "antd";
import WordCard from "./WordCard.jsx";
import {useEffect, useState} from "react";
import {fetchCollection, fetchWord} from '../../../utils/Word.js';

const WordPractice = () => {

    const modelSelectOption = [{value: "1", label: "预览"}, {value: "2", label: "学习"}, {
        value: "3", label: "日转中"
    }, {value: "4", label: "中转日"}];

    const [collections, setCollections] = useState([]);
    const [option, setOption] = useState({sentence: false, extend: false, play: false, asc: false, model: "1"});
    const [wordData, setWordData] = useState({collectionId: "", data: [], active: {}, activeIndex: 0});
    const [toggle, setToggle] = useState(true);

    useEffect(() => {
        fetchCollectionOptions();
    });

    const fetchCollectionOptions = async () => {
        const collections = await fetchCollection();
        setCollections(collections);
    };

    const fetchWordData = async () => {
        const ret = await fetchWord(1, 3000, wordData.collectionId);
        return ret.data;
    }

    // 控制面板相关方法
    const togglePracticeHandler = async () => {
        if (toggle) {
            await startPracticeHandler()
        } else {
            await resetPracticeHandler();
        }
    }
    const resetPracticeHandler = () => {
        setOption({...option, sentence: false, extend: false, play: false, asc: false, model: "1"});
        setWordData({...wordData, collectionId: "", data: [], active: {}, activeIndex: 0});
        setToggle(true);
    }

    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);


    const startPracticeHandler = async () => {
        if (wordData.collectionId == "") {
            message.error("请先选择集合");
            return;
        }
        const list = await fetchWordData();
        if (list.length == 0) {
            message.error("该集合无数据,请选择其他集合");
        }
        setWordData({...wordData, data: (option.asc ? list : shuffleArray(list)), active: list[wordData.activeIndex]})
        setToggle(false);
    }

    // 切换
    const preOrNexHandler = (type) => {
        if (type == "pre" && wordData.activeIndex > 0) {
            const index = wordData.activeIndex - 1;
            setWordData({...wordData, active: wordData.data[index], activeIndex: index});
            return;
        }
        if (type == "next" && wordData.activeIndex < wordData.data.length - 1) {
            const index = wordData.activeIndex + 1;
            setWordData({...wordData, active: wordData.data[index], activeIndex: index});
        } else {
            message.success("本次练习完成!")
            resetPracticeHandler()
        }
    }

    return (<div className="flex w-full h-full items-center p-4 justify-between">
        <div className="w-full h-full flex">
            <div className="flex w-full h-full ">
                <div className="flex w-full h-full flex-col justify-between">
                    <div className="flex w-full h-[4rem] justify-end">
                        <div className="w-[45rem] h-full  bg-white rounded-xl p-4 shadow-lg">
                            <Space>
                                <Select className="w-[10rem]" placeholder="选择模式" disabled={!toggle}
                                        value={option.model}
                                        options={modelSelectOption}
                                        onChange={(value) => setOption({...option, model: value})}
                                />
                                <Select className="w-[10rem]" placeholder="选择集合" disabled={!toggle} allowClear
                                        value={wordData.collectionId}
                                        onChange={(value) => setWordData({...wordData, collectionId: value})}>
                                    {collections.map((col) => (<Select.Option key={col.id} value={col.id}>
                                        {col.name}
                                    </Select.Option>))}
                                </Select>
                                <Switch checkedChildren="读音" unCheckedChildren="静音" disabled={!toggle}
                                        value={option.play}
                                        onClick={(checked) => setOption({...option, play: checked})}/>
                                <Switch checkedChildren="乱序" unCheckedChildren="顺序" disabled={!toggle}
                                        value={option.asc}
                                        onClick={(checked) => setOption({...option, asc: checked})}/>
                                <Switch checkedChildren="例句" unCheckedChildren="无例句" disabled={!toggle}
                                        value={option.sentence}
                                        onClick={(checked) => setOption({...option, sentence: checked})}/>
                                <Switch checkedChildren="扩展" unCheckedChildren="无扩展" disabled={!toggle}
                                        value={option.extend}
                                        onClick={(checked) => setOption({...option, extend: checked})}/>
                                <Button type="dashed" onClick={togglePracticeHandler}>
                                    {toggle ? "开始" : "重置"}
                                </Button>
                            </Space>
                        </div>
                    </div>
                    <div className="flex w-full h-full flex-col items-center justify-center">
                        {Object.keys(wordData.active).length > 0 &&
                            <WordCard data={wordData.active} model={option.model} play={option.play}
                                      nextHandler={() => preOrNexHandler("next")}/>}

                        {(Object.keys(wordData.active).length > 0 && option.model == "1") &&
                            <div className="h-[3rem] w-full flex justify-around mt-4 ">
                                <div
                                    className="w-[8rem] h-[2rem] bg-white/50 text-center rounded-full text-xl font-medium text-gray leading-[2rem] hover:bg-white"
                                    onClick={() => preOrNexHandler("pre")}
                                >&lt;</div>
                                <div
                                    className="w-[8rem] h-[2rem] bg-white/50 text-center rounded-full text-xl font-medium text-gray leading-[2rem] hover:bg-white"
                                    onClick={() => preOrNexHandler("next")}
                                >&gt;</div>
                            </div>}
                        {Object.keys(wordData.active).length == 0 && <p>
                            请先完成选项
                        </p>}

                    </div>

                    <div className="flex w-full h-[4rem] justify-center">
                        <Progress className="w-[30rem]"
                                  percent={wordData.activeIndex == 0 ? 0 : (wordData.activeIndex == wordData.data.length - 1 ? 100 : wordData.activeIndex + 1 / wordData.data.length)}
                                  status="active"
                                  strokeColor="#E6F4FF"
                                  size="small"
                                  trailColor="white"
                                  showInfo={false}/>
                    </div>
                </div>
            </div>
        </div>
        {(option.extend || option.sentence) && <div className="w-[30rem] h-full pl-4 flex flex-col">
            {option.sentence && <div className="h-full w-full p-[0.5rem]">
                <Card className="w-full h-full">
                    例句
                </Card>
            </div>}
            {option.extend && <div className="h-full w-full p-[0.5rem]">
                <Card className="w-full h-full">
                    扩展
                </Card>
            </div>}
        </div>}

    </div>)
}
export default WordPractice;