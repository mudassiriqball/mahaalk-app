import React, { useState, useEffect } from 'react';
import useAllProductsInfiniteScroll from '../hooks/useAllProductsInfiniteScroll'
import { View, FlatList, Text } from 'react-native';
import NoDataFound from '../components/NoDataFound';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import translate from '../i18n/translate';

React.useLayoutEffect = React.useEffect

export default function OnlyProducts(props) {
    const [pageNumber, setPageNumber] = useState(1)

    const { all_products_loading, all_products_error, all_products_products, all_products_pages, all_products_total, all_products_hasMore } =
        useAllProductsInfiniteScroll(pageNumber, '10')

    function renderItem({ item }) {
        return (
            <View style={{ paddingHorizontal: 5, paddingBottom: 10, width: '50%' }}>
                <ProductCard item={item} navigation={props.navigation} numberOfCol={2} />
            </View>
        )
    }

    useEffect(() => {
        setPageNumber(1)
    }, []);

    function handleLoadMore() {
        if (all_products_hasMore) {
            setTimeout(() => {
                setPageNumber(pageNumber + 1)
            }, 500);
        }
    }

    return (
        <>
            {all_products_total > 0 ?
                <>
                    <Text style={{ paddingLeft: 6, marginBottom: 10, fontSize: 18 }}>{translate('you_may_like')}</Text>
                    <FlatList
                        data={all_products_products}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        numColumns={2}
                        initialNumToRender={3}
                        ListFooterComponent={() => {
                            return (
                                all_products_loading &&
                                <Loading />
                            );
                        }}
                        onEndReached={handleLoadMore}
                        onEndThreshold={0}
                    />
                </>
                :
                all_products_hasMore ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </>
    )
}

