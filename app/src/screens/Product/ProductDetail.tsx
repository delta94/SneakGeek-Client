import React from 'react';
import {
  StackNavigationProp,
  HeaderHeightContext,
} from '@react-navigation/stack';
import {RootStackParams} from 'navigations/RootStack';
import {RouteProp} from '@react-navigation/native';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {AppText, LiteShoeCard, ReviewItem} from 'screens/Shared';
import {strings, themes} from 'resources';
import {Icon} from 'react-native-elements';
import {connect, toVnDateFormat} from 'utilities';
import Humanize from 'humanize-plus';
import {IAppState} from 'store/AppStore';
import {
  Account,
  NetworkRequestState,
  Review,
  getReviews,
  Profile,
  getShoeInfo,
  Shoe,
  SellOrder,
  BuyOrder,
  PriceData,
} from 'business';
import RouteNames from 'navigations/RouteNames';

type Props = {
  account: Account;
  profile: Profile;
  route: RouteProp<RootStackParams, 'ProductDetail'>;
  navigation: StackNavigationProp<RootStackParams, 'ProductDetail'>;
  reviewState: {
    state: NetworkRequestState;
    reviews: Review[];
    error?: any;
  };
  shoeInfoState: {
    state: NetworkRequestState;
    error?: any;
    relatedShoes: Shoe[];
    lowestSellOrder?: SellOrder;
    highestBuyOrder?: BuyOrder;
  };
  getReviews: (shoeId: string) => void;
  getShoeInfo: (shoeId: string) => void;
};

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: 'white',
    flex: 1,
    position: 'relative',
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  shoeImageContainer: {
    height: Dimensions.get('window').height * 0.3,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderBottomColor: 'lightgray',
  },
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  backHitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  shoeTitle: {
    marginVertical: 20,
    marginHorizontal: '15%',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailKey: {
    minWidth: '25%',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  noReview: {
    textAlign: 'left',
    marginVertical: 10,
  },
  ratingHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
  },
  bottomButtonStyle: {
    height: themes.RegularButtonHeight,
    width: Dimensions.get('window').width * 0.45,
    alignItems: 'center',
    borderRadius: themes.ButtonBorderRadius,
    flexDirection: 'row',
  },
});

@connect(
  (state: IAppState) => ({
    reviewState: state.ProductState.reviewState,
    shoeInfoState: state.ProductState.infoState,
    account: state.UserState.accountState.account,
    profile: state.UserState.profileState.profile,
  }),
  (dispatch: Function) => ({
    getReviews: (shoeId: string): void => dispatch(getReviews(shoeId)),
    getShoeInfo: (shoeId: string): void => dispatch(getShoeInfo(shoeId)),
  }),
)
export class ProductDetail extends React.Component<Props> {
  private _shoe = this.props.route.params.shoe;

  public componentDidMount(): void {
    this.props.getReviews(this._shoe._id);
    this.props.getShoeInfo(this._shoe._id);
  }

  public render(): JSX.Element {
    return (
      <SafeAreaConsumer>
        {(insets): JSX.Element => (
          <View
            style={{
              paddingTop: insets.top,
              ...styles.rootContainer,
            }}>
            {this._renderHeader(insets.top)}
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <View
                style={{
                  ...styles.pageContainer,
                  marginBottom: insets.bottom + themes.RegularButtonHeight,
                }}>
                {this._renderProductImage()}
                {this._renderProductTitle()}
                {this._renderProductDescription()}
                {this._renderProductDetail()}
                {this._renderProductReviews()}
                {this._renderRelatedShoes()}
              </View>
            </ScrollView>
            {this._renderActionButtons(insets.bottom)}
          </View>
        )}
      </SafeAreaConsumer>
    );
  }

  private _renderHeader(topInsets: number): JSX.Element {
    return (
      <HeaderHeightContext.Consumer>
        {(headerHeight): JSX.Element => (
          <View
            style={{
              ...styles.headerContainer,
              height: headerHeight + topInsets,
            }}>
            <Icon
              name={'ios-arrow-back'}
              type={'ionicon'}
              size={themes.IconSize}
              onPress={(): void => this.props.navigation.goBack()}
              hitSlop={styles.backHitSlop}
            />
            <AppText.Title3>{strings.ProductDetail}</AppText.Title3>
            <Icon name={'share'} type={'feather'} size={themes.IconSize} />
          </View>
        )}
      </HeaderHeightContext.Consumer>
    );
  }

  private _renderProductImage(): JSX.Element {
    return (
      <View style={styles.shoeImageContainer}>
        <Image
          source={{uri: this._shoe.imageUrl}}
          style={{width: '100%', aspectRatio: 2}}
          resizeMode={'contain'}
        />
      </View>
    );
  }

  private _renderProductTitle(): JSX.Element {
    return (
      <AppText.Title2 style={styles.shoeTitle} numberOfLines={3}>
        {this._shoe.title}
      </AppText.Title2>
    );
  }

  private _renderProductDescription(): JSX.Element {
    if (!this._shoe.description) {
      return null;
    }

    return (
      <AppText.Body style={{marginHorizontal: 30}}>
        {this._shoe.description}
      </AppText.Body>
    );
  }

  private _renderProductDetail(): JSX.Element {
    const fieldMapping = new Map<string, string>([
      [this._shoe.title, strings.ProductName],
      [this._shoe.colorway.join(', '), strings.Colorway],
      [this._shoe.brand, strings.Brand],
      [this._shoe.category, strings.Category],
      [toVnDateFormat(this._shoe.releaseDate), strings.ReleaseDate],
    ]);
    const views: JSX.Element[] = [];
    fieldMapping.forEach((value: string, key: string) =>
      views.push(
        <View key={key} style={styles.detailRow}>
          <AppText.Subhead style={styles.detailKey}>
            {value.toUpperCase()}
          </AppText.Subhead>
          <AppText.Body style={styles.detailValue} numberOfLines={2}>
            {key}
          </AppText.Body>
        </View>,
      ),
    );
    return <View style={{paddingHorizontal: 20}}>{views}</View>;
  }

  private _renderProductReviews(): JSX.Element {
    const {reviewState, navigation} = this.props;
    const {state, reviews} = reviewState;

    let content: JSX.Element;
    if (state === NetworkRequestState.REQUESTING) {
      content = <ActivityIndicator />;
    } else if (state === NetworkRequestState.FAILED) {
      content = null;
    }

    if (state === NetworkRequestState.SUCCESS && reviews.length === 0) {
      content = (
        <AppText.Subhead style={styles.noReview}>
          {strings.NoReview}
        </AppText.Subhead>
      );
    } else {
      content = (
        <View style={{marginTop: 10}}>
          {reviews.slice(0, 2).map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </View>
      );
    }

    return (
      <View style={{flex: 1, padding: 20}}>
        <View style={styles.ratingHeaderContainer}>
          <AppText.Title2>{strings.Rating}</AppText.Title2>
          <Icon
            name={'edit'}
            size={themes.IconSize}
            color={themes.AppPrimaryColor}
            onPress={this._onEditReview.bind(this)}
          />
        </View>
        {content}
        {reviews.length >= 3 ? (
          <View style={{flex: 1, flexDirection: 'row-reverse'}}>
            <AppText.Callout
              style={{color: '#808080'}}
              onPress={(): void => {
                // @ts-ignore
                navigation.push(RouteNames.Product.AllReviews, {
                  reviews: reviews,
                  shoe: this._shoe,
                });
              }}>
              {strings.SeeMore}
            </AppText.Callout>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  }

  private _onEditReview(): void {
    const {profile, navigation} = this.props;
    if (
      profile.userProvidedName &&
      profile.userProvidedName.firstName &&
      profile.userProvidedName.lastName
    ) {
      // @ts-ignore
      navigation.push(RouteNames.Product.NewReview, {shoe: this._shoe});
    } else {
      this._alertMissingInfo(strings.MissingInfoForReview);
    }
  }

  private _alertMissingInfo(message: string): void {
    const {navigation} = this.props;
    Alert.alert(strings.AccountInfo, message, [
      {
        text: strings.AddInfoForReview,
        onPress: (): void =>
          // @ts-ignore
          navigation.navigate(RouteNames.Tab.AccountTab.Name, {
            screen: RouteNames.Tab.AccountTab.EditProfile,
          }),
      },
      {
        text: strings.Cancel,
        onPress: null,
        style: 'cancel',
      },
    ]);
  }

  private _renderRelatedShoes(): JSX.Element {
    let content: JSX.Element;
    const {shoeInfoState} = this.props;

    if (shoeInfoState.state === NetworkRequestState.REQUESTING) {
      content = <ActivityIndicator size={'large'} />;
    } else if (shoeInfoState.state === NetworkRequestState.SUCCESS) {
      content = (
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 20, paddingBottom: 10}}
          data={shoeInfoState.relatedShoes}
          keyExtractor={(itm): string => itm._id}
          renderItem={({item}): JSX.Element => (
            <LiteShoeCard
              shoe={item}
              onPress={(): void =>
                // @ts-ignore
                this.props.navigation.push(RouteNames.Product.ProductDetail, {
                  shoe: item,
                })
              }
              style={{marginRight: 20, paddingBottom: 8}}
            />
          )}
        />
      );
    }

    return (
      <View style={{flex: 1, padding: 20}}>
        <View style={styles.ratingHeaderContainer}>
          <AppText.Title2>{strings.RelatedProducts}</AppText.Title2>
        </View>
        {content}
      </View>
    );
  }

  private _renderActionButtons(bottom: number): JSX.Element {
    const {highestBuyOrder, lowestSellOrder} = this.props.shoeInfoState;
    return (
      <View style={{bottom, ...styles.bottomContainer}}>
        {this._renderSingleActionButton(
          'Bán',
          `Cao: ${
            highestBuyOrder
              ? Humanize.compactInteger(
                  (highestBuyOrder.buyPrice as PriceData).price,
                  2,
                )
              : '-'
          }`,
          'cart-arrow-up',
          themes.AppSellColor,
          () => {
            // @ts-ignore
            this.props.navigation.push(RouteNames.Order.Name, {
              screen: RouteNames.Order.NewSellOrder,
              params: {
                shoe: this._shoe,
              },
            });
          },
        )}
        {this._renderSingleActionButton(
          'Mua',
          `Thấp: ${
            lowestSellOrder
              ? Humanize.compactInteger(
                  (lowestSellOrder.sellNowPrice as PriceData).price,
                  2,
                )
              : '-'
          }`,
          'cart-arrow-down',
          themes.AppPrimaryColor,
          () => {
            // @ts-ignore
            this.props.navigation.push(RouteNames.Order.Name, {
              screen: RouteNames.Order.SizeSelection,
              params: {
                shoe: this._shoe,
              },
            });
          },
        )}
      </View>
    );
  }

  private _renderSingleActionButton(
    title: string,
    subtitle: string,
    iconName: string,
    backgroundColor: string,
    onPress: () => void,
  ): JSX.Element {
    const {account, profile} = this.props;

    const isVerified = account.isVerified;
    const missingAddress =
      !profile.userProvidedAddress ||
      !profile.userProvidedAddress.city ||
      !profile.userProvidedAddress.districtId ||
      !profile.userProvidedAddress.wardCode ||
      !profile.userProvidedAddress.streetAddress;

    const newOnPress = (): void => {
      if (isVerified && !missingAddress) {
        return onPress();
      } else if (!isVerified) {
        Alert.alert(strings.AccountNotVerifieid);
      } else {
        this._alertMissingInfo(
          `${strings.AddInfoForReview}: ${strings.MissingAddress}`,
        );
      }
    };

    return (
      <TouchableOpacity onPress={newOnPress}>
        <View
          style={{
            backgroundColor,
            ...styles.bottomButtonStyle,
            ...themes.ButtonShadow,
          }}>
          <Icon
            name={iconName}
            size={themes.IconSize}
            color={themes.AppAccentColor}
            type={'material-community'}
            containerStyle={{marginHorizontal: 10}}
          />
          <View style={{flex: 1, marginLeft: 10}}>
            <AppText.Title3 style={{color: themes.AppAccentColor}}>
              {title}
            </AppText.Title3>
            <AppText.Callout style={{color: themes.AppAccentColor}}>
              {subtitle}
            </AppText.Callout>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}