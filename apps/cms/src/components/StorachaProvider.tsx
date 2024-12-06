import { Authenticator, Provider } from "@w3ui/react"
import type { ReactNode } from "react"


const StorachaProvider = ({ children }: { children: ReactNode }) => {

    return (
        <div>
            <Provider>
                <Authenticator>
                    {children}
                </Authenticator>
            </Provider>
        </div>
    )
}

export default StorachaProvider;