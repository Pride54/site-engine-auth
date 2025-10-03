import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import OrdersList from '@/components/OrdersList';
import DriversList from '@/components/DriversList';
import CompletedOrders from '@/components/CompletedOrders';
import MapView from '@/components/MapView';

type OrderStatus = 'delivered' | 'completed' | 'processing' | 'pending';

interface Order {
  id: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  status: OrderStatus;
}

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [archivedOrders, setArchivedOrders] = useState<Order[]>([]);

  const handleViewOnMap = (orderId: string) => {
    setSelectedOrderId(orderId);
    setSelectedDriverId(null);
    setActiveTab('map');
  };

  const handleViewDriverOnMap = (driverId: string) => {
    setSelectedDriverId(driverId);
    setSelectedOrderId(null);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Truck" size={20} className="text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold">Система доставки</h1>
          </div>
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

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-card p-1 rounded-xl">
            <TabsTrigger value="orders" className="rounded-lg gap-2">
              <Icon name="ClipboardList" size={18} />
              <span className="hidden sm:inline">Список заказов</span>
            </TabsTrigger>
            <TabsTrigger value="drivers" className="rounded-lg gap-2">
              <Icon name="Users" size={18} />
              <span className="hidden sm:inline">Водители</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="rounded-lg gap-2">
              <Icon name="Map" size={18} />
              <span className="hidden sm:inline">Карта</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg gap-2">
              <Icon name="CheckCircle2" size={18} />
              <span className="hidden sm:inline">Все заказы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-0">
            <OrdersList 
              onViewOnMap={handleViewOnMap} 
              onOrdersChange={setAllOrders}
              onArchivedOrdersChange={setArchivedOrders}
            />
          </TabsContent>

          <TabsContent value="drivers" className="mt-0">
            <DriversList onViewOnMap={handleViewDriverOnMap} />
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <MapView selectedOrderId={selectedOrderId} selectedDriverId={selectedDriverId} />
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <CompletedOrders orders={allOrders} archivedOrders={archivedOrders} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}