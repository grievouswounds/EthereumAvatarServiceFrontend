"use client"

import React, { useEffect, useState } from 'react';
import { NextPage } from "next";
import styles from '../../styles/Home.module.css';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";
import { ethereumAvatarService } from "../../abis/EthereumAvatarService-abi";
import { avatarVaultABI } from '../../abis/avatarVault-abi';
import { Button } from '@nextui-org/button';
import { Card, CardHeader, CardBody, CardFooter, Divider, Tab, Tabs, Input, Tooltip, Progress } from "@nextui-org/react";
import { multicall } from 'viem/_types/actions/public/multicall';
import AvatarManager from "../../components/AvatarManager"
import AvatarVaults from '@/components/AvatarVaults';
import AvatarDisplay from '@/components/AvatarDisplay';
import readpreperations from '@/helpers/contractReaders';
import { EASCoinAddress } from "@/helpers/contractAddresses";
import writePreperations from '@/helpers/contractWritePrepares';


const Manage: NextPage = () => {
    const [mounted, setMounted] = React.useState(false);
    const { isConnected, address } = useAccount();

    useEffect(() => {
        setMounted(true)
    }, []);
    //TODO: Errorchecking for blockNumber
    const [userHasExpressionVault, setUserHasExpressionVault] = React.useState(false);
    const [userVaultIsActive, setUserVaultIsActive] = React.useState(false);
    const [userExpressionVaultAddress, setUserExpressionVaultAddress] = React.useState(""); //TODO: fix type
    const [userExpressionType, setUserExpressionType] = React.useState("");
    const [userConnectedAddress, setUserConnectedAddress] = React.useState<`0x${string}`>(() => "0x");
    useEffect(() => {
        if (typeof address === 'string' && address.startsWith('0x')) {
            setUserConnectedAddress(address)
        }
    }, [address]);

    useEffect(() => {
        if (!userHasExpressionVault) {
            createAvatarVaultPrep.refetch();

        }
    }, [])



    const createAvatarVaultPrep = writePreperations.generic.createAvatarVault();
    const createAvatarVaultWrite = useContractWrite(createAvatarVaultPrep.config);

    const getAvatarVaultRead = readpreperations.generic.readAvatarVault(userConnectedAddress);
    useEffect(() => {
        const data = getAvatarVaultRead;
        if (typeof data == "string" && data != "0x0000000000000000000000000000000000000000") {
            setUserHasExpressionVault(true);
            setUserExpressionVaultAddress(data);
        }

    }, [getAvatarVaultRead])

    const vaultIsActiveRead = readpreperations.generic.readAvatarIsActive(userExpressionVaultAddress)
    useEffect(() => {
        if (typeof vaultIsActiveRead == "undefined") {
            setUserVaultIsActive(false);
        } else {
            setUserVaultIsActive(vaultIsActiveRead);
        }
    }, [vaultIsActiveRead]);

    const vaultTypeOfExpressionRead = readpreperations.generic.readVaultMode(userExpressionVaultAddress)
    useEffect(() => {
        if (typeof vaultTypeOfExpressionRead == "undefined") {
            setUserExpressionType("");
        } else {
            switch (vaultTypeOfExpressionRead) {
                case 0:
                    setUserExpressionType("None");
                    break;
                case 1:
                    setUserExpressionType("Escrow");
                    break;
                case 2:
                    setUserExpressionType("Self Custody");
                    break;
            }
        }
    }, [vaultTypeOfExpressionRead]);



    //TODO: add logic for inputboxes that handle numbers to only accept numbers to be entered
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

            {mounted && isConnected && !userHasExpressionVault && (
                <div className={styles.noVaultContainer}>
                    <p className={styles.description}>
                        You don&apos;t have an avatar vault yet. Set one up below.
                    </p>
                    <Button
                        className={styles.button}
                        onClick={() => createAvatarVaultWrite.write?.()}
                        data-write-loading={createAvatarVaultWrite.isLoading || createAvatarVaultWrite.isSuccess}
                        isLoading={createAvatarVaultWrite.isSuccess}
                    >
                        Create Vault
                    </Button>
                </div>

            )}

            {mounted && isConnected && userHasExpressionVault && (
                <div className={styles.manageContents}>
                    <AvatarManager
                        userExpressionType={userExpressionType}
                        userExpressionVaultAddress={userExpressionVaultAddress}
                    >
                    </AvatarManager>

                    <AvatarDisplay
                        userExpressionType={userExpressionType}
                        userExpressionVaultAddress={userExpressionVaultAddress}
                    />
                    <AvatarVaults
                        userExpressionVaultAddress={userExpressionVaultAddress}
                        userExpressionType={userExpressionType}
                        userVaultIsActive={userVaultIsActive}
                    />
                </div>
            )}

        </div >
    );
};

export default Manage;