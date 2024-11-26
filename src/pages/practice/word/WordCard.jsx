import {Divider, Input, Popover, Progress} from "antd";
import {useEffect, useState} from "react";
import PlayIcon from "../../../assets/icon/Play.svg";
import {playText} from "../../../utils/VoiceVoxUtil.js";

// 预览
// eslint-disable-next-line react/prop-types
const PreviewWordCard = ({data, play}) => {
    // eslint-disable-next-line react/prop-types
    const {jpWord, hiragana, cnWord, partOfSpeech, tone} = data;

    useEffect(() => {
        playAudio();
    }, [data]);


    const playAudio = () => {
        if (play) {
            playText(jpWord);
        }
    }

    return (<div className="w-[30rem] h-[20rem]">
        <p className="h-[4rem] text-center text-4xl text-black leading-normal font-light">
            <ruby>{jpWord}
                {(hiragana && hiragana != "") && <rt className="mb-2">{hiragana}</rt>}
            </ruby>
        </p>
        <Divider variant="dashed" className="border-l-gray-300 m-4"/>
        <p className="text-center leading-normal">
            <span className="text-[1.5rem] text-black font-light mr-4">{cnWord}</span>
            {(tone && tone != "") && <span
                className="text-black text-[0.8rem] ml-2 p-[0.3rem] bg-white/50 rounded-full">&nbsp;{tone}&nbsp;</span>}
            {(partOfSpeech && partOfSpeech != "") && <span
                className="text-black text-[0.8rem] ml-2 p-[0.3rem] bg-white/50 rounded-full">{partOfSpeech}</span>}
            {play && <span className="text-black text-[0.8rem] ml-2 p-[0.3rem] bg-white/50 rounded-full cursor-auto">
                <img src={PlayIcon} className="h-[1rem] w-[1rem] cursor-pointer inline-block"
                     onClick={() => playAudio(jpWord)}/>
            </span>}
        </p>
        <Divider variant="dashed" className="border-l-gray-300 m-4"/>
        <Input variant="borderless" className="text-center text-2xl font-light text-gray-500"
               placeholder={jpWord} value={jpWord} disabled/>
    </div>);
}

// 学习
// eslint-disable-next-line react/prop-types
const StudyWordCard = ({data, play, nextHandler}) => {

    useEffect(() => {
        playAudio();
        setRunner({passCount: 0, check: true, inputValue: ""})
    }, [data]);

    // eslint-disable-next-line react/prop-types
    const {jpWord, hiragana, cnWord, partOfSpeech, tone} = data;
    const [runner, setRunner] = useState({passCount: 0, check: true, inputValue: ""})

    const playAudio = () => {
        if (play) {
            playText(jpWord);
        }
    }
    // 快捷键 control + enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            if (runner.inputValue == jpWord) {
                if (runner.passCount + 20 == 100) {
                    nextHandler();
                } else {
                    setRunner({passCount: runner.passCount + 20, check: true, inputValue: ""})
                    playAudio();
                }
            } else {
                setRunner({...runner, check: false})
            }
        }
    };

    return (<div className="w-[30rem] h-[20rem] flex flex-col justify-center">
        <p className="h-[4rem] text-center text-4xl text-black leading-normal font-light">
            <ruby>{jpWord}
                <rt className="mb-2">{hiragana}</rt>
            </ruby>
        </p>
        <Divider variant="dashed" className="border-l-gray-300 m-4"/>
        <p className="text-center leading-normal">
            <span className="text-[1.5rem] text-black font-light mr-4">{cnWord}</span>
            {(tone && tone != "") && <span
                className="text-black text-[0.8rem] ml-2 p-[0.3rem] bg-white/50 rounded-full">&nbsp;{tone}&nbsp;</span>}
            {(partOfSpeech && partOfSpeech != "") && <span
                className="text-black text-[0.8rem] ml-2 p-[0.3rem] bg-white/50 rounded-full">{partOfSpeech}</span>}
            {play && <span className="text-black text-[0.8rem] ml-2 p-[0.3rem] bg-white/50 rounded-full cursor-auto">
                <img src={PlayIcon} className="h-[1rem] w-[1rem] cursor-pointer inline-block"
                     onClick={() => playAudio(jpWord)}/>
            </span>}
        </p>
        <Divider variant="dashed" className="border-l-gray-300 m-4"/>
        <Input variant="borderless"
               className={`text-center text-2xl font-light ${runner.check ? 'text-gray-500' : " text-red-700"}`}
               autoFocus
               onKeyDown={(e) => handleKeyDown(e)}
               onChange={(e) => setRunner({...runner, inputValue: e.target.value})}
               value={runner.inputValue}
               placeholder={jpWord} maxLength={jpWord.length}/>

        <div className="flex justify-center mt-8">
            <Progress
                steps={5}
                percent={runner.passCount}
                strokeColor="#E6F4FF"
                trailColor="white"
                showInfo={false}
            />
        </div>
    </div>);
}

// eslint-disable-next-line react/prop-types
const PracticeWordCard = ({data, model, play, nextHandler}) => {
    // eslint-disable-next-line react/prop-types
    const {jpWord, cnWord} = data;

    const [runnerData, setRunnerData] = useState({showValue: "", expectValue: "", inputValue: ""})
    const [runner, setRunner] = useState({passCount: 0, check: true, inputValue: ""})

    const playAudio = () => {
        if (play) {
            // eslint-disable-next-line react/prop-types
            const {jpWord} = data;
            playText(jpWord);
        }
    }

    useEffect(() => {
        playAudio();
        setRunner({passCount: 0, check: true, inputValue: ""})
        // 展示日文，输入中文
        if (model == "3") {
            setRunnerData({...runnerData, showValue: jpWord, expectValue: cnWord})
        }
        // 展示中文，输入日文
        if (model == "4") {
            setRunnerData({...runnerData, showValue: cnWord, expectValue: jpWord})
        }
    }, [data]);

    // 快捷键 control + enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            if (runner.inputValue == runnerData.expectValue) {
                if (runner.passCount + 20 == 100) {
                    nextHandler();
                } else {
                    setRunner({passCount: runner.passCount + 20, check: true, inputValue: ""})
                    playAudio()
                }
            } else {
                setRunner({...runner, check: false})
            }
        }
    };

    return (<div className="w-[30rem] h-[20rem] flex flex-col justify-center">
            <p className="h-[4rem] text-center text-4xl text-black leading-normal font-light">
                <ruby>
                    {runnerData.showValue}
                </ruby>
            </p>
            <Divider variant="dashed" className="border-l-gray-300 m-4"/>
            <p className="text-center leading-normal">
                <Popover content={<div>{runnerData.expectValue}</div>} title="Title" trigger="click">
                    <span
                        className="text-black text-[0.8rem] ml-2 p-[0.3rem] bg-white/50 rounded-full cursor-pointer">答案</span>
                </Popover>

                {play &&
                    <span className="text-black text-[0.8rem] ml-2 p-[0.3rem] bg-white/50 rounded-full cursor-pointer">
                <img src={PlayIcon} className="h-[1rem] w-[1rem] cursor-pointer inline-block"
                     onClick={() => playAudio(jpWord)}/>
            </span>}
            </p>
            <Divider variant="dashed" className="border-l-gray-300 m-4"/>
            <Input variant="borderless"
                   className={`text-center text-2xl font-light ${runner.check ? 'text-gray-500' : " text-red-700"}`}
                   autoFocus
                   onKeyDown={(e) => handleKeyDown(e)}
                   onChange={(e) => setRunner({...runner, inputValue: e.target.value})}
                   value={runner.inputValue}
                   maxLength={runnerData.expectValue.length}/>

            <div className="flex justify-center mt-8">
                <Progress
                    steps={5}
                    percent={runner.passCount}
                    strokeColor="#E6F4FF"
                    trailColor="white"
                    showInfo={false}
                />
            </div>
        </div>);
}


// eslint-disable-next-line react/prop-types
const WordCard = ({data, model, play, nextHandler}) => {
    if (model == "1") {
        return <PreviewWordCard data={data} play={play}/>
    }
    if (model == "2") {
        return <StudyWordCard data={data} play={play} nextHandler={nextHandler}/>
    }
    if (model == "3" || model == "4") {
        return <PracticeWordCard data={data} model={model} play={play} nextHandler={nextHandler}/>
    }
}
export default WordCard;