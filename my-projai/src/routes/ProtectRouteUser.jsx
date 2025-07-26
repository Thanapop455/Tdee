import React, { useState, useEffect } from 'react'
import useStoregobal from '../store/storegobal'
import { currentUser } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'


const ProtectRouteUser = ({ element }) => {
    const [ok, setOk] = useState(false)
    const user = useStoregobal((state) => state.user)
    const token = useStoregobal((state) => state.token)
    
    useEffect(() => {
        if (user && token) {
            currentUser(token)
                .then((res) => setOk(true))
                .catch((err) => setOk(false))
        }
    }, [])

    return ok ? element : <LoadingToRedirect />
}

export default ProtectRouteUser