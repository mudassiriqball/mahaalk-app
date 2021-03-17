import { useEffect, useState } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'

export default function useSearch(query, pageNumber, limit) {
    const [search_loading, setLoading] = useState(false)
    const [search_error, setError] = useState('')
    const [search_products, setProducts] = useState([])
    const [search_hasMore, setHasMore] = useState(true)
    const [search_pages, setPages] = useState(0)
    const [search_total, setTotal] = useState(0)

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
            const _url = MuhalikConfig.PATH + `/api/products/search/abc`
            axios({
                method: 'GET',
                url: _url,
                params: { q: query, page: pageNumber, limit: limit },
                cancelToken: source.token
            }).then(res => {
                if (unmounted) {
                    setLoading(false)
                    setProducts(prevPro => {
                        return [...new Set([...prevPro, ...res.data.data.docs])]
                    })
                    setHasMore(res.data.data.docs.length > 0)
                    setTotal(res.data.data.total)
                    setPages(res.data.data.pages)
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
    }, [query, pageNumber])

    return { search_loading, search_error, search_products, search_pages, search_total, search_hasMore }
}