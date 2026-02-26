import React from 'react'
import { Button, Form, Input, Card, Typography, App } from 'antd'
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { apiRegister } from '@/api/auth.api'

const { Title, Text } = Typography

const Register = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const { message } = App.useApp()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            await apiRegister(values)

            message.success("Registration successful")

            navigate("/login")

        } catch (err) {
            message.error(
                err.response?.data?.detail || "Registration failed"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center pt-8">
            <Card className="w-[360px]" variant="borderless">
                <Title level={3} className="text-center">
                    LIMS Register
                </Title>

                <Text type="secondary" className="block text-center mb-6">
                    Create a new account
                </Text>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                    >
                        <Input prefix={<IdcardOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true }]}
                    >
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true },
                            { min: 6 }
                        ]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        new Error("Passwords do not match")
                                    )
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Register
                        </Button>
                    </Form.Item>

                    <div className="text-center mt-4">
                        <Button type="link" onClick={() => navigate("/login")}>
                            Already have an account? Login
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default Register