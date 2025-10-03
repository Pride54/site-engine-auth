export type OrderStatus = 'delivered' | 'completed' | 'processing' | 'pending';

export interface Order {
  id: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  status: OrderStatus;
  driverId?: string;
  driverName?: string;
}

export interface Driver {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface OrdersListProps {
  onViewOnMap?: (orderId: string) => void;
  onOrdersChange?: (orders: Order[]) => void;
  onArchivedOrdersChange?: (orders: Order[]) => void;
}

export const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return { label: 'Доставлено', className: 'bg-blue-500 text-white hover:bg-blue-600' };
    case 'completed':
      return { label: 'Выполнено', className: 'bg-success text-white hover:bg-success/90' };
    case 'processing':
      return { label: 'В обработке', className: 'bg-warning text-white hover:bg-warning/90' };
    case 'pending':
      return { label: 'Не выполнено', className: 'bg-error text-white hover:bg-error/90' };
  }
};
