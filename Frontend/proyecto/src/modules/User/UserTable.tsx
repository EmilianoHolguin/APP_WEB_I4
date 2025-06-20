import React from 'react';
import { Space, Table, Tag, Button } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  username: string;
  roles: string[];
  email: string;
  createdAt: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Roles',
    dataIndex: 'roles',
    key: 'roles',
    render: (_, { roles }) => (
      <>
        {roles.map((role) => (
          <Tag color="blue" key={role}>
            {role.toUpperCase()}
          </Tag>
        ))}
      </>
    ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Fecha de creación',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Acciones',
    key: 'actions',
    render: () => (
      <Space size="middle">
        <Button type="link">Actualizar</Button>
        <Button type="link" danger>
          Borrar
        </Button>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    username: 'Luis',
    roles: ['admin'],
    email: 'Luis@example.com',
    createdAt: '2025-06-18',
  },
  {
    key: '2',
    username: 'jane_smith',
    roles: ['employee'],
    email: 'jane@example.com',
    createdAt: '2025-06-17',
  },
  {
    key: '3',
    username: 'admin_user',
    roles: ['admin', 'employee'],
    email: 'admin@example.com',
    createdAt: '2025-06-15',
  },
];

const UserTable: React.FC = () => <Table<DataType> columns={columns} dataSource={data} />;

export default UserTable;