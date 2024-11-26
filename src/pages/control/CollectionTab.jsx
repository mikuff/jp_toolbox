// CollectionTable.jsx
import { useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal } from 'antd';
import { addCollection, deleteCollection, fetchCollection, updateCollection } from '../../utils/Collection.js';

const CollectionTab = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [form] = Form.useForm();
    const actionRef = useRef();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchData = async (page = 1, pageSize = 10, searchName = '') => {
        const ret = await fetchCollection(page, pageSize, searchName);
        setData(ret.data);
        setTotal(ret.total);
    };

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const showModal = (record = null) => {
        setCurrentRecord(record);
        setIsModalVisible(true);

        form.setFieldsValue({
            ...record,
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        if (currentRecord) {
            await updateCollection(currentRecord.id, values);
            message.success('编辑成功');
        } else {
            await addCollection(values);
            message.success('新增成功');
        }

        setIsModalVisible(false);
        form.resetFields();
        fetchData(currentPage, pageSize);
    };

    const handleDelete = async (record) => {
        await deleteCollection(record.id);
        message.success('删除成功');
        fetchData(currentPage, pageSize);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: '集合名称',
            dataIndex: 'name',
        },
        {
            title: '集合备注',
            dataIndex: 'remark',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => [
                <Button key="edit" onClick={() => showModal(record)}>编辑</Button>,
                <Button key="delete" danger onClick={() => handleDelete(record)}>删除</Button>,
            ],
        },
    ];

    return (
        <>
            <ProTable
                columns={columns}
                dataSource={data}
                rowKey="id"
                actionRef={actionRef}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    onChange: (page, newPageSize) => {
                        setCurrentPage(page);
                        setPageSize(newPageSize);
                    },
                }}
                search={false}
                toolBarRender={() => [
                    <Input.Search
                        placeholder="搜索集合名称"
                        onSearch={(value) => fetchData(1, pageSize, value)}
                        style={{ width: 200 }}
                    />,
                    <Button type="primary" onClick={() => showModal()}>新增</Button>,
                ]}
            />

            <Modal
                title={currentRecord ? '编辑' : '新增'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="集合名称" rules={[{ required: true, message: '请输入集合名称' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="remark" label="集合备注">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CollectionTab;
