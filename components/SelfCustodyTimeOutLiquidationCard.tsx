"use client"

import React from 'react';
import { NextPage } from "next";
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, usePrepareContractWrite, useContractEvent, useContractWrite, useContractRead, useContractReads, useBalance, useBlockNumber, useWaitForTransaction } from "wagmi";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Tabs, Tab, Input } from "@nextui-org/react";
import verifiers from '@/helpers/verification';
import writePreperations from '@/helpers/contractWritePrepares';
import { ERC721ContractConfig, ERC20ContractConfig, getAvatarVaultConfig } from "@/helpers/contractConfigurations"

const SelfCustodyTimeOutLiquidationCard: NextPage = () => {
    const { data: blockNumber, isError: isBlockNumberError, isLoading: isblockNumberLoading } = useBlockNumber({ watch: true });


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

    const liquidateTimeOutConfig = writePreperations.selfCustody.liquidateTimeOut(inputERC721Address);
    const liquidateTimeOutWrite = useContractWrite(liquidateTimeOutConfig);
    useWaitForTransaction({
        hash: liquidateTimeOutWrite.data?.hash,
        onSuccess(data) {
            liquidationEvents.map((event) => {
                if (event.txHash == data.transactionHash) {
                    setLiquidationAmount(event.amount);
                    setInputERC721Address("");
                    liquidateTimeOutWrite.reset();
                }
            });
        },
    })

    const conff = getAvatarVaultConfig(inputERC721Address);
    useContractEvent({
        ...conff,
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
                <p>Requirements: Vault is in Self Custody mode and the current block is greater than the self custody block of the vault</p>
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
                    onClick={() => liquidateTimeOutWrite.write?.()}
                    data-write-loading={liquidateTimeOutWrite.isLoading || liquidateTimeOutWrite.isSuccess}
                    isLoading={liquidateTimeOutWrite.isSuccess}
                    isDisabled={!inputERC721AddressValid}
                >
                    {!liquidateTimeOutWrite.isLoading && !liquidateTimeOutWrite.isSuccess && "Liquidate"}
                    {liquidateTimeOutWrite.isLoading && "Waiting for approval"}
                    {liquidateTimeOutWrite.isSuccess && "Liquidating..."}
                </Button>
                <p>Current block: ~{blockNumber?.toString()}</p>
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

export default SelfCustodyTimeOutLiquidationCard;