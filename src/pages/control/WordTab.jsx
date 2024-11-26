import {useEffect, useRef, useState} from 'react';
import ProTable from '@ant-design/pro-table';
import {Button, Form, Input, message, Modal, Select, Tag} from 'antd';
import {addWord, deleteWord, fetchCollection, fetchWord, updateWord} from '../../utils/Word.js';

const WordTab = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSentenceModalVisible, setIsSentenceModalVisible] = useState(false);
    const [form] = Form.useForm();
    const actionRef = useRef();
    const [currentRecord, setCurrentRecord] = useState(null);
    const [collections, setCollections] = useState([]);
    const [collectId, setCollectId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchData(currentPage, pageSize,collectId);
        fetchCollectionOptions();
    }, [currentPage, pageSize,collectId]);



    const fetchData = async (page = 1, pageSize = 10,collId = null) => {
        const ret = await fetchWord(page, pageSize,collId);
        setData(ret.data);
        setTotal(ret.total);
    };

    const fetchCollectionOptions = async () => {
        const collections = await fetchCollection();
        setCollections(collections);
    };

    const showModal = (record = null) => {
        fetchCollectionOptions();
        setCurrentRecord(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            ...record, sentences: record?.sentences || [{jp: '', cn: ''}],
        });
    };

    const showSentenceModal = (record) => {
        setCurrentRecord(record);
        setIsSentenceModalVisible(true);
        form.setFieldsValue({
            ...record, sentences: record?.sentences || [{jp: '', cn: ''}],
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleSentenceCancel = () => {
        form.resetFields();
        setIsSentenceModalVisible(false);
    };

    const handleSave = async () => {
        const values = await form.validateFields(['collectionId', 'jpWord', 'hiragana', 'cnWord', 'partOfSpeech', 'tone']);
        if (currentRecord) {
            await updateWord(currentRecord.id, values);
            message.success('编辑成功');
        } else {
            await addWord(values);
            message.success('新增成功');
        }

        setIsModalVisible(false);
        form.resetFields();
        fetchData(currentPage, pageSize,collectId);
    };

    const handleDelete = async (record) => {
        await deleteWord(record.id);
        message.success('删除成功');
        fetchData(currentPage, pageSize,collectId);

    };

    const handleSentenceSave = async () => {
        const values = await form.validateFields(['sentences']);
        await updateWord(currentRecord.id, {sentences: values.sentences});
        message.success('例句更新成功');
        setIsSentenceModalVisible(false);
        fetchData(currentPage, pageSize,collectId);
    };

    const columns = [{
        title: 'ID', dataIndex: 'id', width: 100,
    }, {
        title: '关联集合', dataIndex: 'collectionId',width: 120, renderFormItem: () => (<Select>
            {collections.map((col) => (<Select.Option key={col.id} value={col.id}>
                {col.name}
            </Select.Option>))}
        </Select>), render: (_, record) => collections.find((col) => col.id === record.collectionId)?.name || '无',
    }, {
        title: '日文', dataIndex: 'jpWord', renderFormItem: () => <Input/>,
    }, {
        title: '平假名', dataIndex: 'hiragana', renderFormItem: () => <Input/>,
    }, {
        title: '中文', dataIndex: 'cnWord', renderFormItem: () => <Input/>,
    }, {
        title: '词性', dataIndex: 'partOfSpeech',width: 120, renderFormItem: () => <Input/>,
    }, {
        title: '音调', dataIndex: 'tone', width: 80, renderFormItem: () => <Input type="number"/>,
    }, {
        title: '例句', dataIndex: 'sentences',  width: 80,render: (_, record) => (<div>
            <Tag onClick={() => showSentenceModal(record)} color="magenta">{ record.sentences?record.sentences.length:0}</Tag>
        </div>), renderFormItem: () => (<>
            {form.getFieldValue('sentences') && form.getFieldValue('sentences').map((_, index) => (
                <div key={index} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                    <Form.Item
                        name={['sentences', index, 'jp']}
                        rules={[{required: true, message: '请输入例句日文'}]}
                    >
                        <Input placeholder="例句日文"/>
                    </Form.Item>
                    <Form.Item
                        name={['sentences', index, 'cn']}
                        rules={[{required: true, message: '请输入例句翻译'}]}
                    >
                        <Input placeholder="例句翻译"/>
                    </Form.Item>
                </div>))}
            {form.getFieldValue('sentences') && form.getFieldValue('sentences').length < 5 && (
                <Button onClick={() => form.setFieldsValue({
                    sentences: [...form.getFieldValue('sentences'), {jp: '', cn: ''}],
                })}>
                    新增例句
                </Button>)}
        </>),
    }, {
        title: '操作',
        valueType: 'option',
        width: 300,
        render: (_, record) => [<Button key="edit" onClick={() => showModal(record)}>编辑</Button>,
            <Button key="delete" danger onClick={() => handleDelete(record)}>删除</Button>,
            <Button key="manage-sentences" onClick={() => showSentenceModal(record)}>管理例句</Button>,],
    },];

    return (<>
        <ProTable
            columns={columns}
            dataSource={data}
            rowKey="id"
            actionRef={actionRef}
            pagination={{
                current: currentPage, pageSize: pageSize, total: total, onChange: (page, newPageSize) => {
                    setCurrentPage(page);
                    setPageSize(newPageSize);
                },
            }}
            search={false}
            form={{
                layout: 'vertical', style: {width: '600px', margin: '0 auto'}, // Centers the form and sets width to 600px
            }}
            toolBarRender={() => [

                <Select
                    key="collectionSelect"
                    placeholder="选择集合"
                    onChange={(value) => {
                        setCollectId(value);
                    }}
                    style={{width: 200}}
                    allowClear
                >
                    {collections.map((col) => (<Select.Option key={col.id} value={col.id}>
                        {col.name}
                    </Select.Option>))}
                </Select>, <Button type="primary" onClick={() => showModal()}>新增单词</Button>,]}
        />

        {/* 编辑单词弹窗 */}
        <Modal
            title={currentRecord ? '编辑单词' : '新增单词'}
            open={isModalVisible}
            onOk={handleSave}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="collectionId" label="关联的集合ID"
                           rules={[{required: true, message: '请选择集合'}]}>
                    <Select>
                        {collections.map((col) => (<Select.Option key={col.id} value={col.id}>
                            {col.name}
                        </Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item name="jpWord" label="日文" rules={[{required: true, message: '请输入日文'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="hiragana" label="平假名" rules={[{required: false, message: '请输入平假名'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="cnWord" label="中文" rules={[{required: true, message: '请输入中文'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="partOfSpeech" label="词性" rules={[{required: true, message: '请输入词性'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="tone" label="音调" rules={[{required: false, message: '请输入音调'}]}>
                    <Input type="number"/>
                </Form.Item>
            </Form>
        </Modal>

        {/* 管理例句弹窗 */}
        <Modal
            title="管理例句"
            open={isSentenceModalVisible}
            onOk={handleSentenceSave}
            onCancel={handleSentenceCancel}
        >
            <Form form={form} layout="vertical">
                <Form.List
                    name="sentences"
                    initialValue={currentRecord?.sentences || [{jp: '', cn: ''}]}
                >
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                            <div key={key} className="p-2 border mb-2">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'jp']}
                                    fieldKey={[fieldKey, 'jp']}
                                    rules={[{required: true, message: '请输入例句日文'}]}
                                >
                                    <Input.TextArea placeholder="例句日文"/>
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'cn']}
                                    fieldKey={[fieldKey, 'cn']}
                                    rules={[{required: true, message: '请输入例句翻译'}]}
                                >
                                    <Input.TextArea placeholder="例句翻译"/>
                                </Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => remove(name)}
                                    className="mt-2 mb-2 w-full"
                                    color="danger"
                                >
                                    删除
                                </Button>
                            </div>))}
                        <Form.Item>
                            <Button type="dashed" className="mt-2 w-full" color="primary"  onClick={() => add()}>
                                新增例句
                            </Button>
                        </Form.Item>
                    </>)}
                </Form.List>
            </Form>
        </Modal>
    </>);
};

export default WordTab;
