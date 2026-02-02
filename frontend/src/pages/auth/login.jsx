import { Button, Form, Input, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { apiLogin } from "@/api/auth.api";
import { setToken } from "@/utils/token";

const { Title, Text } = Typography;

export default function Login() {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await apiLogin(values);
            setToken(res.data.access_token);
            message.success("Đăng nhập thành công");
            window.location.href = "/";
        } catch (err) {
            message.error(
                err.response?.data?.detail || "Sai tài khoản hoặc mật khẩu"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fa",
            }}
        >
            <Card
                style={{ width: 360 }}
                bordered={false}
            >
                <Title level={3} style={{ textAlign: "center" }}>
                    LIMS Login
                </Title>

                <Text
                    type="secondary"
                    style={{ display: "block", textAlign: "center", marginBottom: 24 }}
                >
                    Laboratory Information Management System
                </Text>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: "Vui lòng nhập username" },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
