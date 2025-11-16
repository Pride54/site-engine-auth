import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  plateNumber?: string;
  vehicle?: string;
}

interface MapViewProps {
  selectedOrderId?: string | null;
  selectedDriverId?: string | null;
}

export default function MapView({ selectedOrderId, selectedDriverId }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const driverPlacemarksRef = useRef<Map<string, any>>(new Map());

  const demoOrders: Order[] = [
    {
      id: '1247',
      phone: '+7 913 123-45-67',
      fromAddress: 'ул. Ленина, 52, Новосибирск',
      toAddress: 'пр. Красный, 18, Новосибирск',
      status: 'processing',
      fromCoords: [55.030199, 82.920763],
      toCoords: [55.041432, 82.934342]
    },
    {
      id: '1248',
      phone: '+7 913 234-56-78',
      fromAddress: 'ул. Крылова, 36, Новосибирск',
      toAddress: 'Вокзальная магистраль, 1, Новосибирск',
      status: 'completed',
      fromCoords: [55.028745, 82.907511],
      toCoords: [55.049361, 82.913734]
    },
    {
      id: '1249',
      phone: '+7 913 345-67-89',
      fromAddress: 'пр. Дзержинского, 24, Новосибирск',
      toAddress: 'ул. Фрунзе, 5, Новосибирск',
      status: 'pending',
      fromCoords: [55.017893, 82.950123],
      toCoords: [55.028956, 82.928734]
    },
    {
      id: '1250',
      phone: '+7 913 456-78-90',
      fromAddress: 'ул. Станиславского, 18, Новосибирск',
      toAddress: 'пр. Карла Маркса, 30, Новосибирск',
      status: 'processing',
      fromCoords: [55.042187, 82.918456],
      toCoords: [55.032765, 82.915234]
    },
    {
      id: '1251',
      phone: '+7 913 567-89-01',
      fromAddress: 'ул. Кирова, 86, Новосибирск',
      toAddress: 'ул. Челюскинцев, 15, Новосибирск',
      status: 'completed',
      fromCoords: [55.024567, 82.912345],
      toCoords: [55.038901, 82.945678]
    }
  ];

  const demoDrivers: Driver[] = [
    {
      id: 'driver-1',
      name: 'Алексей',
      coords: [55.035234, 82.925678],
      status: 'active',
      plateNumber: 'А123ВС154',
      vehicle: 'Hyundai Solaris'
    },
    {
      id: 'driver-2',
      name: 'Дмитрий',
      coords: [55.027890, 82.917345],
      status: 'active',
      plateNumber: 'В456КМ154',
      vehicle: 'Kia Rio'
    },
    {
      id: 'driver-3',
      name: 'Сергей',
      coords: [55.045123, 82.938901],
      status: 'active',
      plateNumber: 'С789НР154',
      vehicle: 'Volkswagen Polo'
    },
    {
      id: 'driver-4',
      name: 'Михаил',
      coords: [55.021456, 82.909234],
      status: 'inactive',
      plateNumber: 'Е012ТХ154',
      vehicle: 'Renault Logan'
    }
  ];

  useEffect(() => {
    if (selectedOrderId) {
      const order = demoOrders.find(o => o.id === selectedOrderId);
      if (order) {
        setSelectedOrder(order);
        setSelectedDriver(null);
        if (mapInstanceRef.current && order.toCoords) {
          mapInstanceRef.current.setCenter(order.toCoords, 14, {
            duration: 500
          });
        }
      }
    }
  }, [selectedOrderId]);

  useEffect(() => {
    if (selectedDriverId) {
      const driver = demoDrivers.find(d => d.id === selectedDriverId);
      if (driver) {
        setSelectedDriver(driver);
        setSelectedOrder(null);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(driver.coords, 15, {
            duration: 500
          });
          
          const placemark = driverPlacemarksRef.current.get(driver.id);
          if (placemark) {
            placemark.balloon.open();
          }
        }
      }
    }
  }, [selectedDriverId]);

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
        center: [55.030204, 82.920430],
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
      });

      mapInstanceRef.current = map;

      demoOrders.forEach((order) => {
        if (order.toCoords) {
          const toPlacemark = new (window as any).ymaps.Placemark(
            order.toCoords,
            {
              balloonContent: `<strong>Заказ #${order.id}</strong><br>Куда: ${order.toAddress}<br>Телефон: ${order.phone}`,
              iconCaption: `#${order.id}`
            },
            {
              preset: 'islands#dotIconWithCaption',
              iconColor: order.status === 'processing' ? '#FF9800' : order.status === 'completed' ? '#4CAF50' : '#F44436'
            }
          );

          toPlacemark.events.add('click', () => {
            setSelectedOrder(order);
          });

          map.geoObjects.add(toPlacemark);
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

        driverPlacemark.events.add('click', () => {
          setSelectedDriver(driver);
          setSelectedOrder(null);
        });

        driverPlacemarksRef.current.set(driver.id, driverPlacemark);
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
        <div>
          <h2 className="text-2xl font-heading font-bold">Онлайн карта</h2>
          {selectedOrder && (
            <p className="text-sm text-muted-foreground mt-1">
              Выбран заказ: <span className="font-semibold text-primary">#{selectedOrder.id}</span>
            </p>
          )}
          {selectedDriver && (
            <p className="text-sm text-muted-foreground mt-1">
              Выбран водитель: <span className="font-semibold text-success">{selectedDriver.name}</span>
            </p>
          )}
        </div>
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
                    onClick={() => {
                      setSelectedOrder(order);
                      if (mapInstanceRef.current && order.toCoords) {
                        mapInstanceRef.current.setCenter(order.toCoords, 14, {
                          duration: 500
                        });
                      }
                    }}
                    className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id ? 'border-primary bg-primary/5 shadow-lg' : 'border-border'
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
              <TooltipProvider>
                {demoDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => {
                      setSelectedDriver(driver);
                      setSelectedOrder(null);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setCenter(driver.coords, 15, {
                          duration: 500
                        });
                        const placemark = driverPlacemarksRef.current.get(driver.id);
                        if (placemark) {
                          placemark.balloon.open();
                        }
                      }
                    }}
                    className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                      selectedDriver?.id === driver.id ? 'border-success bg-success/5 shadow-lg' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                          <Icon name="User" size={16} className="text-success" />
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium text-sm cursor-help border-b border-dashed border-muted-foreground/40">
                              {driver.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-semibold">{driver.vehicle}</p>
                              <div className="inline-flex items-center bg-gradient-to-r from-white to-gray-50 border-2 border-black rounded px-2 py-0.5 font-mono font-bold text-black text-xs tracking-wider">
                                <span className="mr-1 text-blue-600 text-[10px]">RUS</span>
                                {driver.plateNumber}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      {driver.status === 'active' && (
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>
                ))}
              </TooltipProvider>
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