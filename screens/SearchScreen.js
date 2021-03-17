import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';

import CustomStatusBar from '../components/CustomStatusBar';
import Layout from '../components/Layout';
import NoDataFound from '../components/NoDataFound';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import useSearch from '../hooks/useSearch';

React.useLayoutEffect = React.useEffect

export default function SearchScreen(props) {
    const { search } = props.route.params;
    const [pageNumber, setPageNumber] = useState(1)

    const { search_loading, search_error, search_products, search_pages, search_total, search_hasMore } = useSearch(search, pageNumber, '12')

    function renderItem({ item }) {
        return (
            <View style={{ padding: 5, width: '50%' }}>
                <ProductCard item={item} navigation={props.navigation} numberOfCol={2} />
            </View>
        )
    }

    useEffect(() => {
        setPageNumber(1)
    }, [search]);

    function handleLoadMore() {
        if (search_hasMore) {
            setTimeout(() => {
                setPageNumber(pageNumber + 1)
            }, 500);
        }
    }

    return (
        <Layout navigation={props.navigation}>
            <CustomStatusBar />
            {search_total > 0 ?
                <FlatList
                    data={search_products}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={2}
                    initialNumToRender={3}
                    ListFooterComponent={() => {
                        return (
                            search_loading &&
                            <Loading />
                        );
                    }}
                    onEndReached={handleLoadMore}
                    onEndThreshold={0}
                />
                :
                search_hasMore ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </Layout>
    )
}

