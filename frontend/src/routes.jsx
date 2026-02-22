import { IconCircleDottedLetterR, IconClipboard, IconClipboardText } from '@tabler/icons-react'
import { lazy } from 'react'

const modules = import.meta.glob('/src/pages/**/*.jsx')

const safeLazy = (path) => {
    const loader = modules[path]

    if (!loader) {
        return () => <div className="p-8">Page is not implemented.</div>
    }

    return lazy(loader)
}

export default {
    route: {
        path: "/",
        name: "Root",

        routes: [{
            path: "/request",
            name: "REQUESTS FORMS",
            icon: <IconCircleDottedLetterR />,
            routes: [
                {
                    path: "/request-slip",
                    name: "Slip",
                    icon: <IconClipboard />,
                    auth: true,
                    component: safeLazy('/src/pages/request/slip.jsx')
                },
                {
                    path: "/request-contract",
                    name: "Contract",
                    icon: <IconClipboardText />,
                    auth: false,
                    component: safeLazy('/src/pages/request/contract.jsx')
                }
            ]
        }, {
            path: '/admin',
            name: 'ADMIN',
            icon: <IconCircleDottedLetterR />,
            routes: [
                {
                    path: '/admin/users',
                    name: 'Users',
                    icon: <IconClipboard />,
                    auth: true,
                    component: safeLazy('/src/pages/admin/users.jsx')
                },
                {
                    path: '/admin/create-user',
                    name: 'Create User',
                    icon: <IconClipboard />,
                    auth: true,
                    component: safeLazy('/src/pages/auth/register.jsx')
                }
            ]
        }]
    },
    location: {
        pathname: "/",
    },
}