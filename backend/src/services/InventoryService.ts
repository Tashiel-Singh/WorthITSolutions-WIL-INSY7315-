/**
 * Inventory Allocation & Cannibalization Prevention Service
 * Ported from Role 2 ERP core logic module (feature/erp-core-logic-sprint2-4).
 */

export class InventoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InventoryError';
  }
}

export interface StockItem {
  id: string;
  sku: string;
  poolType: 'RETAIL' | 'BULK';
  quantity: number;
}

export class InventoryService {
  private stockPools: StockItem[] = [];

  constructor(initialPools?: StockItem[]) {
    if (initialPools) {
      this.stockPools = initialPools;
    }
  }

  /**
   * Allocates stock strictly from the designated pool.
   * Throws InventoryError if insufficient units exist, preventing cannibalization.
   */
  public allocateStock(sku: string, requestedQty: number, targetPool: 'RETAIL' | 'BULK'): boolean {
    if (requestedQty <= 0) {
      throw new InventoryError('Requested quantity must be greater than zero.');
    }
    const stockItem = this.stockPools.find(
      (item) => item.sku === sku && item.poolType === targetPool
    );
    if (!stockItem) {
      throw new InventoryError(`Stock item '${sku}' not found in ${targetPool} pool.`);
    }
    if (stockItem.quantity < requestedQty) {
      throw new InventoryError(
        `Cannibalization Protection: Insufficient stock in ${targetPool} pool for SKU ${sku}. Requested: ${requestedQty}, Available: ${stockItem.quantity}.`
      );
    }
    stockItem.quantity -= requestedQty;
    return true;
  }

  public getStockLevel(sku: string, poolType: 'RETAIL' | 'BULK'): number {
    const item = this.stockPools.find((i) => i.sku === sku && i.poolType === poolType);
    return item ? item.quantity : 0;
  }

  public setStockPools(pools: StockItem[]): void {
    this.stockPools = pools;
  }
}

