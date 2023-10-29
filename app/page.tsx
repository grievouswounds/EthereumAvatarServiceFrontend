
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Home.module.css';

export default function Home() {
	return (
		<div className={styles.container}>
			<p className={styles.title}>
				Ethereum Avatar Service
			</p>

			<p className={styles.description}>
				Get started below
			</p>

			<div className={styles.grid}>
				<a className={styles.card} href="/manage">
					<h2>Manage Avatar Vault &rarr;</h2>
					<p>Set or remove your avatar. See details of your vault.</p>
				</a>

				<a className={styles.card}
				// href="/lookup"
				>
					<h2>Look up Avatar Vaults &rarr;</h2>
					<p>See how others are expressing themselves (Coming soon...)</p>
				</a>

				<a className={styles.card} href="/faucet">
					<h2>EAS faucet &rarr;</h2>
					<p>Don&apos;t have any EAS coins? Get some for free here,</p>
				</a>


				<a className={styles.card} href="/nft">
					<h2>Mint free NFT &rarr;</h2>
					<p>Don&apos;t have an NFT to express yourself with? Mint a free one here.</p>
				</a>

				<a className={styles.card}
					href="https://ethereum-avatar-service.gitbook.io/docs/"
				>
					<h2>Documentation &rarr;</h2>
					<p>Learn more about Ethereum Avatar service and how it works. </p>
				</a>

				<a className={styles.card} href="/liquidate">
					<h2>Liquidate &rarr;</h2>
					<p>Liquidate missbehaving users and earn EAS.</p>
				</a>

			</div>


		</div >
	);
}
