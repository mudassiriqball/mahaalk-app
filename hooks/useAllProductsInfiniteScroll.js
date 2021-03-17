import { useEffect, useState } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'

export default function useAllProductsInfiniteScroll(pageNumber, limit) {
    const [all_products_loading, setLoading] = useState(true)
    const [all_products_error, setError] = useState('')
    const [all_products_products, setProducts] = useState([])
    const [all_products_hasMore, setHasMore] = useState(true)
    const [all_products_pages, setPages] = useState(0)
    const [all_products_total, setTotal] = useState(0)

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            setLoading(true)
            setError(false)
            const _url = MuhalikConfig.PATH + `/api/products/all-products`
            axios({
                method: 'GET',
                url: _url,
                params: { page: pageNumber, limit: limit },
                cancelToken: source.token
            }).then(res => {
                if (unmounted) {
                    setLoading(false)
                    setProducts(prevProducts => {
                        return [...new Set([...prevProducts, ...res.data.data])]
                    })
                    setHasMore(res.data.data.length > 0)
                    setTotal(res.data.total)
                    let count = res.data.total / 20
                    let rounded = Math.floor(count);
                    let decimal = count - rounded;
                    if (decimal > 0) {
                        setPages(rounded + 1)
                    } else {
                        setPages(rounded)
                    }
                }
            }).catch(err => {
                if (unmounted) {
                    setLoading(false)
                    if (axios.isCancel(err)) return
                    setError(true)
                }
            })
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [pageNumber, limit])

    return { all_products_loading, all_products_error, all_products_products, all_products_pages, all_products_total, all_products_hasMore }
}