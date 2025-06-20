//Frontend/proyecto/src/modules/User/UserForm.tsx
import { Button, Form, Input } from 'antd';

function UserForm() {
  console.log("UserForm está montado");

    const [form] = Form.useForm();
    const title = 'Crear Usuario';

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields(); // Validar y obtener todos los datos
            console.log('All data from form', values);
        } catch (error) {
            console.log('Validation Failed:', error);
        }
    }
    
    return (
        <>
            <h2>{title}</h2>
            <Form
                form={form}
                name="user-form"
                layout="vertical"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={handleSubmit}>
                        Crear Usuario
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default UserForm;