"use client"

import React from 'react';
import { NextPage } from "next";
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, usePrepareContractWrite, useContractEvent, useContractWrite, useContractRead, useContractReads, useBalance, useWaitForTransaction } from "wagmi";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Tabs, Tab, Input } from "@nextui-org/react";
import verifiers from '@/helpers/verification';
import writePreperations from '@/helpers/contractWritePrepares';
import { ERC721ContractConfig, ERC20ContractConfig, getAvatarVaultConfig } from "@/helpers/contractConfigurations"

const EscrowMovedLiquidationCard: NextPage = () => {

    const [inputERC721Address, setInputERC721Address] = React.useState("");
    const [inputERC721AddressValid, setInputERC721AddressValid] = React.useState(false);
    const [liquidationAmount, setLiquidationAmount] = React.useState(BigInt(0));
    const [liquidationEvents, setLiquidationEvents] = React.useState<{
        txHash: string;
        liquidationType: number;
        subjectVault: `0x${string}`;
        amount: bigint
    }[]>([]);

    //TODO: Only allow valid characters to be type
    function inputERC721AddressUpdate(calldata: string) {
        const isAddress = verifiers.isValidEthereumAddress(calldata);
        setInputERC721Address(calldata);
        if (isAddress) {
            setInputERC721AddressValid(true);
        } else {
            setInputERC721AddressValid(false);
        }
    }

    const liquidateAvatarMovedConfig = writePreperations.escrow.liquidateAvatarMoved(inputERC721Address);
    const liquidateAvatarMovedWrite = useContractWrite(liquidateAvatarMovedConfig);
    useWaitForTransaction({
        hash: liquidateAvatarMovedWrite.data?.hash,
        onSuccess(data) {
            liquidationEvents.map((event) => {
                if (event.txHash == data.transactionHash) {
                    setLiquidationAmount(event.amount);
                }
            })
        },
    })

    const avatarVaultConfig = getAvatarVaultConfig(inputERC721Address);
    useContractEvent({
        ...avatarVaultConfig,
        eventName: 'Liquidation',
        listener(log) {
            const eventargs = log[0].args;
            if (typeof eventargs.amount != "undefined" && typeof eventargs.liquidationType != "undefined" && typeof eventargs.subjectVault != "undefined") {
                setLiquidationEvents([
                    ...liquidationEvents,
                    {
                        txHash: log[0].transactionHash,
                        amount: eventargs.amount,
                        subjectVault: eventargs.subjectVault,
                        liquidationType: eventargs.liquidationType
                    }
                ])
            }
        },
    })

    //TODO: Implement for case when liquidating fails
    return (
        <Card>
            <CardHeader>
                <p>Requirements: Vault in Escrow mode and not the owner of the set avatar</p>
            </CardHeader>
            <Divider />
            <CardBody >
                <Input
                    className={styles.setAvatarInput}
                    key="nftaddress"
                    type="text"
                    value={inputERC721Address}
                    label="Offending Vault Contract Address"
                    placeholder="0x..."
                    onValueChange={(value: string) => inputERC721AddressUpdate(value)}
                />
                <Button
                    className={[styles.button, styles.setAvatarButton].join(" ")}
                    color="primary"
                    onClick={() => liquidateAvatarMovedWrite.write?.()}
                    // data-write-loading={approveERC20Write.isLoading}
                    // isLoading={approveERC20Write.isSuccess && escrowProgess < 80}
                    isDisabled={!inputERC721AddressValid}
                >
                    {!liquidateAvatarMovedWrite.isLoading && !liquidateAvatarMovedWrite.isSuccess && "Liquidate"}
                    {liquidateAvatarMovedWrite.isLoading && "Waiting for approval"}
                    {liquidateAvatarMovedWrite.isSuccess && "Liquidating..."}
                </Button>
            </CardBody>
            <Divider />
            {liquidationAmount > 0 && (
                <CardFooter>
                    <p>Liquidated: {liquidationAmount.toString()} EAC</p>
                </CardFooter>
            )}
        </Card>

    );
};

export default EscrowMovedLiquidationCard;