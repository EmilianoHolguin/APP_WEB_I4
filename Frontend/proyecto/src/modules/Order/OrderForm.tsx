// Frontend/proyecto/src/modules/Order/OrderForm.tsx
import { Button, Form, Input, InputNumber, Select } from 'antd';

const { Option } = Select;

function OrderForm() {
  const [form] = Form.useForm();
  const title = 'Registrar Pedido';

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Datos del pedido:', values);
    } catch (error) {
      console.log('Errores de validación:', error);
    }
  };

  return (
    <>
      <h2>{title}</h2>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Cliente"
          name="customer"
          rules={[{ required: true, message: 'Selecciona un cliente' }]}
        >
          <Input placeholder="Nombre del cliente o ID" />
        </Form.Item>

        <Form.Item
          label="Producto"
          name="productId"
          rules={[{ required: true, message: 'Selecciona un producto' }]}
        >
          <Select placeholder="Selecciona un producto">
            <Option value="68470a5b3d8cc083e77ee1ae">Proteína Isolate</Option>
            <Option value="6850ee44f31d85d82cfcae3e">Creatina Micronizada</Option>
            <Option value="6852ecb863863aac59d9d444">Creatina Monohidratada</Option>
            {/* Aquí puedes poblar dinámicamente desde backend más adelante */}
          </Select>
        </Form.Item>

        <Form.Item
          label="Cantidad"
          name="quantity"
          rules={[{ required: true, message: 'Ingresa la cantidad' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Guardar Pedido
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default OrderForm;
