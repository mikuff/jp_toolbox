import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Form, Input, message } from 'antd';

// 模拟的初始数据
const initialData = [
    { id: 1, name: 'John Doe', age: 30, address: 'New York' },
    { id: 2, name: 'Jane Smith', age: 28, address: 'London' },
];

const Demo = () => {
    const [data, setData] = useState(initialData); // 数据列表
    const [isModalVisible, setIsModalVisible] = useState(false); // 控制弹窗显示
    const [currentRecord, setCurrentRecord] = useState(null); // 当前操作的记录
    const [form] = Form.useForm(); // 表单实例
    const actionRef = useRef(); // 用于刷新表格

    // 打开弹窗（编辑模式或新增模式）
    const showModal = (record = null) => {
        setCurrentRecord(record);
        setIsModalVisible(true);
        form.setFieldsValue(record || { name: '', age: '', address: '' });
    };

    // 关闭弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // 保存数据（新增或编辑）
    const handleSave = async () => {
        const values = await form.validateFields();
        if (currentRecord) {
            // 编辑模式
            setData(prevData =>
                prevData.map(item => (item.id === currentRecord.id ? { ...item, ...values } : item))
            );
            message.success('编辑成功');
        } else {
            // 新增模式
            const newData = { ...values, id: Date.now() };
            setData(prevData => [...prevData, newData]);
            message.success('新增成功');
        }
        setIsModalVisible(false);
        form.resetFields();
        actionRef.current?.reload();
    };

    // 删除记录
    const handleDelete = (record) => {
        setData(prevData => prevData.filter(item => item.id !== record.id));
        message.success('删除成功');
        actionRef.current?.reload();
    };

    // 表格列配置
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
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
            {/* 增加一个按钮用于新增 */}
            <ProTable className="flex w-full h-full items-center justify-center"
            columns={columns}
                dataSource={data}
                rowKey="id"
                actionRef={actionRef}
                pagination={{ pageSize: 5 }}
                search={false}
                toolBarRender={() => [
                    <Button type="primary" onClick={() => showModal()}>新增</Button>,
                ]}
            />

            {/* 弹窗用于新增和编辑 */}
            <Modal
                title={currentRecord ? '编辑记录' : '新增记录'}
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="age" label="Age" rules={[{ required: true, message: '请输入年龄' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true, message: '请输入地址' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Demo;
