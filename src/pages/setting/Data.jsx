import {Button, Card, message, Modal, Space,Checkbox} from "antd";

import React, { useRef, useState } from 'react';
import * as XLSX from "xlsx";

import {addCollection} from '../../utils/Collection.js';
import {addWordList} from '../../utils/Word.js';

const Data = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheets, setSelectedSheets] = useState([]);
    const [workbook, setWorkbook] = useState(null);
    const fileInputRef = useRef(null); // 用于清空文件

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                setWorkbook(workbook);
                setSheetNames(workbook.SheetNames);
                setIsModalVisible(true);
            };
            reader.readAsArrayBuffer(file);
        }
        else
        {
            message.error('请先选择文件');
        }
    };

    const handleSheetSelectionChange = (checkedValues) => {
        setSelectedSheets(checkedValues);
    };
    // 导入选中的 sheet
    const handleImportSheets = () => {
        if (selectedSheets.length > 0 && workbook) {
            const importedData = selectedSheets.flatMap((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet);
                return sheetData.map((row) => ({
                    ...row,
                    sheetName: sheetName,
                }));
            });
            importDataToIndex(importedData);
            setSelectedSheets([])
            setSheetNames([])
            setWorkbook(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setIsModalVisible(false);
            message.success('选定的 sheet 已成功导入');
        } else {
            message.warning('请至少选择一个 sheet');
        }
    };

    const importDataToIndex = async (importedData) => {
        console.log(importedData)
        const uniqueSheetNames = Array.from(new Set(importedData.map(item => item.sheetName)));
        const groupedData = uniqueSheetNames.map(sheet => ({
            sheetName: sheet,
            data: importedData.filter(item => item.sheetName === sheet)
        }));

        for (let item of groupedData) {
            const sheetName = item.sheetName;
            const collId = await addCollection({name: sheetName,remark:`Excel导入,SheetName:${sheetName}`})
            const data = item.data.map(item => ({
                collectionId: collId,
                jpWord: item['日文'],
                hiragana: item['平假名'],
                cnWord: item['中文'],
                partOfSpeech: item['词性'],
                tone: item['音调'] || null
            }));
            await addWordList(data);
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (<div className="flex w-full h-full flex-col p-0 ">
        <Card title="数据" bordered={false} style={{width: "100%"}}>
            <Space size="middle">
                <input
                    type="file"
                    id="addSimpleCollInput"
                    accept=".xlsx, .xls"
                    style={{display: 'none'}}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <Button type="dashed" onClick={() => fileInputRef.current.click()}>导入Excel</Button>
            </Space>

            <Modal
                title="选择要导入的 Sheet"
                open={isModalVisible}
                onOk={handleImportSheets}
                onCancel={handleCancel}
            >
                <Checkbox.Group
                    options={sheetNames.map((name) => ({ label: name, value: name }))}
                    onChange={handleSheetSelectionChange}
                />
            </Modal>


        </Card>
    </div>);
}
export default Data;