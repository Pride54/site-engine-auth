import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import OrdersStats from '@/components/OrdersStats';

type OrderStatus = 'delivered' | 'completed' | 'processing' | 'pending';

interface Order {
  id: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  status: OrderStatus;
}

interface OrdersListProps {
  onViewOnMap?: (orderId: string) => void;
}

export default function OrdersList({ onViewOnMap }: OrdersListProps = {}) {
  const [orders, setOrders] = useState<Order[]>([
    { id: '001', phone: '+7 900 123-45-67', fromAddress: 'ул. Ленина, 10', toAddress: 'ул. Пушкина, 25', status: 'processing' },
    { id: '002', phone: '+7 900 234-56-78', fromAddress: 'пр. Мира, 5', toAddress: 'ул. Гагарина, 12', status: 'pending' },
    { id: '003', phone: '+7 900 345-67-89', fromAddress: 'ул. Советская, 3', toAddress: 'пр. Победы, 18', status: 'delivered' },
    { id: '004', phone: '+7 900 456-78-90', fromAddress: 'ул. Ломоносова, 7', toAddress: 'ул. Кирова, 22', status: 'completed' },
    { id: '005', phone: '+7 900 567-89-01', fromAddress: 'пр. Ленина, 45', toAddress: 'ул. Жукова, 8', status: 'completed' },
  ]);
  const [archivedOrders, setArchivedOrders] = useState<Order[]>([]);
  const [showArchive, setShowArchive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    fromAddress: '',
    toAddress: '',
    status: 'pending' as OrderStatus
  });

  const getStatusConfig = (status: OrderStatus) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders(orders.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...formData }
          : order
      ));
    } else {
      const newOrder: Order = {
        id: String(orders.length + 1).padStart(3, '0'),
        ...formData
      };
      setOrders([...orders, newOrder]);
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
    setOrders(orders.filter(order => order.id !== id));
  };

  const handleArchive = (id: string) => {
    const orderToArchive = orders.find(order => order.id === id);
    if (orderToArchive) {
      setArchivedOrders([...archivedOrders, orderToArchive]);
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const handleUnarchive = (id: string) => {
    const orderToUnarchive = archivedOrders.find(order => order.id === id);
    if (orderToUnarchive) {
      setOrders([...orders, orderToUnarchive]);
      setArchivedOrders(archivedOrders.filter(order => order.id !== id));
    }
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
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Icon name="Plus" size={18} />
              Новый заказ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingOrder ? 'Редактировать заказ' : 'Новый заказ'}</DialogTitle>
              <DialogDescription>
                Заполните информацию о заказе
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  placeholder="+7 900 123-45-67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from">Откуда</Label>
                <Input
                  id="from"
                  placeholder="Адрес отправки"
                  value={formData.fromAddress}
                  onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">Куда</Label>
                <Input
                  id="to"
                  placeholder="Адрес доставки"
                  value={formData.toAddress}
                  onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select value={formData.status} onValueChange={(value: OrderStatus) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Не выполнено</SelectItem>
                    <SelectItem value="processing">В обработке</SelectItem>
                    <SelectItem value="completed">Выполнено</SelectItem>
                    <SelectItem value="delivered">Доставлено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {editingOrder ? 'Сохранить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
            archivedOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                          <span className="font-heading font-bold text-muted-foreground">#{order.id}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon name="Phone" size={16} className="text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{order.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} className="text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{order.fromAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Navigation" size={16} className="text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{order.toAddress}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary">
                          {statusConfig.label}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleUnarchive(order.id)}
                          title="Восстановить"
                        >
                          <Icon name="ArchiveRestore" size={18} className="text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => {
                          setArchivedOrders(archivedOrders.filter(o => o.id !== order.id));
                        }}>
                          <Icon name="Trash2" size={18} className="text-error" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )
        ) : (
          activeOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="font-heading font-bold text-primary">#{order.id}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" size={16} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={16} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{order.fromAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Navigation" size={16} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{order.toAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                      {onViewOnMap && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onViewOnMap(order.id)}
                          title="Показать на карте"
                        >
                          <Icon name="MapPin" size={18} className="text-primary" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(order)}>
                        <Icon name="Edit" size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleArchive(order.id)}
                        title="В архив"
                      >
                        <Icon name="Archive" size={18} className="text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id)}>
                        <Icon name="Trash2" size={18} className="text-error" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}