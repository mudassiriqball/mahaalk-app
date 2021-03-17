import React, { useState, useEffect } from 'react';
import useQueryInfiniteScroll from '../hooks/useQueryInfiniteScroll'
import { View, FlatList } from 'react-native';

import CustomStatusBar from '../components/CustomStatusBar';
import Layout from '../components/Layout';
import NoDataFound from '../components/NoDataFound';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

React.useLayoutEffect = React.useEffect

export default function productsScreen(props) {
    const { field, q } = props.route.params;

    const [fieldName, setFieldName] = useState(field)
    const [pageNumber, setPageNumber] = useState(1)

    const { loading, error, products, pages, total, hasMore } = useQueryInfiniteScroll(fieldName, q, pageNumber, '12')

    function renderItem({ item }) {
        return (
            <View style={{ padding: 5, width: '50%' }}>
                <ProductCard item={item} navigation={props.navigation} numberOfCol={2} />
            </View>
        )
    }

    useEffect(() => {
        setFieldName('')
        setPageNumber(1)
    }, [q]);

    function handleLoadMore() {
        if (hasMore) {
            setTimeout(() => {
                setPageNumber(pageNumber + 1)
            }, 500);
        }
    }

    return (
        <Layout navigation={props.navigation}>
            <CustomStatusBar />
            {total > 0 ?
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={2}
                    initialNumToRender={3}
                    ListFooterComponent={() => {
                        return (
                            loading &&
                            <Loading />
                        );
                    }}
                    onEndReached={handleLoadMore}
                    onEndThreshold={0}
                />
                :
                hasMore ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </Layout>
    )
}

