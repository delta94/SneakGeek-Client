// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { PaymentScreen } from "./PaymentScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { NavigationActions } from "react-navigation";
import { SellOrder } from "../../Shared/Model";
import { buyShoe } from "../../Actions";

const mapStateToProps = (state: IAppState) => ({
  buyState: state.TransactionState.buyShoeState.state
});

const mapDispatchToProps = (dispatch: Function) => ({
  onEdit: () => {
    const navConfig = {
      routeName: RouteNames.TrackingSell
    };
    dispatch(NavigationActions.navigate(navConfig));
  },
  buyShoe: (sellOrder: SellOrder) => {
    dispatch(buyShoe(sellOrder));
  }
});

export const PaymentScreenContainer = connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);
