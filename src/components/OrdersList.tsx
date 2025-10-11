import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import OrdersStats from '@/components/OrdersStats';
import OrderFormDialog from '@/components/orders/OrderFormDialog';
import AssignDriverDialog from '@/components/orders/AssignDriverDialog';
import OrderCard from '@/components/orders/OrderCard';
import ArchivedOrderCard from '@/components/orders/ArchivedOrderCard';
import type { Order, OrderStatus, OrdersListProps, Driver } from '@/components/orders/types';

export default function OrdersList({ onViewOnMap, onOrdersChange, onArchivedOrdersChange }: OrdersListProps = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [archivedOrders, setArchivedOrders] = useState<Order[]>([]);
  const [showArchive, setShowArchive] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState<Order | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const availableDrivers: Driver[] = [
    { id: '1', name: 'Иванов Иван', status: 'active' },
    { id: '2', name: 'Петров Петр', status: 'active' },
    { id: '3', name: 'Сидоров Сидор', status: 'inactive' },
  ];

  const updateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
    if (onOrdersChange) onOrdersChange(newOrders);
  };

  const updateArchivedOrders = (newArchived: Order[]) => {
    setArchivedOrders(newArchived);
    localStorage.setItem('archivedOrders', JSON.stringify(newArchived));
    if (onArchivedOrdersChange) onArchivedOrdersChange(newArchived);
  };

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    const savedArchived = localStorage.getItem('archivedOrders');
    
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setOrders(parsedOrders);
      if (onOrdersChange) onOrdersChange(parsedOrders);
    }
    
    if (savedArchived) {
      const parsedArchived = JSON.parse(savedArchived);
      setArchivedOrders(parsedArchived);
      if (onArchivedOrdersChange) onArchivedOrdersChange(parsedArchived);
    }
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    fromAddress: '',
    toAddress: '',
    status: 'pending' as OrderStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      const updatedOrder = { ...editingOrder, ...formData };
      
      if (updatedOrder.status === 'completed' || updatedOrder.status === 'delivered') {
        updateArchivedOrders([...archivedOrders, updatedOrder]);
        updateOrders(orders.filter(order => order.id !== editingOrder.id));
      } else {
        updateOrders(orders.map(order => 
          order.id === editingOrder.id 
            ? updatedOrder
            : order
        ));
      }
    } else {
      const newOrder: Order = {
        id: String(orders.length + 1).padStart(3, '0'),
        ...formData
      };
      
      if (newOrder.status === 'completed' || newOrder.status === 'delivered') {
        updateArchivedOrders([...archivedOrders, newOrder]);
      } else {
        updateOrders([...orders, newOrder]);
      }
    }
    resetForm();
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      phone: order.phone,
      fromAddress: order.fromAddress,
      toAddress: order.toAddress,
      status: order.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    updateOrders(orders.filter(order => order.id !== id));
  };

  const handleArchive = (id: string) => {
    const orderToArchive = orders.find(order => order.id === id);
    if (orderToArchive) {
      updateArchivedOrders([...archivedOrders, orderToArchive]);
      updateOrders(orders.filter(order => order.id !== id));
    }
  };

  const handleUnarchive = (id: string) => {
    const orderToUnarchive = archivedOrders.find(order => order.id === id);
    if (orderToUnarchive) {
      updateOrders([...orders, orderToUnarchive]);
      updateArchivedOrders(archivedOrders.filter(order => order.id !== id));
    }
  };

  const handleOpenAssignDialog = (order: Order) => {
    setOrderToAssign(order);
    setSelectedDriverId(order.driverId || '');
    setAssignDialogOpen(true);
  };

  const handleAssignDriver = () => {
    if (orderToAssign && selectedDriverId) {
      const driver = availableDrivers.find(d => d.id === selectedDriverId);
      updateOrders(orders.map(order => 
        order.id === orderToAssign.id 
          ? { ...order, driverId: selectedDriverId, driverName: driver?.name }
          : order
      ));
      setAssignDialogOpen(false);
      setOrderToAssign(null);
      setSelectedDriverId('');
    }
  };

  const handleUnassignDriver = (orderId: string) => {
    updateOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, driverId: undefined, driverName: undefined }
        : order
    ));
  };

  const handleDeleteArchived = (id: string) => {
    updateArchivedOrders(archivedOrders.filter(o => o.id !== id));
  };

  const resetForm = () => {
    setFormData({ phone: '', fromAddress: '', toAddress: '', status: 'pending' });
    setEditingOrder(null);
    setIsDialogOpen(false);
  };

  const activeOrders = orders.filter(order => order.status !== 'completed' && order.status !== 'delivered');
  const completedCount = orders.filter(order => order.status === 'completed' || order.status === 'delivered').length;
  const processingCount = orders.filter(order => order.status === 'processing').length;
  const pendingCount = orders.filter(order => order.status === 'pending').length;

  return (
    <div className="space-y-4">
      <OrdersStats 
        total={orders.length}
        completed={completedCount}
        processing={processingCount}
        pending={pendingCount}
      />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-heading font-bold">
            {showArchive ? 'Архив заказов' : 'Активные заказы'}
          </h2>
          <Badge variant="secondary" className="text-xs">
            {showArchive ? archivedOrders.length : activeOrders.length}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowArchive(!showArchive)}
            className="gap-2"
          >
            <Icon name={showArchive ? "List" : "Archive"} size={18} />
            {showArchive ? 'Активные' : 'Архив'}
            {!showArchive && archivedOrders.length > 0 && (
              <Badge variant="secondary" className="ml-1">{archivedOrders.length}</Badge>
            )}
          </Button>
          <OrderFormDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            editingOrder={editingOrder}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
          />
        </div>
      </div>

      <AssignDriverDialog
        assignDialogOpen={assignDialogOpen}
        setAssignDialogOpen={setAssignDialogOpen}
        orderToAssign={orderToAssign}
        selectedDriverId={selectedDriverId}
        setSelectedDriverId={setSelectedDriverId}
        availableDrivers={availableDrivers}
        handleAssignDriver={handleAssignDriver}
      />

      <div className="space-y-3">
        {showArchive ? (
          archivedOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="Archive" size={48} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="font-heading font-semibold text-lg mb-2">Архив пуст</h3>
                <p className="text-muted-foreground text-sm">Здесь будут заказы, которые вы отправите в архив</p>
              </CardContent>
            </Card>
          ) : (
            archivedOrders.map((order) => (
              <ArchivedOrderCard
                key={order.id}
                order={order}
                onUnarchive={handleUnarchive}
                onDelete={handleDeleteArchived}
              />
            ))
          )
        ) : (
          activeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewOnMap={onViewOnMap}
              onEdit={handleEdit}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onOpenAssignDialog={handleOpenAssignDialog}
              onUnassignDriver={handleUnassignDriver}
            />
          ))
        )}
      </div>
    </div>
  );
}