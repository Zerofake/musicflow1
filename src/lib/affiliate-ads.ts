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
      imageUrl: 'https://picsum.photos/seed/ad1/200/200',
      title: 'Fone de Ouvido Bluetooth TWS',
      description: 'Som de alta fidelidade e cancelamento de ruído.',
      link: '#', // TODO: Substitua pelo seu link de afiliado
      source: 'AliExpress',
    },
    {
      id: '2',
      imageUrl: 'https://picsum.photos/seed/ad2/200/200',
      title: 'Caixa de Som Portátil',
      description: 'Leve a festa com você. Bateria de longa duração.',
      link: '#', // TODO: Substitua pelo seu link de afiliado
      source: 'Shopee',
    },
    {
        id: '3',
        imageUrl: 'https://picsum.photos/seed/ad3/200/200',
        title: 'Microfone Condensador para Estúdio',
        description: 'Grave suas músicas com qualidade profissional.',
        link: '#', // TODO: Substitua pelo seu link de afiliado
        source: 'AliExpress',
    },
  ];
  