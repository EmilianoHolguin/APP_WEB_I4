// Frontend/proyecto/src/modules/Product/ProductForm.tsx
import { Button, Form, Input, InputNumber } from 'antd';

function ProductForm() {
  const [form] = Form.useForm();
  const title = 'Registrar Producto';

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Datos del producto:', values);
    } catch (error) {
      console.log('Errores de validación:', error);
    }
  };

  return (
    <>
      <h2>{title}</h2>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nombre del Producto"
          name="name"
          rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: 'Ingresa la descripción del producto' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Precio"
          name="price"
          rules={[{ required: true, message: 'Ingresa el precio' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Cantidad"
          name="qty"
          rules={[{ required: true, message: 'Ingresa la cantidad disponible' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Guardar Producto
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default ProductForm;
