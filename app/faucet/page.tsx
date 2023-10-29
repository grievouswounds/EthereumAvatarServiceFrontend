"use client"

import React, { useEffect, useState } from 'react';
import { NextPage } from "next";
import styles from '../../styles/Home.module.css';
import { useAccount, useContractWrite } from "wagmi";
import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import writePreperations from '@/helpers/contractWritePrepares';
import readpreperations from '@/helpers/contractReaders';
import { EASCoinAddress } from "@/helpers/contractAddresses";



const Faucet: NextPage = () => {
    const [mounted, setMounted] = useState(false);
    const { isConnected, address } = useAccount();

    useEffect(() => setMounted(true), []);

    const [userEASBalance, setUserEASBalance] = useState(BigInt(-1));

    const [userConnectedAddress, setUserConnectedAddress] = useState<`0x${string}`>(() => "0x");
    useEffect(() => {
        if (typeof address === 'string' && address.startsWith('0x')) {
            setUserConnectedAddress(address)
        }
    }, [address]);

    const mintFaucetPrep = writePreperations.random.mintFaucet();
    const mintFaucetWrite = useContractWrite(mintFaucetPrep.config);


    const balanceOfRead = readpreperations.generic.readERC20BalanceOf(EASCoinAddress, userConnectedAddress);
    useEffect(() => {
        if (typeof balanceOfRead == "undefined") {
            setUserEASBalance(BigInt(-1));
        } else {
            setUserEASBalance(BigInt(balanceOfRead));
        }
    }, [balanceOfRead])


    return (
        <div className={styles.container}>
            <p className={styles.title}>
                Manage vault
            </p>
            {mounted && !isConnected && (
                <div>
                    <p className={styles.description}>
                        Connect your wallet to get started
                    </p>
                </div>
            )}

            {mounted && isConnected && (
                <div>
                    <p className={styles.description}>
                        Get some free EAS coins
                    </p>
                    <Card>
                        <CardHeader>
                            <p>Current EAS balance: {userEASBalance?.toString()}</p>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <Button
                                className={styles.button}
                                color="primary"
                                onClick={() => mintFaucetWrite.write?.()}
                                disabled={mintFaucetWrite.isLoading}
                                data-write-loading={mintFaucetWrite.isLoading}
                                data-mint-started={mintFaucetWrite.isSuccess}
                                isLoading={mintFaucetWrite.isLoading}
                            >
                                {mintFaucetWrite.isLoading && "Waiting for approval"}
                                {!mintFaucetWrite.isLoading && "Mint"}
                            </Button>
                        </CardBody>
                        <Divider />

                    </Card>
                </div>

            )}

        </div>
    );
};

export default Faucet;