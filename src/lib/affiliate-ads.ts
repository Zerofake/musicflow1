
export interface AffiliateAd {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    link: string;
    source: 'AliExpress' | 'Shopee';
    price?: string;
  }
  
  // Você pode adicionar, editar ou remover seus anúncios de afiliados aqui.
  // Basta seguir o formato do objeto.
  export const affiliateAds: AffiliateAd[] = [
    {
      id: '1',
      imageUrl: 'https://ae01.alicdn.com/kf/S8b762365b4f14e179ae3098dee3bd9582.jpg',
      title: 'Tênis de Corrida Feminino',
      description: 'Respirável, anti-deslizante e na moda.',
      link: 'https://s.click.aliexpress.com/e/_oC7iRRV',
      source: 'AliExpress',
      price: 'R$ 59,19',
    },
    {
      id: '2',
      imageUrl: 'https://picsum.photos/seed/ad2/200/200',
      title: 'Caixa de Som Portátil',
      description: 'Leve a festa com você. Bateria de longa duração.',
      link: 'https://s.shopee.com.br/7fQPS51IQb',
      source: 'Shopee',
      price: 'R$ 89,90',
    },
    {
        id: '3',
        imageUrl: 'https://picsum.photos/seed/ad3/200/200',
        title: 'Microfone Condensador para Estúdio',
        description: 'Grave suas músicas com qualidade profissional.',
        link: 'https://s.click.aliexpress.com/e/_okb6sZH',
        source: 'AliExpress',
        price: 'US$ 25.00',
    },
    {
      id: '4',
      imageUrl: 'https://ae01.alicdn.com/kf/S3ec3daa2da774a66a01ab62e6d7b953fz.jpg',
      title: 'Oferta Especial AliExpress',
      description: 'Confira este produto incrível em promoção.',
      link: 'https://s.click.aliexpress.com/e/_okuWRax',
      source: 'AliExpress',
      price: 'US$ 1.20',
    },
    {
      id: '5',
      imageUrl: 'https://ae01.alicdn.com/kf/S0874c76b0485452d9b68c31d680190a6x.jpg',
      title: 'Xiaomi 2TB USB 3.2 Flash Drive',
      description: 'Alta velocidade de transferência, à prova d\'água.',
      link: 'https://s.click.aliexpress.com/e/_oBKdPUr',
      source: 'AliExpress',
      price: '€ 1.57',
    },
    {
      id: '6',
      imageUrl: 'https://ae01.alicdn.com/kf/S4c8e71805ac24d9cb113515ed64883a7Y.jpg',
      title: 'Fone de Ouvido Bluetooth',
      description: 'Qualidade de som superior e cancelamento de ruído.',
      link: 'https://s.click.aliexpress.com/e/_ootMEUj',
      source: 'AliExpress',
      price: 'R$ 10,78',
    },
    {
      id: '7',
      imageUrl: 'https://picsum.photos/seed/ad7/200/200',
      title: 'Blocos de Montar - Mundo dos Dinossauros',
      description: 'Brinquedos de dinossauros para montar.',
      link: 'https://s.click.aliexpress.com/e/_oFJLXjH',
      source: 'AliExpress',
      price: '€ 0.86'
    },
    {
      id: '8',
      imageUrl: 'https://ae01.alicdn.com/kf/S381ac01bb621412ba4268f62efb274abP.jpg',
      title: 'Oferta Relâmpago',
      description: 'Não perca esta oportunidade incrível.',
      link: 'https://s.click.aliexpress.com/e/_ondvap5',
      source: 'AliExpress',
    },
    {
      id: '9',
      imageUrl: 'https://ae01.alicdn.com/kf/S6a0f4a4c5e3a4739a85a420b925b6424e.jpg',
      title: 'Blocos de Construção Magnéticos',
      description: 'Brinquedos sensoriais para crianças.',
      link: 'https://s.click.aliexpress.com/e/_okUxo7p',
      source: 'AliExpress',
      price: '€ 0.86'
    },
    {
      id: '10',
      imageUrl: 'https://ae01.alicdn.com/kf/S5ec66e16bb9542d381bb91333c90f4177.jpg',
      title: 'Confira esta Oferta',
      description: 'Clique para ver mais detalhes.',
      link: 'https://s.click.aliexpress.com/e/_oC6XJ6T',
      source: 'AliExpress',
    },
    {
      id: '11',
      imageUrl: 'https://ae01.alicdn.com/kf/Sff02da080ee1493cbe4f5b1803d7af18L.jpg',
      title: 'Nova Oferta Imperdível',
      description: 'Produtos selecionados para você.',
      link: 'https://s.click.aliexpress.com/e/_okAkbFN',
      source: 'AliExpress',
    }
  ];
  
