import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  status: 'active' | 'inactive';
  ordersCount: number;
}

export default function DriversList() {
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: '1', name: 'Иванов Иван', phone: '+7 900 111-11-11', vehicle: 'Toyota Camry', plateNumber: 'А123БВ 777', status: 'active', ordersCount: 5 },
    { id: '2', name: 'Петров Петр', phone: '+7 900 222-22-22', vehicle: 'Ford Transit', plateNumber: 'К456МН 197', status: 'active', ordersCount: 3 },
    { id: '3', name: 'Сидоров Сидор', phone: '+7 900 333-33-33', vehicle: 'Mercedes Sprinter', plateNumber: 'Т789ОР 199', status: 'inactive', ordersCount: 0 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    plateNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      setDrivers(drivers.map(driver => 
        driver.id === editingDriver.id 
          ? { ...driver, ...formData }
          : driver
      ));
    } else {
      const newDriver: Driver = {
        id: String(drivers.length + 1),
        ...formData,
        status: 'inactive',
        ordersCount: 0
      };
      setDrivers([...drivers, newDriver]);
    }
    setFormData({ name: '', phone: '', vehicle: '', plateNumber: '' });
    setEditingDriver(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      vehicle: driver.vehicle,
      plateNumber: driver.plateNumber
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDriver(null);
    setFormData({ name: '', phone: '', vehicle: '', plateNumber: '' });
  };

  const toggleDriverStatus = (id: string) => {
    setDrivers(drivers.map(driver => 
      driver.id === id 
        ? { ...driver, status: driver.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : driver
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold">Водители</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Icon name="Plus" size={18} />
              Добавить водителя
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDriver ? 'Редактировать водителя' : 'Новый водитель'}</DialogTitle>
              <DialogDescription>
                {editingDriver ? 'Измените информацию о водителе' : 'Добавьте информацию о водителе'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ФИО</Label>
                <Input
                  id="name"
                  placeholder="Иванов Иван Иванович"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverPhone">Телефон</Label>
                <Input
                  id="driverPhone"
                  placeholder="+7 900 123-45-67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Транспорт</Label>
                <Input
                  id="vehicle"
                  placeholder="Toyota Camry"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Госномер</Label>
                <Input
                  id="plateNumber"
                  placeholder="А123БВ 777"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                  required
                  className="font-mono text-center text-lg tracking-wider"
                  maxLength={20}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {editingDriver ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="User" size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold">{driver.name}</h3>
                      <Button
                        size="sm"
                        variant={driver.status === 'active' ? 'default' : 'outline'}
                        className={`h-6 px-2 text-xs ${driver.status === 'active' ? 'bg-success hover:bg-success/90 text-white' : ''}`}
                        onClick={() => toggleDriverStatus(driver.id)}
                      >
                        {driver.status === 'active' ? 'Активен' : 'Неактивен'}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(driver)}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="Pencil" size={16} />
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={14} className="text-muted-foreground" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Car" size={14} className="text-muted-foreground" />
                  <span>{driver.vehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Package" size={14} className="text-muted-foreground" />
                    <span>Заказов: {driver.ordersCount}</span>
                  </div>
                  <div className="inline-flex items-center bg-gradient-to-r from-white to-gray-50 border-2 border-black rounded px-2 py-1 font-mono font-bold text-black text-xs tracking-wider shadow-sm">
                    <span className="mr-1.5 text-blue-600">RUS</span>
                    {driver.plateNumber}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}