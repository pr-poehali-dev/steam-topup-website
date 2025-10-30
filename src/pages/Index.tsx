import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [amount, setAmount] = useState('');
  const [steamId, setSteamId] = useState('');
  const [activeSection, setActiveSection] = useState<'home' | 'topup' | 'support'>('home');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const popularAmounts = [100, 300, 500, 1000, 2000, 5000];

  const paymentMethods = [
    { id: 'card', name: 'Банковская карта', icon: 'CreditCard' },
    { id: 'sbp', name: 'СБП', icon: 'Smartphone' },
    { id: 'qiwi', name: 'QIWI', icon: 'Wallet' },
    { id: 'yoomoney', name: 'ЮMoney', icon: 'Wallet' },
  ];

  const features = [
    {
      icon: 'Zap',
      title: 'Мгновенное пополнение',
      description: 'Средства зачисляются на ваш аккаунт Steam в течение 1-5 минут'
    },
    {
      icon: 'Shield',
      title: 'Безопасные платежи',
      description: 'Все транзакции защищены современными протоколами шифрования'
    },
    {
      icon: 'Gift',
      title: 'Бонусы и акции',
      description: 'Получайте дополнительные бонусы при пополнении на крупные суммы'
    },
    {
      icon: 'Clock',
      title: 'Поддержка 24/7',
      description: 'Наша служба поддержки всегда готова помочь вам'
    }
  ];

  const faqItems = [
    {
      question: 'Как быстро зачисляются средства?',
      answer: 'Обычно средства поступают на ваш аккаунт Steam в течение 1-5 минут после оплаты. В редких случаях это может занять до 30 минут.'
    },
    {
      question: 'Какая минимальная сумма пополнения?',
      answer: 'Минимальная сумма пополнения составляет 100 рублей. Максимальная сумма - 75 000 рублей за одну транзакцию.'
    },
    {
      question: 'Безопасно ли пополнять через ваш сервис?',
      answer: 'Да, абсолютно безопасно. Мы используем защищенные каналы связи и не храним данные ваших платежных карт. Все платежи проходят через проверенные платежные системы.'
    },
    {
      question: 'Что делать, если средства не пришли?',
      answer: 'Если после 30 минут средства не поступили, обратитесь в нашу службу поддержки через форму на сайте или в Telegram. Мы решим проблему в кратчайшие сроки.'
    }
  ];

  const handleTopup = async () => {
    if (!steamId || !amount) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('https://functions.poehali.dev/47345500-d6ec-4d76-8efe-cc4bef43113d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          steam_id: steamId,
          amount: parseInt(amount),
          payment_method: selectedPaymentMethod
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Платеж создан!\nID транзакции: ${data.transaction_id}\nСтатус: ${data.status}\n\nВ реальной системе здесь будет переход на страницу оплаты.`);
        setSteamId('');
        setAmount('');
      } else {
        alert(`Ошибка: ${data.error || 'Не удалось создать платеж'}`);
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center">
                <Icon name="Gamepad2" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">SteamPay</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => setActiveSection('home')}
                className={`transition-colors hover:text-primary ${activeSection === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Главная
              </button>
              <button 
                onClick={() => setActiveSection('topup')}
                className={`transition-colors hover:text-primary ${activeSection === 'topup' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Пополнение
              </button>
              <button 
                onClick={() => setActiveSection('support')}
                className={`transition-colors hover:text-primary ${activeSection === 'support' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Поддержка
              </button>
            </nav>
            <Button className="gradient-purple border-0 hover:opacity-90 transition-opacity">
              Войти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {activeSection === 'home' && (
          <>
            <section className="text-center mb-20 animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-6 gradient-purple border-0 text-white px-4 py-2">
                  Самый быстрый сервис пополнения Steam
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
                  Пополни Steam за минуту
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Мгновенное зачисление средств на ваш аккаунт Steam. Безопасно, быстро, удобно.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="gradient-purple border-0 text-lg px-8 py-6 hover:opacity-90 transition-opacity"
                    onClick={() => setActiveSection('topup')}
                  >
                    <Icon name="Zap" size={20} className="mr-2" />
                    Пополнить сейчас
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 border-2 hover:bg-muted"
                    onClick={() => setActiveSection('support')}
                  >
                    <Icon name="HelpCircle" size={20} className="mr-2" />
                    Узнать больше
                  </Button>
                </div>
              </div>
            </section>

            <section className="mb-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card 
                    key={index}
                    className="glass-card hover:scale-105 transition-transform duration-300 animate-scale-in border-border/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg gradient-blue flex items-center justify-center mb-4">
                        <Icon name={feature.icon as any} size={24} className="text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="text-center mb-20 py-16 glass-card rounded-2xl">
              <h2 className="text-4xl font-bold mb-6">Почему выбирают нас?</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12 px-6">
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-text mb-2">50К+</div>
                  <p className="text-muted-foreground">Довольных клиентов</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-text mb-2">99.9%</div>
                  <p className="text-muted-foreground">Успешных транзакций</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-text mb-2">1-5 мин</div>
                  <p className="text-muted-foreground">Среднее время зачисления</p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeSection === 'topup' && (
          <section className="max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Пополнение Steam</h2>
              <p className="text-muted-foreground">Заполните данные для пополнения баланса</p>
            </div>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Данные для пополнения</CardTitle>
                <CardDescription>Введите ваш Steam ID и выберите сумму</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Steam ID</label>
                  <Input 
                    placeholder="Введите ваш Steam ID"
                    value={steamId}
                    onChange={(e) => setSteamId(e.target.value)}
                    className="bg-muted/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Сумма пополнения</label>
                  <Input 
                    type="number"
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-muted/50"
                  />
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {popularAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        onClick={() => setAmount(amt.toString())}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {amt}₽
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Способ оплаты</label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <Button
                        key={method.id}
                        variant={selectedPaymentMethod === method.id ? 'default' : 'outline'}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`h-auto py-4 justify-start transition-colors ${
                          selectedPaymentMethod === method.id 
                            ? 'gradient-purple border-0' 
                            : 'hover:bg-primary hover:text-primary-foreground'
                        }`}
                      >
                        <Icon name={method.icon as any} size={20} className="mr-2" />
                        {method.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">К оплате:</span>
                    <span className="text-2xl font-bold gradient-text">
                      {amount || '0'}₽
                    </span>
                  </div>
                  <Button 
                    className="w-full gradient-purple border-0 text-lg py-6 hover:opacity-90 transition-opacity"
                    onClick={handleTopup}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <Icon name="CreditCard" size={20} className="mr-2" />
                        Перейти к оплате
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {activeSection === 'support' && (
          <section className="max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Поддержка</h2>
              <p className="text-muted-foreground">Ответы на популярные вопросы</p>
            </div>

            <Card className="glass-card border-border/50 mb-8">
              <CardHeader>
                <CardTitle>Часто задаваемые вопросы</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Свяжитесь с нами</CardTitle>
                <CardDescription>Не нашли ответ на свой вопрос?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Icon name="Mail" size={24} className="text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">support@steampay.ru</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Icon name="MessageCircle" size={24} className="text-primary" />
                  <div>
                    <div className="font-medium">Telegram</div>
                    <div className="text-sm text-muted-foreground">@steampay_support</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 SteamPay. Все права защищены.</p>
          <p className="text-sm mt-2">Сервис не является официальным партнером Valve Corporation</p>
        </div>
      </footer>
    </div>
  );
}