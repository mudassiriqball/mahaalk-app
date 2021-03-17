import React, { Component } from 'react';
import Carosuel from '../components/Carosuel'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'
import CategoriesSlider from '../components/CategoriesSlider';
import { StyleSheet, View } from 'react-native';
import Padding from '../constants/Padding';
import NewArrivalProducts from '../components/NewArrivalProducts';
import Layout from '../components/Layout';
import CustomStatusBar from '../components/CustomStatusBar';
import HomeCateggories from '../components/HomeCateggories';
import OnlyProducts from '../components/OnlyProducts';
import translate from '../i18n/translate';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_list: [],
      new_arrival_products: [],
      top_ranking_products: [],
      home_categories_list: [],
    }
  }

  componentDidMount() {
    this.getSlidersList()
    this.getNewArrivalProducts()
    this.getHomeCategories()
  }

  async getSlidersList() {
    const curentComponent = this
    const url = MuhalikConfig.PATH + '/api/sliders/sliders';
    await axios.get(url, { "rejectUnauthorized": false }).then((res) => {
      curentComponent.setState({ slider_list: res.data.data })
    }).catch((err) => {
      console.log('slider list fatching error: ', err)
    })
  }

  async getNewArrivalProducts() {
    const curentComponent = this
    const new_arival_url = MuhalikConfig.PATH + `/api/products/all-products-query-search`
    await axios({
      method: 'GET',
      url: new_arival_url,
      params: { q: "new-arrival", page: '1', limit: '12' },
    }).then((res) => {
      curentComponent.setState({
        new_arrival_products: res.data.data,
        top_ranking_products: res.data.data
      })
    }).catch(err => {
      console.log('New arrival products fetching error:', err)
    })
  }

  async getHomeCategories() {
    const curentComponent = this
    const home_cate_url = MuhalikConfig.PATH + '/api/categories/home-categories';
    await axios.get(home_cate_url).then((res) => {
      curentComponent.setState({
        home_categories_list: res.data.data
      })
    }).catch((error) => {
    })
  }

  render() {
    return (
      <Layout navigation={this.props.navigation}>
        <CustomStatusBar />
        {this.props.isNetwork ? <>
          <Carosuel data={this.state.slider_list} {...this.props} />
          <CategoriesSlider data={this.props.categories_list} {...this.props} />
          <View style={{ height: 10 }} />
          {this.state.new_arrival_products != '' && <>
            <NewArrivalProducts data={this.state.new_arrival_products} type={"new_arrivals"} {...this.props} />
            <View style={{ height: 20 }} />
            <NewArrivalProducts data={this.state.new_arrival_products} type={"top_ranking"} {...this.props} />
          </>
          }
          <View style={{ height: 20 }} />
          {this.state.home_categories_list && this.state.home_categories_list.map((element, index) =>
            <HomeCateggories key={index} element={element} navigation={this.props.navigation} />
          )}
          <OnlyProducts {...this.props} />
        </>
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
            <Text>{translate('no_internet')}</Text>
          </View>
        }
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  body_container: {
    marginHorizontal: Padding.page_horizontal,
    marginVertical: Padding.page_horizontal,
  },
})
export default HomeScreen;