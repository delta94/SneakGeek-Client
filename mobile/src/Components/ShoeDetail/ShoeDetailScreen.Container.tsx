//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { ShoeDetailScreen } from "./ShoeDetailScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { StackActions } from "react-navigation";
import { Shoe } from "../../Shared/Model";
import { addOwnedShoe } from "../../Actions";

const mapStateToProps = (state: IAppState) => {
  return {
    shoes: state.AppContentState.shoes,
    account: state.AccountState.currentAccount,
    profile: state.AccountState.userProfileState.profile,
    routeIndex: state.NavigationState.index
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    navigateToShoeDetailWithReset: (_index: number, shoe: Shoe) => {
      const navConfig = {
        routeName: RouteNames.ShoeDetail,
        params: { shoe }
      };
      dispatch(StackActions.push(navConfig));
    },
    addOwnedShoe: (shoeId: string, owned: Array<{ shoeSize: string; number: number }>) => {
      dispatch(addOwnedShoe(shoeId, owned));
    },
    navigateToAuctionOrder: () => {
      const navConfig = {
        routeName: RouteNames.OrderAuction
      };
      dispatch(StackActions.push(navConfig));
    }
  };
};

export const ShoeDetailScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoeDetailScreen);
