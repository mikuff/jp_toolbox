import {configDB} from "./IndexDB.js";

export const cacheGet = async (keys) => {
    if (Array.isArray(keys)) {
        const results = await configDB.where("key").anyOf(keys).toArray();
        const resultObject = {};
        results.forEach(({ key, value }) => {
            resultObject[key] = value;
        });
        return resultObject;
    } else {
        const result = await configDB.where("key").equals(keys).first();
        return result ? { [keys]: result.value } : null;
    }
};


// 配置新增
export const cacheAdd = async (data) => {
    if (typeof data === "object" && data !== null) {
        const entries = Object.entries(data);
        for (const [key, value] of entries) {
            await configDB.add({ key, value });
        }
    }
};

// 配置删除
export const cacheDel = async (keys) => {
    if (Array.isArray(keys)) {
        await configDB.where("key").anyOf(keys).delete();
    } else {
        await configDB.where("key").equals(keys).delete();
    }
};
