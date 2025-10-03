import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type OrderStatus = 'delivered' | 'completed' | 'processing' | 'pending';

interface Order {
  id: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  status: OrderStatus;
  driverId?: string;
}

interface DriverPortalProps {
  driverId: string;
  driverName: string;
  onLogout: () => void;
}

export default function DriverPortal({ driverId, driverName, onLogout }: DriverPortalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders);
        const myOrders = allOrders.filter((order: Order) => order.driverId === driverId);
        
        if (myOrders.length > orders.length) {
          const newOrders = myOrders.filter(
            (newOrder: Order) => !orders.find(o => o.id === newOrder.id)
          );
          
          newOrders.forEach((order: Order) => {
            if (notificationPermission === 'granted') {
              new Notification('Новый заказ!', {
                body: `Заказ #${order.id}\nОткуда: ${order.fromAddress}\nКуда: ${order.toAddress}`,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `order-${order.id}`,
                requireInteraction: true
              });
            }
            
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
          });
        }
        
        setOrders(myOrders);
      }
    };

    loadOrders();

    const handleStorageChange = () => {
      loadOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadOrders, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [driverId, orders.length, notificationPermission]);

  const handleStartOrder = (orderId: string) => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders);
      const updatedOrders = allOrders.map((order: Order) => 
        order.id === orderId ? { ...order, status: 'processing' as OrderStatus } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'processing' as OrderStatus } : order
      ));
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const completedOrder = { ...order, status: 'delivered' as OrderStatus };
      setCompletedOrders([completedOrder, ...completedOrders]);
      setOrders(orders.filter(o => o.id !== orderId));
      
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders);
        const updatedOrders = allOrders.map((o: Order) => 
          o.id === orderId ? completedOrder : o
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
      }
    }
  };

  const activeOrders = orders.filter(o => o.status === 'processing' || o.status === 'pending');

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return { label: 'В пути', className: 'bg-warning text-white', icon: 'Truck' };
      case 'pending':
        return { label: 'Новый', className: 'bg-blue-500 text-white', icon: 'PackagePlus' };
      case 'delivered':
        return { label: 'Доставлено', className: 'bg-success text-white', icon: 'CheckCircle2' };
      default:
        return { label: 'Выполнено', className: 'bg-success text-white', icon: 'CheckCircle2' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center">
              <Icon name="User" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold">Кабинет водителя</h1>
              <p className="text-sm text-muted-foreground">{driverName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notificationPermission === 'granted' && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Icon name="Bell" size={12} />
                Уведомления вкл
              </Badge>
            )}
            <Button 
              variant="outline" 
            onClick={onLogout}
            className="gap-2"
          >
            <Icon name="LogOut" size={18} />
            Выход
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Активные заказы</p>
                  <p className="text-3xl font-bold">{activeOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="Package" size={24} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Выполнено сегодня</p>
                  <p className="text-3xl font-bold">{completedOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Icon name="CheckCircle2" size={24} className="text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Статус</p>
                  <p className="text-lg font-semibold text-success">Онлайн</p>
                </div>
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Активные заказы */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-heading font-bold">Мои заказы</h2>
            <Badge variant="secondary">
              {activeOrders.length} активных
            </Badge>
          </div>

          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon name="CheckCircle2" size={48} className="mx-auto text-success mb-3" />
                  <h3 className="font-heading font-semibold text-lg mb-2">Нет активных заказов</h3>
                  <p className="text-muted-foreground text-sm">Отличная работа! Все заказы выполнены</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                
                return (
                  <Card key={order.id} className="hover:shadow-lg transition-all border-l-4 border-l-primary">
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                              <span className="font-heading font-bold text-primary text-lg">#{order.id}</span>
                            </div>
                            <div>
                              <Badge className={statusConfig.className}>
                                <Icon name={statusConfig.icon as any} size={14} className="mr-1" />
                                {statusConfig.label}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">Заказ {order.id}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Icon name="Phone" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Телефон клиента</p>
                              <a href={`tel:${order.phone}`} className="font-semibold text-primary hover:underline">
                                {order.phone}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Icon name="MapPin" size={20} className="text-success flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Откуда</p>
                              <p className="font-semibold">{order.fromAddress}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pl-8">
                            <div className="w-px h-6 bg-border" />
                            <Icon name="ArrowDown" size={16} className="text-muted-foreground" />
                          </div>

                          <div className="flex items-start gap-3">
                            <Icon name="Navigation" size={20} className="text-error flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Куда</p>
                              <p className="font-semibold">{order.toAddress}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {order.status === 'pending' && (
                            <Button 
                              onClick={() => handleStartOrder(order.id)}
                              className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                            >
                              <Icon name="Play" size={18} />
                              Начать выполнение
                            </Button>
                          )}
                          
                          {order.status === 'processing' && (
                            <>
                              <Button 
                                onClick={() => handleCompleteOrder(order.id)}
                                className="flex-1 bg-success hover:bg-success/90 gap-2"
                              >
                                <Icon name="CheckCircle2" size={18} />
                                Доставлено
                              </Button>
                              <Button 
                                variant="outline"
                                asChild
                                className="gap-2"
                              >
                                <a href={`https://yandex.ru/maps/?text=${encodeURIComponent(order.toAddress)}`} target="_blank" rel="noopener noreferrer">
                                  <Icon name="Map" size={18} />
                                  Карта
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Выполненные заказы */}
        {completedOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-heading font-bold mb-4">Выполненные сегодня</h2>
            <div className="space-y-2">
              {completedOrders.map((order) => (
                <Card key={order.id} className="opacity-70">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <Icon name="CheckCircle2" size={20} className="text-success" />
                        </div>
                        <div>
                          <p className="font-semibold">Заказ #{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.toAddress}</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-white">
                        Доставлено
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}