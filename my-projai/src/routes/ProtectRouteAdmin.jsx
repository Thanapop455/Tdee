import React, { useState, useEffect } from 'react'
import useStoregobal from '../store/storegobal'
import { currentAdmin } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'


const ProtectRouteAdmin = ({ element }) => {
    const [ok, setOk] = useState(false)
    const user = useStoregobal((state) => state.user)
    const token = useStoregobal((state) => state.token)

    useEffect(() => {
        if (user && token) {
            currentAdmin(token)
                .then((res) => setOk(true))
                .catch((err) => setOk(false))
        }
    }, [])

    return ok ? element : <LoadingToRedirect />
}

export default ProtectRouteAdmin