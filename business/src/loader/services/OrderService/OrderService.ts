import { IOrderService, PaymentType, OrderType, SellOrderEditInput } from "./IOrderService";
import { BaseService } from "../BaseService";
import { SellOrder, BuyOrder, Transaction } from "../../../model";

export class OrderService extends BaseService implements IOrderService {
  public async createSellOrder(token: string, sellOrder: SellOrder): Promise<void> {
    const response = await this.apiClient.getInstance().post(`/order/sell-order/new`, {
      shoeId: sellOrder.shoeId,
      shoeSize: sellOrder.shoeSize,
      sellNowPrice: (sellOrder.sellNowPrice as number),
      productCondition: sellOrder.productCondition,
      pictures: sellOrder.pictures,
      isNewShoe: sellOrder.isNewShoe
    }, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }


  public async getLowestSellPrices(token: string, shoeId: string): Promise<{ minPrice: number; size: string; }[]> {
    const response = await this.apiClient.getInstance().get(`/shoe/sell-order/lowest-by-size?shoeId=${shoeId}`, {
      headers: {
        authorization: token
      }
    });

    return response.data as { minPrice: number, size: string }[];
  }

  public async getMatchingSellOrder(token: string, shoeId: string, size: string): Promise<SellOrder> {
    const response = await this.apiClient.getInstance().get(
      `/order/sell-order/get-lowest-by-shoeid-and-shoesize?shoeId=${shoeId}&shoeSize=${size}`,
      {
        headers: {
          authorization: token
        }
      }
    );

    return response.data as SellOrder;
  }

  public async getTotalFee(token: string, sellOrderId: string): Promise<{ shippingFee: number, shoePrice: number }> {
    const response = await this.apiClient.getInstance().get(
      `/order/get-total-fee?sellOrderId=${sellOrderId}`,
      {
        headers: {
          authorization: token
        }
      }
    );

    return response.data;
  }

  public async getCheckoutUrlForPurchase(token: string, paymentType: PaymentType, sellOrder: string, buyOrder?: string): Promise<string> {
    let url = `/order/buy-order/pay?paymentType=${paymentType}&sellOrderId=${sellOrder}`;
    if (buyOrder) {
      url += `?buyOrderId=${buyOrder}`;
    }

    const response = await this.apiClient.getInstance().get(
      url,
      {
        headers: {
          authorization: token
        }
      }
    );

    return response.data;
  }

  public async getUserOrders(token: string, type: OrderType): Promise<Array<BuyOrder> | Array<SellOrder>> {
    const response = await this.apiClient.getInstance().get(`/order?orderType=${type}`, {
      headers: {
        authorization: token
      }
    });

    return response.data.orders;
  }

  public async getTransactionBySellOrder(token: string, sellOrderId: string): Promise<Transaction> {
    const response = await this.apiClient.getInstance().get(`/transaction/my?sellOrderId=${sellOrderId}`, {
      headers: {
        authorization: token
      }
    });

    return response.data.transaction;
  }

  public async getSellOrderInfoForBuy(token: string, shoeId: string, shoeSize: string) {
    const queryUrl = `/order/sell-order/get-sell-info-for-buy?shoeId=${shoeId}&shoeSize=${shoeSize}`;

    const response = await this.apiClient.getInstance().get(queryUrl, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }

  public async createBuyOrder(token: string, buyOrder: Partial<BuyOrder>) {
    const response = await this.apiClient.getInstance().post(`/order/buy-order/new`,
      buyOrder,
      {
        headers: {
          authorization: token
        }
      }
    );

    return response.data;
  }

  public async updateSellOrder(token: string, order: SellOrderEditInput): Promise<void> {
    const response = await this.apiClient.getInstance().put(`/order/sell-order/update`, order, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }

  public async cancelSellOrder(token: string, orderId: string): Promise<void> {
    const response = await this.apiClient.getInstance().put(`/order/sell-order/cancel?orderId=${orderId}`, null, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }

  public async getSellOrderById(token: string, orderId: string): Promise<SellOrder> {
    const response = await this.apiClient.getInstance().get(`/order/sell-order/${orderId}`, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }
}