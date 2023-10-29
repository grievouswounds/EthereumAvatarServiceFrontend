"use client"

import React from 'react';
import { NextPage } from "next";
import styles from '../../styles/Home.module.css';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead, useContractReads, useBalance } from "wagmi";
import { easTokenABI } from '../../abis/EASToken-abi';
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Tabs, Tab, Input } from "@nextui-org/react";
import EscrowMovedLiquidationCard from "@/components/EscrowMovedLiquidationCard";
import SelfCustodyTimeOutLiquidationCard from '@/components/SelfCustodyTimeOutLiquidationCard';
import SelfCustodyNewOwnerLiquidationCard from "@/components/SelfCustodyNewOwnerLiquidationCard";

const expressionCoinContractConfig = {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: easTokenABI,
} as const;

const Liquidate: NextPage = () => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const { isConnected, address } = useAccount();

    return (
        <div className={styles.container}>
            <p className={styles.title}>
                Liquidate
            </p>
            {mounted && !isConnected && (
                <div>
                    <h2>Connect your wallet to get started</h2>
                </div>
            )}

            {mounted && isConnected && (
                <div>
                    <p className={styles.description}>
                        Earn EAS coins by liquidating missbehaving avatar vaults
                    </p>
                    <Tabs
                        className={styles.tabs}
                        aria-label="LiquidationOptions"
                        fullWidth
                    >
                        <Tab title="Escrow Moved">
                            <EscrowMovedLiquidationCard />

                        </Tab>
                        <Tab title="Self Custody Time Out">
                            <SelfCustodyTimeOutLiquidationCard />
                        </Tab>
                        <Tab title="Self Custody New Owner">
                            <SelfCustodyNewOwnerLiquidationCard />
                        </Tab>
                    </Tabs>
                </div>

            )
            }

        </div >
    );
};

export default Liquidate;