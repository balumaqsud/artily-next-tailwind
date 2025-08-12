import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/artly-logo.png" />

				{/* SEO */}
				<meta
					name="keyword"
					content={
						'artly, artly.com, artly marketplace, artly nestjs fullstack, Artly: Crafted by Hands, Chosen by Heart.'
					}
				/>
				<meta
					name={'description'}
					content={
						'Artly is your marketplace for unique, handmade creations from talented artisans everywhere. Every piece carries a story—thoughtfully designed, skillfully made, and ready to bring character and meaning into your space. Support creators, celebrate craftsmanship, and find something that feels like it was made just for you.' +
						'Artly는 재능 있는 장인들이 만든 독창적이고 수작업으로 만든 작품을 판매하는 마켓플레이스입니다. 모든 작품에는 신중하게 설계되고, 능숙하게 만들어졌으며, 캐릭터와 의미를 공간에 전달할 준비가 된 스토리가 담겨 있습니다. 크리에이터를 지원하고, 장인 정신을 기념하며, 자신만을 위해 만들어진 듯한 느낌의 작품을 찾아보세요.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
