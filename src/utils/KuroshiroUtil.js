import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"; // 使用正确的名称

const kuroshiro = new Kuroshiro();

async function initKuroshiro() {
    await kuroshiro.init(new KuromojiAnalyzer()); // 使用 KuromojiAnalyzer
}

export async function convert(text) {
    await initKuroshiro();
    const result = await kuroshiro.convert(text, {
        mode: "furigana", // 转换为假名标注模式
        to: "hiragana",  // 转换为平假名
    });
    return result;
}
