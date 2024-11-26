import axios from "axios";
import {cacheAdd, cacheDel, cacheGet} from "./LocalCache";
import {message} from "antd";

// 加载系统 voicebox 设置，用于切换地址时使用
export const loadInfo = async (host) => {
    try {
        const response = await axios.get(`${host}/speakers`);
        const speakerInfo = await Promise.all(response.data.map(async (speaker) => {
            const nameMap = Object.fromEntries(speaker.styles.map((style) => [style.id, style]));

            const {data} = await axios.get(`${host}/speaker_info?speaker_uuid=${speaker.speaker_uuid}&resource_format=url`);

            data.style_infos.forEach((style) => {
                style.name_info = nameMap[style.id];
                style.parent = {
                    name: speaker.name, speaker_uuid: speaker.speaker_uuid,
                };
            });

            return {...speaker, info: data};
        }));

        await cacheDel(["speaker_info", "voicevox_host", "speaker_id", "speaker_name"]);
        await cacheAdd({
            speaker_info: speakerInfo, voicevox_host: host,
        });

        return {
            speaker_info: speakerInfo, voicevox_host: host,
        };
    } catch (error) {
        console.error("VoiceVoxUtil-loadInfo-error:", error);
        return {speaker_info: [], voicevox_host: ""};
    }
};

// 获取系统 voicebox 设置
export const getInfo = async () => {
    try {
        return await cacheGet(["speaker_info", "voicevox_host", "speaker_id", "speaker_name",]);
    } catch (error) {
        console.error("VoiceVoxUtil-getInfo-error:", error);
        return {
            speaker_info: [], voicevox_host: "", speaker_id: "", speaker_name: "",
        };
    }
};

// 设置语音角色
export const setSelectSpeaker = async (speaker_id, speaker_name) => {
    try {
        await cacheDel(["speaker_id", "speaker_name"]);
        await cacheAdd({speaker_id, speaker_name});
        return true;
    } catch (error) {
        console.error("VoiceVoxUtil-setSelectSpeaker-error:", error);
        return false;
    }
};

let audioElement = null;

export const playText = async (text) => {
    const {speaker_id, voicevox_host} = await cacheGet(["speaker_id", "voicevox_host"]);
    if (voicevox_host == null || speaker_id == null) {
        message.error("请先完成 voicevox 设置");
        return;
    }

    try {
        const queryResponse = await axios.post(`${voicevox_host}/audio_query`, null, {
            params: {
                speaker: speaker_id, text
            }
        });

        const queryData = queryResponse?.data;
        if (!queryData) throw new Error("audio_query failed");

        const synthesisResponse = await axios.post(`${voicevox_host}/synthesis`, queryData, {
            params: {speaker: speaker_id}, responseType: "blob"
        });

        const audioData = synthesisResponse?.data;
        if (!audioData) throw new Error("synthesis failed");

        playBlob(audioData);
    } catch (error) {
        console.error("VoiceVoxUtil-playText-error:", error);
        message.error("无法完成语音播放");
    }
};

const playBlob = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    audioElement = new Audio(audioUrl);
    audioElement.play().catch((error) => {
        console.error("Audio playback error:", error);
        message.error("音频播放失败");
    });
};

export const playUrl = async (audioUrl) => {
    audioElement = new Audio(audioUrl);
    try {
        await audioElement.play();
    } catch (error) {
        console.error("Audio playback error:", error);
        message.error("音频播放失败");
    }
};
