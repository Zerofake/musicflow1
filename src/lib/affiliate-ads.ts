
export interface AffiliateAd {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    link: string;
    source: 'AliExpress' | 'Shopee';
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
    },
    {
      id: '2',
      imageUrl: 'https://picsum.photos/seed/ad2/200/200',
      title: 'Caixa de Som Portátil',
      description: 'Leve a festa com você. Bateria de longa duração.',
      link: 'https://s.click.aliexpress.com/e/_onXurGP',
      source: 'Shopee',
    },
    {
        id: '3',
        imageUrl: 'https://picsum.photos/seed/ad3/200/200',
        title: 'Microfone Condensador para Estúdio',
        description: 'Grave suas músicas com qualidade profissional.',
        link: 'https://s.click.aliexpress.com/e/_okb6sZH',
        source: 'AliExpress',
    },
    {
      id: '4',
      imageUrl: 'https://picsum.photos/seed/ad4/200/200',
      title: 'Oferta Especial AliExpress',
      description: 'Confira este produto incrível em promoção.',
      link: 'https://s.click.aliexpress.com/e/_on4v0F1',
      source: 'AliExpress',
    },
    {
      id: '5',
      imageUrl: 'https://ae01.alicdn.com/kf/S0874c76b0485452d9b68c31d680190a6x.jpg',
      title: 'Xiaomi 2TB USB 3.2 Flash Drive',
      description: 'Alta velocidade de transferência, à prova d\'água.',
      link: 'https://s.click.aliexpress.com/e/_oBKdPUr',
      source: 'AliExpress',
    },
  ];
  
