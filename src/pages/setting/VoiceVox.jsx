import {useEffect, useState} from "react";
import {Button, Card, Input, message, Space} from "antd";
import {getInfo, loadInfo, playText, playUrl, setSelectSpeaker} from "../../utils/VoiceVoxUtil";

const VoiceVox = () => {
    const [refresh, setRefresh] = useState(false);
    const [speaker, setSpeaker] = useState({
        speaker_info: [], voicevox_host: "", speaker_id: "", speaker_name: "",
    });

    const [showTab, setShowTab] = useState({portrait: "", style_infos: []});
    const [testText, setTestText] = useState("");

    useEffect(() => {
        const initializeSpeaker = async () => {
            const initialData = await getInfo();
            setSpeaker(initialData);
            updateShowTab(initialData);
        };
        initializeSpeaker();
    }, [refresh]);

    const updateShowTab = (initialData) => {
        if (initialData.speaker_id != null) {
            const currentSpeaker = initialData.speaker_info.find((el) => el.styles.some((style) => style.id === initialData.speaker_id));
            if (currentSpeaker) {
                setShowTab({
                    portrait: currentSpeaker.info.portrait, style_infos: currentSpeaker.info.style_infos,
                });
            }
        }
    };

    const loadVoiceInfo = async () => {
        const speakerInfo = await loadInfo(speaker.voicevox_host);
        if (speakerInfo.speaker_info?.length) {
            message.success("加载数据成功，当前角色已清空，请重新选择角色");
            setSpeaker(speakerInfo);
        } else {
            message.error("加载数据失败，请检查: " + speaker.voicevox_host);
        }
    };

    const handleHostChange = (e) => {
        setSpeaker((prev) => ({...prev, voicevox_host: e.target.value.trim()}));
    };

    const handleSpeakerClick = (item) => {
        setShowTab(item.info);
    };

    const handleSelectSpeaker = async (item) => {
        const speaker_name = `${item.parent.name}/${item.name_info.name}`;
        const success = await setSelectSpeaker(item.id, speaker_name);
        message.success(success ? `设置成功，当前设置为 ${speaker_name}` : "设置失败");
        if (success) setRefresh(!refresh);
    };

    const handleTestSpeak = async () => {
        if (testText) {
            await playText(testText);
        } else {
            message.error("请输入测试语音文本");
        }
    };

    return (<div className="flex w-full h-full flex-col p-0">
        <Space direction="vertical" size="middle" style={{display: "flex"}}>
            <Card title="voicevox设置" bordered={false} style={{width: "100%"}}>
                <Space size="middle">
                    <Input
                        allowClear
                        size="small"
                        className="w-[20rem]"
                        placeholder="引擎地址"
                        value={speaker.voicevox_host}
                        onChange={handleHostChange}
                    />
                    <Button size="small" type="dashed" onClick={loadVoiceInfo}>
                        加载
                    </Button>
                    <Input
                        allowClear
                        size="small"
                        className="w-[20rem]"
                        placeholder="测试语音"
                        value={testText}
                        onChange={(e) => setTestText(e.target.value.trim())}
                    />
                    <Button size="small" type="dashed" onClick={handleTestSpeak}>
                        测试语音
                    </Button>
                    <span>当前角色为：{speaker.speaker_name || "未设置"}</span>
                </Space>

                {speaker.speaker_info == null ? (
                    <div className="flex w-full h-[30rem] border mt-4" style={{width: "100%"}}>
                        <div className="w-full h-full p-2 text-center text-sm overflow-y-scroll text-red-600 ">
                            请先设置引擎地址并完成加载
                        </div>
                    </div>
                    ) : (
                    <div className="flex w-full h-[30rem] border mt-4">
                    <ul className="w-[15rem] h-full p-2 text-center text-sm overflow-y-scroll">
                        {speaker.speaker_info.map((item) => (<li
                            key={item.name}
                            className="pt-2 pb-2 text-slate-300 hover:text-slate-950 cursor-pointer"
                            onClick={() => handleSpeakerClick(item)}
                        >
                            {item.name}
                        </li>))}
                    </ul>
                    <div className="flex w-full h-full">
                        <div className="w-[20rem] h-full">
                            {
                                showTab.portrait && <img src={showTab.portrait} alt="Speaker Portrait"/>
                            }
                        </div>
                        <div className="flex flex-wrap w-full h-full p-4  content-start">
                            {showTab.style_infos.map((item) => (
                                <div key={item.id} className="flex h-[6rem] w-[10rem] border mr-4 mb-4">
                                    <img
                                        className="w-[6rem] cursor-pointer"
                                        src={item.icon}
                                        alt="Style Icon"
                                        onClick={() => handleSelectSpeaker(item)}
                                        style={{
                                            boxShadow: item.id === speaker.speaker_id ? "0 0 10px rgba(0, 0, 0, 0.2)" : "none",
                                            transition: "box-shadow 0.3s ease",
                                        }}
                                    />
                                    <div className="w-[4rem] flex flex-col text-center justify-between pt-4 pb-4">
                                        {item.voice_samples.map((voiceItem, voiceIndex) => (<p
                                            key={voiceIndex}
                                            className="text-slate-300 hover:text-slate-950 cursor-pointer"
                                            onClick={() => playUrl(voiceItem)}
                                        >
                                            例句
                                        </p>))}
                                    </div>
                                </div>))}
                        </div>
                    </div>
                </div>
                )}
            </Card>
        </Space>
    </div>);
};

export default VoiceVox;
