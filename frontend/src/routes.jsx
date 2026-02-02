import { IconCircleDottedLetterR } from '@tabler/icons-react'

export default {
    route: {
        path: "/",
        name: "Root",
        routes: [{
            path: "/request",
            name: "REQUESTS FORMS",
            icon: <IconCircleDottedLetterR />,
            routes: [
                { path: "/request-slip", name: "Slip" },
                { path: "/request-contract", name: "Contract" }
            ]
        }]
    },
    location: {
        pathname: "/",
    },
}