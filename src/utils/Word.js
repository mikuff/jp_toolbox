import {collectionDB,wordDB} from "./IndexDB.js";

// 新增记录
export const addWord = async (data) => {
    return await wordDB.add(data);
};
// 新增记录列表
export const addWordList = async (dataArray) => {
    if (Array.isArray(dataArray)) {
        const results = await Promise.all(
            dataArray.map(async (data) => {
                return await wordDB.add(data);
            })
        );
        return results;
    }
};

// 更新记录
export const updateWord = async (id, data) => {
    return await wordDB.update(id, data);
};

// 删除记录
export const deleteWord = async (id) => {
    return await wordDB.delete(id);
};


// 查询集合 所有
export const fetchCollection = async () => {
    return await collectionDB.toArray();
};


// 查询记录（分页和模糊搜索）
export const fetchWord = async (page = 1, pageSize = 10, collectionId = null, jpWord = '', cnWord = '') => {
    let query = wordDB;
    if (collectionId) {
        query = query.where('collectionId').equals(collectionId);
    }
    if (jpWord) {
        query = query.where('jpWord').startsWithIgnoreCase(jpWord);
    }
    if (cnWord) {
        query = query.where('cnWord').startsWithIgnoreCase(cnWord);
    }
    const collectionData = await query
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

    const countQuery = wordDB;
    if (collectionId) {
        countQuery.where('collectionId').equals(collectionId);
    }
    if (jpWord) {
        countQuery.where('jpWord').startsWithIgnoreCase(jpWord);
    }
    if (cnWord) {
        countQuery.where('cnWord').startsWithIgnoreCase(cnWord);
    }

    const count = await countQuery.count();
    return { data: collectionData, total: count };
};
