import Dexie from 'dexie';

// 初始化数据库
const db = new Dexie('jp_tool_box');

db.version(1).stores({
    collection: '++id, name, remark',
    config: '++id, key, value',
    word: '++id, collectionId, jpWord, hiragana, cnWord, partOfSpeech, tone',
});

export const collectionDB = db.collection;
export const configDB = db.config;
export const wordDB = db.word;

export default db;
