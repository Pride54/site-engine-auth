import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Order {
  id: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  status: 'completed' | 'processing' | 'pending';
  fromCoords?: [number, number];
  toCoords?: [number, number];
}

interface Driver {
  id: string;
  name: string;
  coords: [number, number];
  status: 'active' | 'inactive';
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const demoOrders: Order[] = [
    {
      id: '001',
      phone: '+7 900 123-45-67',
      fromAddress: 'ул. Ленина, 10',
      toAddress: 'ул. Пушкина, 25',
      status: 'processing',
      fromCoords: [55.751244, 37.618423],
      toCoords: [55.755244, 37.625423]
    },
    {
      id: '002',
      phone: '+7 900 234-56-78',
      fromAddress: 'пр. Мира, 5',
      toAddress: 'ул. Гагарина, 12',
      status: 'pending',
      fromCoords: [55.748, 37.615],
      toCoords: [55.753, 37.621]
    }
  ];

  const demoDrivers: Driver[] = [
    {
      id: '1',
      name: 'Иванов Иван',
      coords: [55.753244, 37.621423],
      status: 'active'
    },
    {
      id: '2',
      name: 'Петров Петр',
      coords: [55.750, 37.618],
      status: 'active'
    }
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU';
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
      initMap();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !(window as any).ymaps) return;

    (window as any).ymaps.ready(() => {
      const map = new (window as any).ymaps.Map(mapRef.current, {
        center: [55.751244, 37.618423],
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
      });

      demoOrders.forEach((order) => {
        if (order.fromCoords && order.toCoords) {
          const fromPlacemark = new (window as any).ymaps.Placemark(
            order.fromCoords,
            {
              balloonContent: `<strong>Заказ #${order.id}</strong><br>Откуда: ${order.fromAddress}<br>Телефон: ${order.phone}`,
              iconCaption: `#${order.id} Откуда`
            },
            {
              preset: 'islands#greenDotIconWithCaption',
              iconColor: order.status === 'processing' ? '#FF9800' : '#F44436'
            }
          );

          const toPlacemark = new (window as any).ymaps.Placemark(
            order.toCoords,
            {
              balloonContent: `<strong>Заказ #${order.id}</strong><br>Куда: ${order.toAddress}`,
              iconCaption: `#${order.id} Куда`
            },
            {
              preset: 'islands#blueDotIconWithCaption'
            }
          );

          map.geoObjects.add(fromPlacemark);
          map.geoObjects.add(toPlacemark);

          const route = new (window as any).ymaps.multiRouter.MultiRoute(
            {
              referencePoints: [order.fromCoords, order.toCoords]
            },
            {
              boundsAutoApply: false,
              routeActiveStrokeWidth: 4,
              routeActiveStrokeColor: order.status === 'processing' ? '#FF9800' : '#F44436'
            }
          );

          map.geoObjects.add(route);
        }
      });

      demoDrivers.forEach((driver) => {
        const driverPlacemark = new (window as any).ymaps.Placemark(
          driver.coords,
          {
            balloonContent: `<strong>${driver.name}</strong><br>Статус: ${driver.status === 'active' ? 'Активен' : 'Неактивен'}`,
            iconCaption: driver.name
          },
          {
            preset: 'islands#carIcon',
            iconColor: '#4CAF50'
          }
        );

        map.geoObjects.add(driverPlacemark);
      });
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Выполнено', className: 'bg-success text-white' };
      case 'processing':
        return { label: 'В обработке', className: 'bg-warning text-white' };
      case 'pending':
        return { label: 'Не выполнено', className: 'bg-error text-white' };
      default:
        return { label: 'Неизвестно', className: 'bg-muted' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">Онлайн карта</h2>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <Icon name="Package" size={14} />
            {demoOrders.length} заказов
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Icon name="Car" size={14} />
            {demoDrivers.filter(d => d.status === 'active').length} водителей
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div 
              ref={mapRef} 
              className="w-full h-[600px] bg-muted"
              style={{ position: 'relative' }}
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Загрузка карты...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
              <Icon name="Package" size={18} />
              Активные заказы
            </h3>
            <div className="space-y-2 max-h-[260px] overflow-y-auto">
              {demoOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading font-semibold">#{order.id}</span>
                      <Badge className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        <span className="truncate">{order.fromAddress}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Navigation" size={12} />
                        <span className="truncate">{order.toAddress}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
              <Icon name="Car" size={18} />
              Водители онлайн
            </h3>
            <div className="space-y-2 max-h-[260px] overflow-y-auto">
              {demoDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="p-3 rounded-lg border border-border hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                        <Icon name="User" size={16} className="text-success" />
                      </div>
                      <span className="font-medium text-sm">{driver.name}</span>
                    </div>
                    {driver.status === 'active' && (
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary mb-1">Легенда карты</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span>В обработке</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-error" />
                    <span>Не выполнено</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Car" size={12} className="text-success" />
                    <span>Водители</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
