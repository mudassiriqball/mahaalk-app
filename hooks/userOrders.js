import { useEffect, useState } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'

export default function userOrdersPageLimit(token, user_id, status, pageNumber, limit) {
    const [user_orders_loading, setLoading] = useState(false)
    const [user_orders_error, setError] = useState('')
    const [user_orders, setOrders] = useState([])
    const [user_orders_pages, setPages] = useState(0)
    const [user_orders_total, setTotal] = useState(0)
    const [user_order_hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setOrders([])
        return () => {
        }
    }, [user_id, status])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            if (user_id != null) {
                setLoading(true)
                setError(false)
                const _url = MuhalikConfig.PATH + `/api/orders/customer-orders/${user_id}`
                axios({
                    method: 'GET',
                    url: _url,
                    headers: {
                        'authorization': token
                    },
                    params: { status: status, page: pageNumber, limit: limit },
                    cancelToken: source.token
                }).then(res => {
                    if (unmounted) {
                        setLoading(false)
                        setOrders(prevOrders => {
                            return [...new Set([...prevOrders, ...res.data.data.docs])]
                        })
                        setTotal(res.data.data.total)
                        setPages(res.data.data.pages)
                        setHasMore(res.data.data.docs.length > 0)
                    }
                }).catch(err => {
                    if (unmounted) {
                        setLoading(false)
                        if (axios.isCancel(err)) return
                        setError(true)
                    }
                })
            }
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [user_id, pageNumber])

    return { user_orders_loading, user_orders_error, user_orders, user_orders_pages, user_orders_total, user_order_hasMore }
}