'use client'

import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import styles from '../styles/Home.module.css';
import { ConnectButton, RainbowKitProvider, AvatarComponent, getDefaultWallets } from '@rainbow-me/rainbowkit';
// import { generateColorFromAddress } from './utils';
import '@rainbow-me/rainbowkit/styles.css';
import { Address, configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import {
	mainnet,
	polygon,
	goerli,
	optimism,
	arbitrum,
	base,
	zora,
	hardhat
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
// import { getavataruri } from "@/helpers/avatarLoader";
import React, { useEffect, useState } from 'react';
import readpreperations from '@/helpers/contractReaders';
import { useAccount } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { getEmojiFromAddress, getColorFromAddress } from "../helpers/avatarLoader";
import { table } from "console";


const { chains, publicClient, webSocketPublicClient } = configureChains(
	[
		hardhat,
		mainnet,
		sepolia,
		...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
	],
	[infuraProvider({ apiKey: process.env.SEPOLIAKEY as string }), publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: 'My RainbowKit App',
	projectId: 'YOUR_PROJECT_ID',
	chains
});

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: connectors,
	publicClient
})

// const wagmiConfig = createConfig({
// 	autoConnect: true,
// 	connectors,
// 	publicClient
// });

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {

	const emoji = getEmojiFromAddress(address as Address);
	const color = getColorFromAddress(address as Address);

	const getAvatarVaultRead = readpreperations.generic.readAvatarVault(address as Address);

	const avatarAddressRead = readpreperations.generic.readAvatarAddress(getAvatarVaultRead);

	const avatarIDRead = readpreperations.generic.readAvatarID(getAvatarVaultRead);

	const avatarURIRead = readpreperations.generic.readERC721TokenURI(avatarAddressRead as string, avatarIDRead as bigint);

	if (avatarURIRead.data !== undefined) {
		return (
			<img
				src={avatarURIRead.data}
				width={size}
				height={size}
				style={{ borderRadius: 999 }}
			/>
		)
	} else {
		return (
			<div
				style={{
					backgroundColor: color,
					borderRadius: 999,
					height: size,
					width: size,
					display: "flex",
					justifyContent: "center"
				}
				}
			>
				<div
					style={{
						alignSelf: "center"

					}
					}
				>
					{emoji}

				</div>
			</div >
		)

	}

}


// export const metadata: Metadata = {
// 	title: {
// 		default: siteConfig.name,
// 		template: `%s - ${siteConfig.name}`,
// 	},
// 	description: siteConfig.description,
// 	themeColor: [
// 		{media: "(prefers-color-scheme: light)", color: "white" },
// 		{media: "(prefers-color-scheme: dark)", color: "black" },
// 	],
// 	icons: {
// 		icon: "/favicon.ico",
// 		shortcut: "/favicon-16x16.png",
// 		apple: "/apple-touch-icon.png",
// 	},
// };
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<WagmiConfig config={wagmiConfig}>
					<RainbowKitProvider avatar={CustomAvatar} chains={chains}>
						<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
							<div className={styles.mainContainer}>
								<div className={styles.header}>
									<ConnectButton />
								</div>
								<div className={styles.contentContainer}>
									{children}
								</div>
								<div className={styles.footer}>
									<p>v 0.0.1</p>
								</div>
							</div>
						</Providers>
					</RainbowKitProvider>
				</WagmiConfig>
			</body>
		</html >
	);
}
