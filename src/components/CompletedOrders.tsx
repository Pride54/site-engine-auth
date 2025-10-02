import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type OrderStatus = 'delivered' | 'completed' | 'processing' | 'pending';

interface Order {
  id: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  status: OrderStatus;
}

interface CompletedOrdersProps {
  orders: Order[];
  archivedOrders: Order[];
}

export default function CompletedOrders({ orders, archivedOrders }: CompletedOrdersProps) {
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

  const allOrders = [...orders, ...archivedOrders];
  const completedOrders = allOrders.filter(order => order.status === 'completed' || order.status === 'delivered');
  const activeOrders = allOrders.filter(order => order.status === 'processing' || order.status === 'pending');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">Все заказы</h2>
        <Badge variant="secondary" className="text-sm">
          Всего: {allOrders.length}
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            Все ({allOrders.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Активные ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Выполненные ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {allOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="font-heading font-semibold text-lg mb-2">Заказов пока нет</h3>
                <p className="text-muted-foreground text-sm">Создайте первый заказ во вкладке "Список заказов"</p>
              </CardContent>
            </Card>
          ) : (
            allOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isArchived = archivedOrders.some(o => o.id === order.id);
              
              return (
                <Card key={order.id} className={`hover:shadow-md transition-shadow ${isArchived ? 'opacity-70' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isArchived ? 'bg-muted' : 'bg-primary/10'
                        }`}>
                          <span className={`font-heading font-bold ${
                            isArchived ? 'text-muted-foreground' : 'text-primary'
                          }`}>#{order.id}</span>
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
                        <Badge className={isArchived ? '' : statusConfig.className} variant={isArchived ? 'secondary' : 'default'}>
                          {statusConfig.label}
                        </Badge>
                        {isArchived && (
                          <Badge variant="outline" className="gap-1">
                            <Icon name="Archive" size={12} />
                            Архив
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-3 mt-4">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="CheckCircle2" size={48} className="mx-auto text-success mb-3" />
                <h3 className="font-heading font-semibold text-lg mb-2">Нет активных заказов</h3>
                <p className="text-muted-foreground text-sm">Все заказы выполнены!</p>
              </CardContent>
            </Card>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="font-heading font-semibold text-lg mb-2">Нет выполненных заказов</h3>
                <p className="text-muted-foreground text-sm">Выполненные заказы появятся здесь</p>
              </CardContent>
            </Card>
          ) : (
            completedOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isArchived = archivedOrders.some(o => o.id === order.id);
              
              return (
                <Card key={order.id} className={`hover:shadow-md transition-shadow ${isArchived ? 'opacity-70' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          order.status === 'delivered' ? 'bg-blue-500/10' : 'bg-success/10'
                        }`}>
                          <span className={`font-heading font-bold ${
                            order.status === 'delivered' ? 'text-blue-500' : 'text-success'
                          }`}>#{order.id}</span>
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
                        {isArchived && (
                          <Badge variant="outline" className="gap-1">
                            <Icon name="Archive" size={12} />
                            Архив
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
