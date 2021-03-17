import { useEffect, useState } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'

export default function useQueryInfiniteScroll(fieldName, query, pageNumber, limit) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [products, setProducts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [pages, setPages] = useState(0)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        setProducts([])
    }, [query])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            setLoading(true)
            setError(false)
            const _url = MuhalikConfig.PATH + `/api/products/all-products-query-search`
            axios({
                method: 'GET',
                url: _url,
                params: { field: fieldName, q: query, page: pageNumber, limit: limit },
                cancelToken: source.token
            }).then(res => {
                if (unmounted) {
                    setLoading(false)
                    setProducts(prevPro => {
                        return [...new Set([...prevPro, ...res.data.data])]
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
                    setHasMore(false)
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
    }, [query, pageNumber])

    return { loading, error, products, pages, total, hasMore }
}