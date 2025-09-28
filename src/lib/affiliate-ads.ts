

export interface AffiliateAd {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    link: string;
    source: 'AliExpress' | 'Shopee';
    price?: string;
  }
  
  // Anúncios para o banner superior (TimedAd)
  export const timedAds: AffiliateAd[] = [
    {
        id: 'timed-1',
        imageUrl: 'https://ae-pic-a1.aliexpress-media.com/kf/S2a797cbd3a004b5cb4f0897b2793cb9ef.png',
        title: 'Oferta Especial',
        description: 'Clique para conferir!',
        link: 'https://s.click.aliexpress.com/e/_oDGZedf?bz=300*250',
        source: 'AliExpress'
      },
      {
        id: 'timed-2',
        imageUrl: 'https://ae01.alicdn.com/kf/S6694cea45c4648d689341a588ef5e4ec4.jpg_80x80.jpg',
        title: 'Brinquedo Lançador de Foguete',
        description: 'Diversão garantida para as crianças.',
        link: 'https://s.click.aliexpress.com/e/_oC35JBf',
        source: 'AliExpress',
        price: 'US$ 0.99',
      },
  ];
  
  // Anúncios para o banner inferior (AffiliateAd)
  export const affiliateAds: AffiliateAd[] = [
    {
      id: '20',
      imageUrl: 'https://ae01.alicdn.com/kf/Sa6a55c3904e8446b9bd86b1a7a9bd73ah.jpg_80x80.jpg',
      title: 'Camisa Estampa Naruto Kakashi',
      description: 'Estilo anime para seu guarda-roupa.',
      link: 'https://s.click.aliexpress.com/e/_c4mgDu0b',
      source: 'AliExpress',
      price: 'US$ 2.99',
    },
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
        imageUrl: 'https://ae01.alicdn.com/kf/S6694cea45c4648d689341a588ef5e4ec4.jpg_80x80.jpg',
        title: 'Brinquedo Lançador de Foguete',
        description: 'Diversão garantida para as crianças.',
        link: 'https://s.click.aliexpress.com/e/_oC35JBf',
        source: 'AliExpress',
        price: 'US$ 0.99',
    },
    {
      id: '6',
      imageUrl: 'https://ae01.alicdn.com/kf/S4c8e71805ac24d9cb113515ed64883a7Y.jpg',
      title: 'Robô 3D com múltiplas articulações e mudança de forma móvel',
      description: 'Qualidade de som superior e cancelamento de ruído.',
      link: 'https://s.click.aliexpress.com/e/_ootMEUj',
      source: 'AliExpress',
      price: 'R$ 10,78',
    },
    {
      id: '4',
      imageUrl: 'https://ae01.alicdn.com/kf/S3ec3daa2da774a66a01ab62e6d7b953fz.jpg',
      title: 'Xiaomi 2TB USB Flash Drive',
      description: 'Pen Drive de alta velocidade e capacidade.',
      link: 'https://s.click.aliexpress.com/e/_okuWRax',
      source: 'AliExpress',
      price: 'US$ 1.20',
    },
    {
      id: '7',
      imageUrl: 'https://ae01.alicdn.com/kf/S6a0f4a4c5e3a4739a85a420b925b6424e.jpg',
      title: 'Blocos de Montar - Mundo dos Dinossauros',
      description: 'Brinquedos de dinossauros para montar.',
      link: 'https://s.click.aliexpress.com/e/_oFJLXjH',
      source: 'AliExpress',
      price: '€ 0.86'
    },
    {
      id: '9',
      imageUrl: 'https://ae01.alicdn.com/kf/S1a232165e38c4161aaa4c4f066a2c93di.jpg',
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
    },
    {
      id: '12',
      imageUrl: 'https://ae01.alicdn.com/kf/Sa19dd387a400404ab684291c1dd0744aA.jpg',
      title: 'Super Desconto',
      description: 'Aproveite agora mesmo!',
      link: 'https://s.click.aliexpress.com/e/_omF0XOb',
      source: 'AliExpress',
    },
    {
      id: '13',
      imageUrl: 'https://ae01.alicdn.com/kf/Acbe922e6c9da41c5bb9e8ce9217edc46c.jpg',
      title: 'Nova Oferta Especial',
      description: 'Clique para conferir os detalhes.',
      link: 'https://s.click.aliexpress.com/e/_onfY33l',
      source: 'AliExpress',
      price: 'US $4.62',
    },
    {
      id: '14',
      imageUrl: 'https://ae01.alicdn.com/kf/S98ce12c3820149419d59a648a90a671fv.jpg',
      title: 'SomnAmbulist SSD 512 GB',
      description: 'SSD de alta velocidade para seu PC.',
      link: 'https://s.click.aliexpress.com/e/_omUYkEB',
      source: 'AliExpress',
      price: '$21.59'
    },
    {
      id: '15',
      imageUrl: 'https://ae01.alicdn.com/kf/Sd54c331d24a0449c8aa3b1c1de9896b6H.jpg',
      title: 'Super Oferta',
      description: 'Clique para mais detalhes.',
      link: 'https://s.click.aliexpress.com/e/_onkaGZ5',
      source: 'AliExpress',
      price: 'US $12.08',
    },
    {
      id: '16',
      imageUrl: 'https://ae01.alicdn.com/kf/S1a232165e38c4161aaa4c4f066a2c93di.jpg',
      title: 'Confira esta Nova Oferta',
      description: 'Clique para ver mais detalhes.',
      link: 'https://s.click.aliexpress.com/e/_opoaQin',
      source: 'AliExpress',
      price: 'US $7.35',
    },
    {
      id: '17',
      imageUrl: 'https://ae01.alicdn.com/kf/S9031b3552a4041db89b9531beeda3d6fh.jpg',
      title: 'Men shoes Sneakers Male',
      description: '76% off',
      link: 'https://s.click.aliexpress.com/e/_oDyNa87',
      source: 'AliExpress',
      price: 'US $10.72',
    },
    {
      id: '18',
      imageUrl: 'https://ae01.alicdn.com/kf/S9f99fa86c441476291de741538490309f.jpg',
      title: 'Imã de Geladeira Solo Leveling',
      description: 'Anime Sung Jin-Woo Cosplay 58mm',
      link: 'https://s.click.aliexpress.com/e/_oDWcpx19',
      source: 'AliExpress',
      price: 'US $0.96',
    },
    {
      id: '19',
      imageUrl: 'https://ae01.alicdn.com/kf/Se022ccdeb0974e12827b970f3478c26es.jpg',
      title: 'Pelúcia Pokémon Pikachu 20cm',
      description: 'Brinquedo de pelúcia Kawaii Pikachu.',
      link: 'https://s.click.aliexpress.com/e/_oFeUku7',
      source: 'AliExpress',
      price: '$0.99',
    }
  ];
  
  
