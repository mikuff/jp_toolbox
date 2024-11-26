import {collectionDB} from "./IndexDB.js";


// 新增记录
export const addCollection = async (data) => {
    return await collectionDB.add(data);
};

// 更新记录
export const updateCollection = async (id, data) => {
    return await collectionDB.update(id, data);
};

// 删除记录
export const deleteCollection = async (id) => {
    return await collectionDB.delete(id);
};

// 查询记录（分页和模糊搜索）
export const fetchCollection = async (page = 1, pageSize = 10, searchName = '') => {
    const collectionData = await collectionDB
        .where('name')
        .startsWithIgnoreCase(searchName)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

    const count = await collectionDB
        .where('name')
        .startsWithIgnoreCase(searchName)
        .count();

    return { data: collectionData, total: count };
};
