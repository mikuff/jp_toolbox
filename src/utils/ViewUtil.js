import {cacheAdd, cacheDel, cacheGet} from "./LocalCache";

export const getView = async () => {
    try {
        return await cacheGet(["background"]);
    } catch (error) {
        console.error("ViewUtil-getView-error:", error);
        return {
            background: ""
        };
    }
};

export const setView = async (background) => {
    try {
        await cacheDel(["background"]);
        await cacheAdd({background});
        return true;
    } catch (error) {
        console.error("ViewUtil-setView-error:", error);
        return false;
    }
};