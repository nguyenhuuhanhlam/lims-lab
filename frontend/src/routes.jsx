import { IconCircleDottedLetterR } from '@tabler/icons-react'
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
                    auth: true,
                    component: safeLazy('/src/pages/request/slip.jsx')
                },
                {
                    path: "/request-contract",
                    name: "Contract",
                    auth: false,
                    component: safeLazy('/src/pages/request/contract.jsx')
                }
            ]
        }]
    },
    location: {
        pathname: "/",
    },
}