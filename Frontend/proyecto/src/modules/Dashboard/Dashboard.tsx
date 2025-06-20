//Frontend/proyecto/src/modules/Dashboard/Dashboard.tsx
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import MenuDynamic from "../MenuDynamic/MenuDynamic";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

function Dashboard() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={220}>
                <MenuDynamic />
            </Sider>

            <Layout>
                <Header />
                <Content style={{ margin: '24px 16px 0', padding: 24 }}>
                    <Outlet />
                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
}

export default Dashboard;
