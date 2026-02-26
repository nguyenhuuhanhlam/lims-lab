import React from 'react'
import { Button, Form, Input, Card, Typography, App } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

import { apiLogin } from '@/api/auth.api'
import { setToken } from '@/utils/token'

const { Title, Text } = Typography

const Login = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || "/"

    const { message } = App.useApp()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const res = await apiLogin(values)

            setToken(res.data.access_token)

            message.success("Login successful")

            navigate(from, { replace: true })

        } catch (err) {
            message.error(
                err.response?.data?.detail || "Invalid username or password"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center pt-8">
            <Card className="w-[360px]" variant="borderless">
                <Title level={3} className="text-center">
                    LIMS Login
                </Title>

                <Text type="secondary" className="block text-center mb-6">
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
                            { required: true, message: "Please enter your username" },
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
                            { required: true, message: "Please enter your password" },
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
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login
