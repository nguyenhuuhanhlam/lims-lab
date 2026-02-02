import { IconCircleDottedLetterR } from '@tabler/icons-react'
import Login from '@/pages/auth/login'

export default {
    route: {
        path: "/",
        name: "Root",

        routes: [{
            path: "/request",
            name: "REQUESTS FORMS",
            icon: <IconCircleDottedLetterR />,
            routes: [
                { path: "/request-slip", name: "Slip", component: <Login /> },
                { path: "/request-contract", name: "Contract", component: <>HELLO</> }
            ]
        }]
    },
    location: {
        pathname: "/",
    },
}