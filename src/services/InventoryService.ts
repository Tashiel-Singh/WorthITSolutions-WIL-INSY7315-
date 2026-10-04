export class InventoryError extends Error { constructor(message: string) { super(message); this.name = 'InventoryError'; } }
export interface StockItem { id: string; sku: string; poolType: 'RETAIL' | 'BULK'; quantity: number; }
export class InventoryService {
  private stockPools: StockItem[] = [
    { id: '1', sku: 'PROD-BULK-01', poolType: 'BULK', quantity: 500 },
    { id: '2', sku: 'PROD-RET-01', poolType: 'RETAIL', quantity: 25 }
  ];
  public allocateStock(sku: string, requestedQty: number, targetPool: 'RETAIL' | 'BULK'): boolean {
    if (requestedQty <= 0) throw new InventoryError('Requested quantity must be greater than zero.');
    const stockItem = this.stockPools.find(item => item.sku === sku && item.poolType === targetPool);
    if (!stockItem) throw new InventoryError('Stock item not found.');
    if (stockItem.quantity < requestedQty) throw new InventoryError('Insufficient stock in pool.');
    stockItem.quantity -= requestedQty;
    return true;
  }
  public getStockLevel(sku: string, poolType: 'RETAIL' | 'BULK'): number {
    const item = this.stockPools.find(i => i.sku === sku && i.poolType === poolType);
    return item ? item.quantity : 0;
  }
}
